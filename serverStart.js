//Global variable declarations
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var session = require('express-session');
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const shortid = require('shortid');
const { resourceUsage } = require('process');

//Create a variable to hold who is currently logged in
currentUser = null;

//Working with session
app.use(
  session({
    secret: 'qwerty',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 8 * 60 * 60 * 1000,
    },
  })
);

//app.use setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use(bodyParser.json());

/*SETTING UP AND ACCESSING data.json FILE*/ 
//validation of object in the database
var obj;
var exists = fs.existsSync(path.join(__dirname, 'data', 'data.json'));

if (exists) {
  var mydata = fs.readFileSync(path.join(__dirname, 'data', 'data.json')); //Use existing file
  obj = JSON.parse(mydata); //Parse it  back to object

  console.log('Successfully loaded file data.json');
} else {
  obj = { //Fill the obj with appropriate keys and empty arrays
    Users: [],
    Owners: []
  };

  //Write data to the file and notify via console
  fs.writeFile(
    path.join(__dirname, 'data', 'data.json'),
    JSON.stringify(obj, null, 2),
    fileCreated
  );
  function fileCreated() {
    console.log('Successfully created new file data.json');
  }
}

// Return data.json to be used in HTML with fetch request
app.get('/data', function (req, res) {
  res.sendFile(__dirname + '/data/data.json');
});


/*** LANDING PAGE ***/
// Route to landing page
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


/*** LOGIN ***/
//Obtain login info and check credentials
app.post('/login', function (req, res) {
  //Get login details
  var accountInfo = {
    email: req.body.email,
    password: req.body.password,
  };

  var check = false; //Create a check for if/when we find the user

  //Go through users to find matching username and password and if found store them in currentUser variable
  for (let i = 0; i < obj.Users.length; i++) {
    if (
      obj.Users[i].email == accountInfo.email &&
      obj.Users[i].password == accountInfo.password
    ) {
      check = true;
      req.session.loggedin = true;
      req.session.name = obj.Users[i].fName;
      currentUser = obj.Users[i];
      console.log(currentUser);
      console.log(
        'Successful user login occurred of account ' + req.session.name
      );
      res.redirect('/user/home');
      break;
    }
  }

  //Go through owners to find matching username and password if not found in users
  if (!check) {
    for (let i = 0; i < obj.Owners.length; i++) {
      if (
        obj.Owners[i].email == accountInfo.email &&
        obj.Owners[i].password == accountInfo.password
      ) {
        check = true;
        req.session.loggedin = true;
        req.session.name = obj.Owners[i].fName;
        currentUser = obj.Owners[i];
        console.log(currentUser);
        console.log(
          'Successful owner login occurred of account ' + req.session.name
        );
        res.redirect('/owner/home');
        break;
      }
    }
  }

  //If matching credentials were not found login
  if (!check) {
    console.log('A login attempt was made.');
    res.send('Sorry, incorrect credentials.');
  }
});


/*** OWNER/USER REGISTRATION ***/
//POST new owner/user information
//route to owner/user registration
app.get('/SignUp', function (req, res) {
  res.sendFile(__dirname + '/SignUp.html');
});

//Post API for registering the user based on information given on Signup page
app.post('/SignUp', urlencodedParser, function (req, res) {
  check = false; //Create a check for ensuring no duplicate emails

  //Go through both users and owners emails
  obj.Users.forEach(user => {
    if (user.email == req.body.email) {
      check = true;
    }
  });
  obj.Owners.forEach(owner => {
    if (owner.email == req.body.email) {
      check = true;
    }
  });

  //If it is a user account and the email is not already in use get account info
  if (req.body.status == 'user' && !check) {
    var accountInfo = {
      fName: req.body.fName,
      lName: req.body.lName,
      idNumber: req.body.idNumber,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      password: req.body.password,
      rented: [],
    };

    //Push it as an object to Users array
    obj.Users.push(accountInfo);
    
    req.session.loggedin = true;
    req.session.name = accountInfo.fName;
    currentUser = accountInfo; //Store the account info as the currentUser object for later manipulation with the webpage
  }
  //If it is an owner account and the email is not already in use get account info
  else if(req.body.status == 'owner' && !check) {
    var accountInfo = {
      fName: req.body.fName,
      lName: req.body.lName,
      idNumber: req.body.idNumber,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      password: req.body.password,
      ratings: [],
      properties: [],
    };
    
    //Push it as an object to Owners array
    obj.Owners.push(accountInfo);
    
    req.session.loggedin = true;
    req.session.name = accountInfo.fName;
    currentUser = accountInfo; //Store the account info as the currentUser object for later manipulation with the webpage
  }

  //Update the file with the new information
  fs.writeFile(
    path.join(__dirname, 'data', 'data.json'),
    JSON.stringify(obj, null, 2),
    registered
  );
  
  function registered() {
    //If the email was found notify user and have them try again with a different email
    if (check) {
      console.log("User tried to make account with in use email.")
      res.send("Sorry that email is already in use, please try something else.")
    }
    //Otherwise if they are a user send them to the user home page
    else if (req.body.status == 'user') {
      console.log('New user created.');
      res.redirect('/user/home');
    }
    
    //Otherwise if they are an owner send them to the owner home page
    else {
      console.log('New owner created.');
      res.redirect('/owner/home');
    }
  }
});


/*** LOGOUT ***/
app.get('/logout', function (req, res) {
  currentUser = null;
  res.redirect('/');
});


/*** USER PAGE ***/
// Route to user's home page (when logged in as a user)
app.get('/user/home', function (req, res) {
  if (currentUser === null) {
    res.send("Sorry, you need to login <a href='/'>here</a> first!");
  } else {
    res.sendFile(path.join(__dirname, '/user/home.html'));
  }
});

// Route to user's profile page (when logged in as a user)
app.get('/user/profile', function (req, res) {
  if (currentUser === null) {
    res.send("Sorry, you need to login <a href='/'>here</a> first!");
  } else {
    res.sendFile(path.join(__dirname, '/user/profile.html'));
  }
});

// Route to available workspaces page (when logged in as a user)
app.get('/user/workspaces', function (req, res) {
  if (currentUser === null) {
    res.send("Sorry, you need to login <a href='/'>here</a> first!");
  } else {
    res.sendFile(path.join(__dirname, '/user/workspaces.html'));
  }
});

/*Currently not in use!!

// Route to user's rentals page (when logged in as a user)
app.get('/user/rentals', function (req, res) {
  if (currentUser === null) {
    res.send("Sorry, you need to login <a href='/'>here</a> first!");
  } else {
    res.sendFile(path.join(__dirname, '/user/rentals.html'));
  }
});

*/


/*** OWNER PAGE ***/
// Route to owner's home page (when logged in as an owner)
app.get('/owner/home', function (req, res) {
  if (currentUser === null) {
    res.send("Sorry, you need to login <a href='/'>here</a> first!");
  } else {
    res.sendFile(path.join(__dirname, '/owner/home.html'));
  }
});

// Route to owner's profile page (when logged in as an owner)
app.get('/owner/profile', function (req, res) {
  if (currentUser === null) {
    res.send("Sorry, you need to login <a href='/'>here</a> first!");
  } else {
    res.sendFile(path.join(__dirname, '/owner/profile.html'));
  }
});

// Route to owner's properties page (when logged in as an owner)
app.get('/owner/properties', function (req, res) {
  if (currentUser === null) {
    res.send("Sorry, you need to login <a href='/'>here</a> first!");
  } else {
    res.sendFile(path.join(__dirname, '/owner/properties.html'));
  }
});

// Route to owner's workspaces page (when logged in as an owner)
app.get('/owner/workspaces', function (req, res) {
  if (currentUser === null) {
    res.send("Sorry, you need to login <a href='/'>here</a> first!");
  } else {
    res.sendFile(path.join(__dirname, '/owner/workspaces.html'));
  }
});


/*** UPDATE AND DELETE USER ***/
//Update user info
app.post('/updateUser', urlencodedParser, function (req, res) {
  check = false;//Create a check for ensuring no duplicate emails

  //Go through both users and owners emails and check that the user email does not exist and is not in use unless by the currentUser
  obj.Users.forEach(user => {
    if (user.email == req.body.email && currentUser.email!= req.body.email) {
      check = true;
    }
  });
  obj.Owners.forEach(owner => {
    if (owner.email == req.body.email && currentUser.email!= req.body.email) {
      check = true;
    }
  });

  //If the email is not already in use by anyone other then current user
  if (!check) {
    for (let i = 0; i < obj.Users.length; i++) {
      if (obj.Users[i].email == currentUser.email) {
        obj.Users[i].fName = req.body.fName;
        obj.Users[i].lName = req.body.lName;
        obj.Users[i].idNumber = req.body.idNumber;
        obj.Users[i].phoneNumber = req.body.phoneNumber;
        obj.Users[i].email = req.body.email;
        obj.Users[i].password = req.body.password;
        break;
      }
    }
  }

  //Update the file with the new information
  fs.writeFile(
    path.join(__dirname, 'data', 'data.json'),
    JSON.stringify(obj, null, 2),
    userUpdated
  );

  function userUpdated() {
    if (check) {
      //If the email was found notify user and have them try again with a different email
      console.log("User tried to update account with in use email.")
      res.send("Sorry that email is already in use, please try something else.")
    } 
    //Otherwise send them back to their profile
    else {
      console.log('User updated.');
      res.redirect('/user/profile');
    }
  }
});

//Delete user info
app.post('/deleteUser', function (req, res) {
  //Go through the users array find the current user and remove them from the users array
  for (let i = 0; i < obj.Users.length; i++) {
    if (obj.Users[i].email == currentUser.email) {
      obj.Users.splice(i, 1);
      break;
    }
  }

  //Update file
  fs.writeFile(
    path.join(__dirname, 'data', 'data.json'),
    JSON.stringify(obj, null, 2),
    userDeleted
  );

  //Inform via the console and run the logout get request to send them to home page and set current user to null
  function userDeleted() {
    console.log('User deleted.');
    res.redirect('/logout');
  }
});

/*** UPDATE AND DELETE OWNER ***/
//Update owner info
app.post('/updateOwner', urlencodedParser, function (req, res) {
  check = false;//Create a check for ensuring no duplicate emails

  //Go through both users and owners emails
  obj.Users.forEach(user => {
    if (user.email == req.body.email && currentUser.email!= req.body.email) {
      check = true;
    }
  });
  obj.Owners.forEach(owner => {
    if (owner.email == req.body.email && currentUser.email!= req.body.email) {
      check = true;
    }
  });
  if (!check) {
    for (let i = 0; i < obj.Owners.length; i++) {
      if (obj.Owners[i].email == currentUser.email) {
        obj.Owners[i].fName = req.body.fName;
        obj.Owners[i].lName = req.body.lName;
        obj.Owners[i].idNumber = req.body.idNumber;
        obj.Owners[i].phoneNumber = req.body.phoneNumber;
        obj.Owners[i].email = req.body.email;
        obj.Owners[i].password = req.body.password;
        break;
      }
    }
  }

  //Update the file with the new information
  fs.writeFile(
    path.join(__dirname, 'data', 'data.json'),
    JSON.stringify(obj, null, 2),
    ownerUpdated
  );
  function ownerUpdated() {
    if (check) {
      console.log("User tried to update account with in use email.")
      res.send("Sorry that email is already in use, please try something else.")
    } else {
      console.log('Owner updated.');
      res.redirect('/owner/profile');
    }
  }
});

//Delete owner info
app.post('/deleteOwner', function (req, res) {
  for (let i = 0; i < obj.Owners.length; i++) {
    if (obj.Owners[i].email == currentUser.email) {
      obj.Owners.splice(i, 1);
      break;
    }
  }

  fs.writeFile(
    path.join(__dirname, 'data', 'data.json'),
    JSON.stringify(obj, null, 2),
    ownerDeleted
  );
  function ownerDeleted() {
    console.log('Owner deleted.');
    res.redirect('/logout');
  }
});

//CURRENT USER API
app.get('/currentUser', function (req, res) {
  res.send(currentUser);
  console.log(currentUser);
  console.log('API called! Delivering info about ' + currentUser.fName);
});

app.get('/currentproperty', urlencodedParser, function (req, res) {
  res.send(currentUser.properties);
  console.log(currentUser);
  //console.log('API called! Delivering info about ' + currentUser.fName);
});

/*** PROPERTY PAGES ***/

// ROUTE TO "CREATE PROPERTY" PAGE
app.get('/owner/properties/create', function (req, res) {
  if (currentUser === null) {
    res.send("Sorry, you need to login <a href='/'>here</a> first!");
  } else {
    res.sendFile(__dirname + '/owner/properties/create-property.html');
  }
});

// ROUTE TO "PROPERTY CREATED" PAGE
app.post('/owner/properties/property-created', urlencodedParser, function (req, res) {
    var check = false;
    currentUser.properties.forEach(element => {
      if (req.body.name == element.name) check = true;
    })
    if (check) {
      console.log("Property with this name exists already."); //debug
      res.send(
        'A property this name already exists.<br>To return, click <a href="/owner/properties/create">here</a>.'
      )
    }
    else { //if check is false, it means property name is unique.
      var property = {
        name: req.body.name,
        listed: req.body.listed,
        address: req.body.address,
        park: req.body.park,
        transport: req.body.transport,
        neigh: req.body.neigh,
        size: req.body.size,
        workspaces: [],
      };
      //console.log("Test"); //debug
      currentUser.properties.push(property);
      console.log(currentUser); //debug

      //Update the file with the new information
      fs.writeFile(
        path.join(__dirname, 'data', 'data.json'),
        JSON.stringify(obj, null, 2),
        propertyAdded
      );
      function propertyAdded() {
        console.log('New property added.');
        //res.redirect('/propertyIn'); //placeholder
        res.send(
          'A new property has been created.<br>To return, click <a href="/owner/properties/create">here</a>.'
        );
      }
    }
  }
);

// ROUTE TO "UPDATE PROPERTY" PAGE
app.get('/owner/properties/update', function (req, res) {
  if (currentUser === null) {
    res.send("Sorry, you need to login <a href='/'>here</a> first!");
  } else {
    res.sendFile(__dirname + '/owner/properties/update-property.html');
  }
});

// ROUTE TO "PROPERTY UPDATED" PAGE
app.post(
  '/owner/properties/property-updated',
  urlencodedParser,
  function (req, res) {
    var check = false;
    currentUser.properties.forEach(element => {
      if (req.body.name == element.name) check = true;
    })
    if (!check) { //if for any reason the user manages to change the name (which should be impossible).
      console.log("Property with this name doesn't exist."); //debug
      res.send(
        'A property with this name does not exists.<br>To return, click <a href="/owner/properties/update">here</a>.'
      )
    }
    else { //if check is false, it means property name is unique.
      currentUser.properties.forEach(element => {
        if (req.body.name == element.name) {
          element.address = req.body.address;
          element.listed = req.body.listed;
          element.park = req.body.park;
          element.neigh = req.body.neigh;
          element.size = req.body.size;
          element.transport = req.body.transport;
          console.log("Property " + element.name + "has been updated."); //debug

          fs.writeFile(
            path.join(__dirname, 'data', 'data.json'),
            JSON.stringify(obj, null, 2),
            propertyUpdated
          );
          function propertyUpdated() {
            console.log('Updated property.');
            res.send(
              'The property was updated.<br>To return, click <a href="/owner/properties/update">here</a>.'
            )
          }

        };
      })
    }
  }
);

// ROUTE TO "DELETE PROPERTY" PAGE
app.get('/owner/properties/delete', function (req, res) {
  if (currentUser === null) {
    res.send("Sorry, you need to login <a href='/'>here</a> first!");
  } else {
    res.sendFile(__dirname + '/owner/properties/delete-property.html');
  }
});

// ROUTE TO "PROPERTY DELETED" PAGE
app.post(
  '/owner/properties/property-deleted',
  urlencodedParser,
  function (req, res) {
    var check = false;
    currentUser.properties.forEach(element => {
      if (req.body.name == element.name) check = true;
    })
    if (!check) { //if for any reason the user manages to change the name (which should be impossible).
      console.log("Property with this name doesn't exist."); //debug
      res.send(
        'A property with this name does not exists.<br>To return, click <a href="/owner/properties/delete">here</a>.'
      )
    }
    else { //if check is false, it means property name is unique.
      for (var i = 0; i < currentUser.properties.length; i++) {
        if (req.body.name == currentUser.properties[i].name) {
          currentUser.properties.splice(i, 1);
          fs.writeFile(
            path.join(__dirname, 'data', 'data.json'),
            JSON.stringify(obj, null, 2),
            propertyDeleted
          );
          function propertyDeleted() {
            console.log('Deleted property.');
            res.send(
              'The property was deleted.<br>To return, click <a href="/owner/properties/update">here</a>.'
            )
          }
        };
      }
    }
  }
);


/*** WORKSPACE PAGES ***/

// ROUTE TO "CREATE WORKSPACE" PAGE
app.get('/owner/workspaces/create', function (req, res) {
  if (currentUser === null) {
    res.send("Sorry, you need to login <a href='/'>here</a> first!");
  } else {
    res.sendFile(__dirname + '/owner/workspaces/create-workspace.html');
  }
});

// ROUTE TO "WORKSPACE CREATED" PAGE
app.post('/owner/workspaces/workspace-created', urlencodedParser, function (req, res) {
  var check = false;
  for (let i = 0; i < currentUser.properties.length; i++) {
    if (currentUser.properties[i].name == req.body.property) {
      currentUser.properties[i].workspaces.forEach(element => {
        if (req.body.name == element.name) {
          check = true;
        }
    })}
  }

  if (check) {
    //console.log("A workspace with this name exists already."); //debug
    res.send('A workspace with this name already exists.<br>To return, click <a href="/owner/workspaces/create">here</a>.')
  }
  else {
  
    var propertyName = req.body.property;
    var workspace = {
      id: shortid.generate(), // Auto-generate ID
      name: req.body.name,
      type: req.body.type,
      smoking: req.body.smoking,
      seats: req.body.seats,
      availability: req.body.availability,
      leaseterm: req.body.leaseterm,
      price: req.body.price,
      listed: req.body.listed,
      reviews: [],
      rating: 0
    };

    const currentProperty = currentUser.properties.find(
      // Find property that matches propertyName
      property => property.name === propertyName
    );

    propertyIndex = currentUser.properties.indexOf(currentProperty, 0); // Index of currentProperty within currentUser's properties

    ownerIndex = obj.Owners.indexOf(currentUser, 0); // Index of currentUser within Owners[]

    obj.Owners[ownerIndex].properties[propertyIndex].workspaces.push(workspace);

    //Update data.json with the new information
    fs.writeFile(
      path.join(__dirname, 'data', 'data.json'),
      JSON.stringify(obj, null, 2),
      workspaceCreated
    );
    function workspaceCreated() {
      console.log('New workspace created.');
      res.send('A new workspace has been created.<br>To return home, click <a href="/owner/workspaces">here</a>.');
    }
  }
});

// ROUTE TO "UPDATE WORKSPACE" PAGE
app.get('/owner/workspaces/update', function (req, res) {
  if (currentUser === null) {
    res.send("Sorry, you need to login <a href='/'>here</a> first!");
  } else {
    res.sendFile(__dirname + '/owner/workspaces/update-workspace.html');
  }
});

// ROUTE TO "WORKSPACE UPDATED" PAGE
app.post('/owner/workspaces/workspace-updated', urlencodedParser, UpdateWorkspace);

// Get data from "Update Workspace" form and add it to "obj"
function UpdateWorkspace(req, res) {

  var check = false;
  for (let i = 0; i < currentUser.properties.length; i++) {
    if (currentUser.properties[i].name == req.body.property) {
      currentUser.properties[i].workspaces.forEach(element => {
        if (req.body.name == element.name) {
          check = true;
        }
    })}
  }

  if (check) {
    // console.log("A workspace with this name exists already."); //debug
    res.send('A workspace with this name already exists.<br>To return, click <a href="/owner/workspaces/create">here</a>.')
  }
  else {
  var propertyName = req.body.property;
  var id = req.body.id;

  var name = req.body.name;
  var type = req.body.type;
  var smoking = req.body.smoking;
  var seats = req.body.seats;
  var availability = req.body.availability;
  var leaseterm = req.body.leaseterm;
  var price = req.body.price;
  var listed = req.body.listed;

  const currentProperty = currentUser.properties.find(
    // Find property that matches propertyName
    property => property.name === propertyName
  );

  ownerIndex = obj.Owners.indexOf(currentUser, 0); // Index of currentUser within Owners[]

  propertyIndex = currentUser.properties.indexOf(currentProperty, 0); // Index of currentProperty within currentUser's properties

  const workspaceToUpdate = obj.Owners[ownerIndex].properties[propertyIndex].workspaces.find(workspace => workspace.id === id);

  workspaceToUpdate.name = name;
  workspaceToUpdate.type = type;
  workspaceToUpdate.smoking = smoking;
  workspaceToUpdate.seats = seats;
  workspaceToUpdate.availability = availability;
  workspaceToUpdate.leaseterm = leaseterm;
  workspaceToUpdate.price = price;
  workspaceToUpdate.listed = listed;

  let data = JSON.stringify(obj, null, 1);
  fs.writeFile('data/data.json', data, Updated);
  function Updated() {
    console.log('Workspace updated.');
    res.send('Workspace has been updated.<br>To return home, click <a href="/owner/workspaces">here</a>.');
  }}
}

// ROUTE TO "DELETE WORKSPACE" PAGE
app.get('/owner/workspaces/delete', function (req, res) {
  if (currentUser === null) {
    res.send("Sorry, you need to login <a href='/'>here</a> first!");
  } else {
    res.sendFile(__dirname + '/owner/workspaces/delete-workspace.html');
  }
});

// ROUTE TO "WORKSPACE DELETED" PAGE
app.post('/owner/workspaces/workspace-deleted', urlencodedParser, DeleteWorkspace);

// Delete workspace from json logic
function DeleteWorkspace(req, res) {
  // Select workspace dropdown
  var selectedWorkspace = req.body.types;
  var workspaceToDelete;
  var newWorkspacesArray;

  for (let i = 0; i < currentUser.properties.length; i++) {
    currentUser.properties[i].workspaces.forEach(element => {
      if (element.name == selectedWorkspace) {
        workspaceToDelete = element;
      }
    })
  }

  for (let i = 0; i < currentUser.properties.length; i++) {
    currentUser.properties[i].workspaces.forEach(element => {
      newWorkspacesArray = currentUser.properties[i].workspaces.filter(element => { return element !== workspaceToDelete });
      currentUser.properties[i].workspaces = newWorkspacesArray;
    })
  }

  fs.writeFileSync('data/data.json', JSON.stringify(obj, null, 2));
  console.log('Workspace deleted.');
  res.send('The workspace called *' + selectedWorkspace + '* was successfully deleted!<br>To return home, click <a href="/owner/workspaces">here</a>.');
}

// API - retrieve all workspaces
app.get('/owner/workspaces/api', function (req, res) {
  let allWorkspaces = obj.Workspaces;
  res.send(allWorkspaces);
});

var server = app.listen(1007, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log(`Server is running on http://localhost:${port}`);
});

app.post('/user/workspace-rated', urlencodedParser, function (req, res) {
  console.log(req.body.email);
  console.log(req.body.workspace);
  console.log(req.body.propname);
  var wsOwner = req.body.email;
  var wsName = req.body.workspace;
  var wsProp = req.body.propname;
  const date = new Date()
  console.log(date);
  var rate = {
    username: currentUser.fName + " " + currentUser.lName,
    useremail: currentUser.email,
    rating: req.body.rating, //placeholder variable
    review: req.body.review, //placeholder variable
    date: date.getHours() + ":" + date.getMinutes() + ", " + date.getDate() + "/" + date.getMonth()+1 + "/" + date.getFullYear()
    
  }
  console.log(rate)
  for (var i = 0; i < obj.Owners.length; i++){
    console.log("Checking " + obj.Owners[i].email + " against " + wsOwner + ".");
    if (obj.Owners[i].email == wsOwner){
      for (var j = 0; j < obj.Owners[i].properties.length; j++){
        console.log("Property: " + obj.Owners[i],properties[i].name  + " against " + wsProp + ".");
        if (obj.Owners[i].properties[j].name == wsProp){
          for (var k = 0; i < obj.Owners[i].properties[j].workspaces.length; k++){
            console.log("On workspace: " + obj.Owners[i],properties[i].workspaces[k].name  + " against " + wsName + "."); //debuging purposes.
            if (obj.Owners[i].properties[j].workspaces[k].name == wsName){
              console.log("Found!");
              obj.Owners[i].properties[j].workspaces[k].reviews.push(rate);
              console.log(obj.Owners[i].properties[j].workspaces[k].reviews);
              break;
            }
          }
        }
      }
    }
  }

  fs.writeFile(
    path.join(__dirname, 'data', 'data.json'),
    JSON.stringify(obj, null, 2),
    reviewAdded
  )

  function reviewAdded() {
    console.log('Review added/updated.');
    //res.redirect('/propertyIn'); //placeholder
    res.send(
      'Thank you for rating this workspace.<br>To return, click <a href="/user/workspaces">here</a>.'
    );
  }
}
);