var express = require('express');
var path = require('path');
var app = express();

app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))

app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html")
})

var server = app.listen(8080, function(){
    console.log("Server is running!")
    var host = server.address().address;
    var port = server.address().port;
})



