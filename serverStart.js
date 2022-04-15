var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var session = require('express-session');
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//Working with session
app.use(session({
  secret: 'qwerty',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 8 * 60 * 60 * 1000
  }
}));

//app.use setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));

//Check if the file exists and if it does not create one to store user information
if (fs.existsSync(path.join(__dirname, 'data', 'users.json'))) {
  var obj = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'users.json')));
  console.log("Successfully loaded file users.json");
}
else {
  var obj = {
    Coworkers: [],
    Owners: []
  }
  fs.writeFile(path.join(__dirname, 'data', 'users.json'), JSON.stringify(obj, null, 2), fileCreated);
  function fileCreated() {
    console.log("Successfully created new file users.json");
  }
}

/*** LANDING PAGE ***/
// Route to landing page
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

//Route to Signup page
app.get('/signUp', function (req, res) {
  res.sendFile(__dirname + '/signUpPage.html');
});

//Post API for registering the user based on information given on Signup page
app.post('/registered', urlencodedParser, function (req, res) {
  if (req.body.accountType == "coworker") { //If they are a user store them as user
    var accountInfo = {
      fName: req.body.fName,
      lName: req.body.lName,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
      accountType: req.body.accountType,
      rented: []
    };
    obj.Coworkers.push(accountInfo);
  } else { //Otherwise store them as owner, since there are only 2 options
    var accountInfo = {
      fName: req.body.fName,
      lName: req.body.lName,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
      accountType: req.body.accountType,
      properties: []
    };
    obj.Owners.push(accountInfo);
  }

  //Update the file with the new information
  fs.writeFile(path.join(__dirname, 'data', 'users.json'), JSON.stringify(obj, null, 2), registered);
  function registered() {
    res.send("Thank you for registering " + accountInfo.fName + "!");
    console.log("New user created.");
  }
});

//Obtain login info and check credentials
app.post('/login', function (req, res) {
  //Get login details
  var accountInfo = {
    email: req.body.email,
    password: req.body.password
  };

  var flag = false; //Create a flag for if/when we find the user

  //Go through coworkers to find matching username and password
  for (let i = 0; i < obj.Coworkers.length; i++) {
    if (obj.Coworkers[i].email == accountInfo.email && obj.Coworkers[i].password == accountInfo.password) {
      flag = true;
      req.session.loggedin = true;
      req.session.name = obj.Coworkers[i].fName;
      break;
    }
  }

  //Go through owners to find matching username and password if not found in coworkers
  if (!flag) {
    for (let i = 0; i < obj.Owners.length; i++) {
      if (obj.Owners[i].email == accountInfo.email && obj.Owners[i].password == accountInfo.password) {
        flag = true;
        req.session.loggedin = true;
        req.session.name = obj.Owners[i].fName;
        break;
      }
    }
  }

  //If matching credentials were found login
  if (flag) {
    console.log("Successful login occurred of account " + req.session.name);
    res.redirect("/logged");
  }
  //If not, send a response
  else {
    res.send("Sorry, incorrect credentials.");
    console.log("A login attempt was made.");
  }
});

/*** USER PAGE ***/
// Route to logged in an user page
app.get('/user', function (req, res) {
  res.sendFile(__dirname + '/user.html');
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

var server = app.listen(8080, function () {
  console.log('Server is running on port 8080');
  var host = server.address().address;
  var port = server.address().port;
});
