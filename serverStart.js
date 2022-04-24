var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var session = require('express-session');
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const shortid = require('shortid');
const { resourceUsage } = require('process');

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

//validation of object in the database
var obj;
var exists = fs.existsSync(path.join(__dirname, 'data', 'data.json'));

if (exists) {
  //Use existing file
  var mydata = fs.readFileSync(path.join(__dirname, 'data', 'data.json'));
  // Parse it  back to object
  obj = JSON.parse(mydata);
  console.log('Successfully loaded file data.json');
} else {
  obj = {
    Users: [],
    Owners: [],
    Properties: [],
    Workspaces: [],
  };
  fs.writeFile(
    path.join(__dirname, 'data', 'data.json'),
    JSON.stringify(obj, null, 2),
    fileCreated
  );
  function fileCreated() {
    console.log('Successfully created new file data.json');
  }
}

//Create a variable to hold who is currently logged in
currentUser = null;

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

  var flag = false; //Create a flag for if/when we find the user

  //Go through users to find matching username and password
  for (let i = 0; i < obj.Users.length; i++) {
    if (
      obj.Users[i].email == accountInfo.email &&
      obj.Users[i].password == accountInfo.password
    ) {
      flag = true;
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
  if (!flag) {
    for (let i = 0; i < obj.Owners.length; i++) {
      if (
        obj.Owners[i].email == accountInfo.email &&
        obj.Owners[i].password == accountInfo.password
      ) {
        flag = true;
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
  if (!flag) {
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
  if (req.body.status == 'user') {
    //If they are a user store them as user
    var accountInfo = {
      fName: req.body.fName,
      lName: req.body.lName,
      idNumber: req.body.idNumber,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      password: req.body.password,
      rating: 5,
      rented: [],
    };
    obj.Users.push(accountInfo);
  } else {
    //Otherwise store them as owner, since there are only 2 options
    var accountInfo = {
      fName: req.body.fName,
      lName: req.body.lName,
      idNumber: req.body.idNumber,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      password: req.body.password,
      rating: 5,
      properties: [],
    };
    obj.Owners.push(accountInfo);
  }

  req.session.loggedin = true;
  req.session.name = accountInfo.fName;
  currentUser = accountInfo;

  //Update the file with the new information
  fs.writeFile(
    path.join(__dirname, 'data', 'data.json'),
    JSON.stringify(obj, null, 2),
    registered
  );
  function registered() {
    if (req.body.status == 'user') {
      console.log('New user created.');
      res.redirect('/user/home');
    } else {
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

app.get('/user/profile', function (req, res) {
  if (currentUser === null) {
    res.send("Sorry, you need to login <a href='/'>here</a> first!");
  } else {
    res.sendFile(path.join(__dirname, '/user/profile.html'));
  }
  console.log(currentUser);
});

// Route to user's rentals page (when logged in as a user)
app.get('/user/rentals', function (req, res) {
  if (currentUser === null) {
    res.send("Sorry, you need to login <a href='/'>here</a> first!");
  } else {
    res.sendFile(path.join(__dirname, '/user/rentals.html'));
  }
});

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

  //Update the file with the new information
  fs.writeFile(
    path.join(__dirname, 'data', 'data.json'),
    JSON.stringify(obj, null, 2),
    userUpdated
  );
  function userUpdated() {
    console.log('User updated.');
    res.redirect('/user/profile');
  }
});

//Delete user info
app.post('/deleteUser', function (req, res) {
  for (let i = 0; i < obj.Users.length; i++) {
    if (obj.Users[i].email == currentUser.email) {
      obj.Users.splice(i, 1);
      break;
    }
  }

  fs.writeFile(
    path.join(__dirname, 'data', 'data.json'),
    JSON.stringify(obj, null, 2),
    userDeleted
  );
  function userDeleted() {
    console.log('User deleted.');
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
  res.sendFile(__dirname + '/owner/properties/create-property.html');
});

// ROUTE TO "PROPERTY CREATED" PAGE
app.post(
  '/owner/properties/property-created',
  urlencodedParser,
  function (req, res) {
    var check = false;
    currentUser.properties.forEach (element => {
      if (req.body.name == element.name) check = true;
    })
    if (check){
      console.log("Property with this name exists already."); //debug
      res.send(
        'A property this name already exists.<br>To return, click <a href="/owner/properties/create">here</a>.'
      )
    }
    else{ //if check is false, it means property name is unique.
      var property = {
      name: req.body.name,
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
  res.sendFile(__dirname + '/owner/properties/update-property.html');
});

// ROUTE TO "PROPERTY UPDATED" PAGE
app.post(
  '/owner/properties/property-updated',
  urlencodedParser,
  function (req, res) {
    var check = false;
    currentUser.properties.forEach (element => {
      if (req.body.name == element.name) check = true;
    })
    if (!check){ //if for any reason the user manages to change the name (which should be impossible).
      console.log("Property with this name doesn't exist."); //debug
      res.send(
        'A property with this name does not exists.<br>To return, click <a href="/owner/properties/update">here</a>.'
      )
    }
    else{ //if check is false, it means property name is unique.
      currentUser.properties.forEach (element => {
        if (req.body.name == element.name) {
          element.address = req.body.address;
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
  res.sendFile(__dirname + '/owner/properties/delete-property.html');
});

// ROUTE TO "PROPERTY DELETED" PAGE
app.post(
  '/owner/properties/property-deleted',
  urlencodedParser,
  function (req, res) {
    var check = false;
    currentUser.properties.forEach (element => {
      if (req.body.name == element.name) check = true;
    })
    if (!check){ //if for any reason the user manages to change the name (which should be impossible).
      console.log("Property with this name doesn't exist."); //debug
      res.send(
        'A property with this name does not exists.<br>To return, click <a href="/owner/properties/delete">here</a>.'
      )
    }
    else{ //if check is false, it means property name is unique.
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
  res.sendFile(__dirname + '/owner/workspaces/create-workspace.html');
});

// ROUTE TO "WORKSPACE CREATED" PAGE
app.post('/owner/workspaces/workspace-created', urlencodedParser, function (req, res) {
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
);

// ROUTE TO "UPDATE WORKSPACE" PAGE
app.get('/owner/workspaces/update', function (req, res) {
  res.sendFile(__dirname + '/owner/workspaces/update-workspace.html');

  // Return data.json to be used in HTML
  app.get('/data/data.json', function (req, res) {
    res.sendFile(__dirname + '/data/data.json');
  });

  // ROUTE TO "WORKSPACE UPDATED" PAGE
  app.post('/owner/workspaces/workspace-updated', urlencodedParser, UpdateWorkspace);

  // Get data from "Update Workspace" form and add it to "obj"
  function UpdateWorkspace(req, res) {
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
    }
  }
});

// ROUTE TO "DELETE WORKSPACE" PAGE
app.get('/owner/workspaces/delete', function (req, res) {
  res.sendFile(__dirname + '/owner/workspaces/delete-workspace.html');
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

function getOption() {
  selectElement = document.querySelector('#update');
  output = selectElement.value;
  document.querySelector('.output').textContent = output;
}
