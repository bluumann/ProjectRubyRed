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
        password: req.body.password
    };

    //Create a variable to hold who is currently logged in
    global.currentUser;

    var flag = false; //Create a flag for if/when we find the user

    //Go through users to find matching username and password
    for (let i = 0; i < obj.Users.length; i++) {
        if (obj.Users[i].email == accountInfo.email && obj.Users[i].password == accountInfo.password) {
            flag = true;
            req.session.loggedin = true;
            req.session.name = obj.Users[i].fName;
            currentUser = obj.Users[i];
            //console.log(currentUser);
            break;
        }
    }

    //Go through owners to find matching username and password if not found in users
    if (!flag) {
        for (let i = 0; i < obj.Owners.length; i++) {
            if (obj.Owners[i].email == accountInfo.email && obj.Owners[i].password == accountInfo.password) {
                flag = true;
                req.session.loggedin = true;
                req.session.name = obj.Owners[i].fName;
                currentUser = obj.Owners[i];
                //console.log(currentUser);
                break;
            }
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
        break;
      }
    }
  }

  //If matching credentials were found login
  if (flag) {
    console.log('Successful login occurred of account ' + req.session.name);
    //console.log(currentUser.properties[0]);
    res.redirect('/logged');
  }
  //If not, send a response
  else {
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
  for (let i = 0; i < obj.Owners.length; i++) {
    if (
      obj.Owners[i].email == accountInfo.email &&
      obj.Owners[i].password == accountInfo.password
    ) {
      flag = true;
      req.session.loggedin = true;
      req.session.name = obj.Owners[i].fName;
      currentUser = obj.Owners[i];
      break;
    }
  }

  //Update the file with the new information
  fs.writeFile(
    path.join(__dirname, 'data', 'data.json'),
    JSON.stringify(obj, null, 2),
    registered
  );
  function registered() {
    console.log('New user created.');
    res.redirect('/registered');
  }
});

//Post registration page
app.get('/registered', function (req, res) {
  res.sendFile(path.join(__dirname, 'registered.html'));
});

/*** USER PAGE ***/
// Route to logged in an user page
app.get('/user', function (req, res) {
  res.sendFile(__dirname + '/user.html');
});

app.get('/property', function (req, res) {
  res.sendFile(__dirname + '/property.html');
});

app.get('/logged', function (req, res) {
  res.sendFile(__dirname + '/logged.html');
});

/*** OWNER PAGE ***/
// Route to owner's home page (when logged in as an owner)
app.get('/owner/home', function (req, res) {
  res.sendFile(__dirname + '/owner/home.html');
});

// Route to owner's profile page
app.get('/owner/profile', function (req, res) {
  res.sendFile(__dirname + '/owner/profile.html');
});

// Route to owner's properties page
app.get('/owner/properties', function (req, res) {
  res.sendFile(__dirname + '/owner/properties.html');
});

//CURRENT USER API
app.get('/currentUser', urlencodedParser, function(req, res){
  res.send(global.currentUser)
  console.log(global.currentUser)
  console.log("API called! Delivering info about " + global.currentUser.fName)
})

/*** PROPERTY PAGES ***/

// ROUTE TO "CREATE PROPERTY" PAGE
app.get('/property/create', function (req, res) {
  res.sendFile(__dirname + '/property/create-property.html');
});

// ROUTE TO "PROPERTY CREATED" PAGE
app.post('/property/property-created', urlencodedParser, function (req, res) {

  var property = {
  name: req.body.name,
  address: req.body.address,
  type: req.body.type,
  park: req.body.park,
  transport: req.body.transport,
  smoking: req.body.smoking,
  seats: req.body.individuals,
  availabilityFrom: req.body.availabilityFrom,
  availabilityTo: req.body.availabilityTo,
  leaseterm: req.body.leaseterm,
  price: req.body.price,
  workspaces: []
};
//console.log("Test"); //debug
currentUser.properties.push(property);
console.log(currentUser); //debug

//Update the file with the new information
fs.writeFile(path.join(__dirname, 'data', 'data.json'), JSON.stringify(obj, null, 2), propertyAdded);
function propertyAdded() {
console.log("New property added.");
//res.redirect('/propertyIn'); //placeholder
}
});

// ROUTE TO "UPDATE PROPERTY" PAGE
app.get('/property/update', function (req, res) {
  res.sendFile(__dirname + '/property/update-property.html');
});



/*** WORKSPACE PAGES ***/

// ROUTE TO "CREATE WORKSPACE" PAGE
app.get('/workspace/create', function (req, res) {
    res.sendFile(__dirname + '/workspace/create-workspace.html');
});

// ROUTE TO "WORKSPACE CREATED" PAGE
app.post('/workspace/workspace-created', urlencodedParser, function (req, res) {
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

    ownerIndex = obj.Owners.indexOf(currentUser, 0); // Index of currentUser within Owners[]


    obj.Owners[ownerIndex].properties[0].workspaces.push(workspace);


    //Update data.json with the new information
    fs.writeFile(
        path.join(__dirname, 'data', 'data.json'),
        JSON.stringify(obj, null, 2),
        workspaceCreated
      );
      function workspaceCreated() {
        console.log('New workspace created.');
        res.send('A new workspace has been created.');
      }
    });
    
// ROUTE TO "UPDATE WORKSPACE" PAGE
app.get('/workspace/update', function (req, res) {
    res.sendFile(__dirname + '/workspace/update-workspace.html');

// Return data.json to be used in HTML
app.get('/data/data.json', function (req, res) {
    res.sendFile(__dirname + '/data/data.json');
  });
  
// ROUTE TO "WORKSPACE UPDATED" PAGE
app.post('/workspace/workspace-updated', urlencodedParser, UpdateWorkspace);
  
    // Get data from "Update Workspace" form and add it to "obj"
    function UpdateWorkspace(req, res) {
        var id = req.body.id;
        var name = req.body.name;
        var type = req.body.type;
        var smoking = req.body.smoking;
        var seats = req.body.seats;
        var availability = req.body.availability;
        var leaseterm = req.body.leaseterm;
        var price = req.body.price;
        var listed = req.body.listed;
  
        const workspaceToUpdate = obj.Workspaces.find(
            workspace => workspace.id === id
        );
  
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
        res.send('Workspace has been updated.');
        }
    }
  });

// ROUTE TO "DELETE WORKSPACE" PAGE
app.get('/workspace/delete', function (req, res) {
    res.sendFile(__dirname + '/workspace/delete-workspace.html');
  });
  
// ROUTE TO "WORKSPACE DELETED" PAGE
app.post('/workspace/workspace-deleted', urlencodedParser, DeleteWorkspace);
  
    // Delete workspace from json logic
    function DeleteWorkspace(req, res) {
    // Select workspace dropdown
    var selectedWorkspace = req.body.types;
  
    var json = fs.readFileSync('data/data.json');
    var array = JSON.parse(json);
    var Workspace = array.Workspaces;
    array.Workspaces = Workspace.filter(workspaceObject => {
      return workspaceObject.name !== selectedWorkspace;
    });
    fs.writeFileSync('data/data.json', JSON.stringify(array, null, 2));
  
    console.log('Workspace deleted.');
    res.send(
      'The workspace called *' + selectedWorkspace + '* was successfully deleted!'
    );
  }

// API - retrieve all workspaces
app.get('/workspace/api', function (req, res) {
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
<<<<<<< HEAD

app.post('/PropertyIn', urlencodedParser, function (req, res) {

            var property = {
            propName: req.body.propName,
            workspaces: []
        };
        //console.log("Test"); //debug
        currentUser.properties.push(property);
        //console.log(currentUser); //debug

    //Update the file with the new information
    fs.writeFile(path.join(__dirname, 'data', 'data.json'), JSON.stringify(obj, null, 2), propertyAdded);
    function propertyAdded() {
        console.log("New property added.");
        //res.redirect('/propertyIn'); //placeholder
    }
});
=======
>>>>>>> 6277eaf356a3d6e34f6e420171a18e05f1d6da8f
