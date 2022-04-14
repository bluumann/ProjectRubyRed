var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');


var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json());

var obj;
var exists = fs.existsSync('owner_file.json');

    if (exists) {
        // use existing file
        //console.log('loading course file');
        var mydata = fs.readFileSync('owner_file.json', 'utf8');
        //console.log(mydata);
        // Parse it  back to object
        obj= JSON.parse(mydata);
    } 
    else
    {
        // create a new file
        //console.log('Created new object')
        obj= {course:[]};
    }


app.get('/', function (req, res) {

    res.send(
        '<br><br><h1>Cowork Reservation Page </h1><br><br> Service Information Page: <a href="api/info">http://localhost:1007/api/info</a><br><br> Owner Registration <a href="api/register">http://localhost:1007/api/register</a> <br><br> Owner Account <a href="api/ownerAccount">http://localhost:1007/api/ownerAccount</a> <br>');
    });

  


//route to course information
app.get('/api/info', function (req, res) {

    res.sendFile( __dirname + "/" + "info.html" );
    
  });


//method to activate with click
app.get('/api/register', function (req, res) {

    res.sendFile( __dirname + "/" + "index.html" );

})



//This method triggered when click event happen
app.post('/owner', urlencodedParser, NewOwner);  //using the path from index.html

function NewOwner(req,res)
{
    response =
    {
        firstName:req.body.firstName, 
        lastName:req.body.lastName, 
        idNumber:req.body.idNumber,
        phoneNumber:req.body.phoneNumber,
        email:req.body.email,
        password:req.body.password
    }

    if(!response.firstName ||!response.lastName ||!response.idNumber ||!response.phoneNumber ||!response.email  ||!response.password )
    { 
        reply =
        {
            msg:"Please complete the form before you submit it"
        }
        res.send(reply);
        console.log(reply)
    }   
    else
    { 
        

        obj.owner.push(
        { 
            firstName:req.body.firstName, 
            lastName:req.body.lastName, 
            idNumber:req.body.idNumber,
            phoneNumber:req.body.phoneNumber,
            email:req.body.email,
            password:req.body.password      
        });

    

        
        let data = JSON.stringify(obj, null, 2);  

        fs.writeFile('owner_file.json', data, finished);

        console.log('owner_file.JSON is updated')

        function finished(err)
        {         
            reply=
            {
                firstName:req.body.firstName, 
                lastName:req.body.lastName, 
                idNumber:req.body.idNumber,
                phoneNumber:req.body.phoneNumber,
                email:req.body.email,
                password:req.body.password 

            }
            res.send(reply);
            console.log(reply);
        }     
    }


}

app.get('/api/ownerAccount', function (req, res) {
    
    res.sendFile( __dirname + "/" + "ownerAccount.html" );

})




//get to retrieve data
 app.get('/ownerInfo', urlencodedParser, ExistingOwner);  //using the path from index.html

 function ExistingOwner(req,res)
 {
     
     response =
     {

         email:req.query.email,
         password:req.query.password
     }
 
     if(!response.email ||!response.password  )
     { 
         reply =
         {
             msg:"Your login information is incomplete"
         }
         res.send(reply);
         console.log(reply)
     }   
     else
     { 
        response =
        {
                
            email:req.query.email,
            password:req.query.password
        }

        //parse JSON to concatenate information
        res.send(response);
 
         /*obj.owner.get(
         { 
             firstName:req.query.firstName, 
             lastName:req.query.lastName, 
             idNumber:req.query.idNumber,
             phoneNumber:req.query.phoneNumber,
             email:req.query.email,
             password:req.query.password      
         });
 
     
 
         
         let data = JSON.parse(obj, null, 2);  
 
         fs.readFile('owner_file.json', data, finished);
 
         console.log('owner_file.JSON has been read')
 
         function finished(err)
         {         
             reply=
             {
                 firstName:req.query.firstName, 
                 lastName:req.query.lastName, 
                 idNumber:req.query.idNumber,
                 phoneNumber:req.query.phoneNumber,
                 email:req.query.email,
                 password:req.query.password 
 
             }
             res.send(reply);
             console.log(reply);
         }     
         */
     }

 
 }

 app.put();
 app.delete();

 app.use("/*",function (req, res) {
    res.send("404 page not found");   
    });  

var server = app.listen(1007, function () 
{
   var host = server.address().address
   var port = server.address().port   
   console.log("Server is running at port 1007")
})
