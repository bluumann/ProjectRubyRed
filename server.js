var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

var Parser = bodyParser.urlencoded({ extended: false })

var exists = fs.existsSync('PropertyDatabase.json');
if (exists) {
var database = fs.readFileSync('PropertyDatabase.json', 'utf8');
dataArray = JSON.parse(database);
} else {var dataArray = {Property:[]};}

app.get('/', function (req, res) { 
    res.sendFile( __dirname + '/index.html' );
 });

app.post('/done', Parser, InsertProperty);

function InsertProperty(req,res){
    dataArray.Property.push ( { 
        address:req.body.address,
        location:req.body.location,
        size:req.body.size,
        parking:req.body.parking,
        publicTransport:req.body.publicTransport,
        workspaces:req.body.workspaces,
        photo:req.body.photo,        
    });

    let data = JSON.stringify(dataArray, null, 1);  
    fs.writeFile('PropertyDatabase.json', data, Done);
    function Done(e){         
        reply={
            address:req.body.address,
            location:req.body.location,
            size:req.body.size,
            parking:req.body.parking,
            publicTransport:req.body.publicTransport,
            workspaces:req.body.workspaces,
            photo:req.body.photo,  
            status:"Done",
         }
         res.send(reply);
    }     
}

var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
})