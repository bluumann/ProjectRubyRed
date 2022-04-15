var express = require('express');
var path = require('path');
var app = express();

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));

/*** LANDING PAGE ***/
// Route to landing page
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// Route to logged in page
app.post('/logged', function (req, res) {
  res.sendFile(__dirname + '/logged.html');
});

app.post('/registered', function (req, res) {
  res.sendFile(__dirname + '/registered.html');
});

/*** USER PAGE ***/
// Route to logged in an user page
app.get('/user', function (req, res) {
  res.sendFile(__dirname + '/user.html');
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
