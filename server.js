var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
<<<<<<< Updated upstream
=======
const { resourceUsage } = require('process');
>>>>>>> Stashed changes


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
<<<<<<< Updated upstream
        obj= {course:[]};
=======
        obj= {owner:[]};
>>>>>>> Stashed changes
    }


app.get('/', function (req, res) {

    res.send(
<<<<<<< Updated upstream
        '<br><br><h1>Cowork Reservation Page </h1><br><br> Service Information Page: <a href="api/info">http://localhost:1007/api/info</a><br><br> Owner Registration <a href="api/register">http://localhost:1007/api/register</a> <br><br> Owner Account <a href="api/ownerAccount">http://localhost:1007/api/ownerAccount</a> <br><br>Owner Search <a href="api/ownerSearch">http://localhost:1007/api/ownerSearch</a> <br>');
=======
        '<br><br><h1>Cowork Reservation Page </h1><br><br> Service Information Page: <a href="api/info">http://localhost:1007/api/info</a><br><br> Owner Registration <a href="api/ownerRegistration">http://localhost:1007/api/ownerRegistration</a> <br><br> Owner Login <a href="api/ownerLogin">http://localhost:1007/api/ownerLogin</a> <br><br>Owner Update <a href="api/ownerUpdate">http://localhost:1007/api/ownerUpdate</a> <br><br>Owner Delete <a href="api/ownerDelete">http://localhost:1007/api/ownerDelete</a> <br>><br> Owner Registration  2<a href="api/ownerRegistration2">http://localhost:1007/api/ownerRegistration2</a>');
>>>>>>> Stashed changes
    });

  


<<<<<<< Updated upstream
//route to course information
=======
//route to service information
>>>>>>> Stashed changes
app.get('/api/info', function (req, res) {

    res.sendFile( __dirname + "/" + "info.html" );
    
  });

<<<<<<< Updated upstream

//method to activate with click
app.get('/api/register', function (req, res) {

    res.sendFile( __dirname + "/" + "index.html" );
=======
//POST new owner information
//route to owner registration
app.get('/api/ownerRegistration', function (req, res) {

    res.sendFile( __dirname + "/" + "ownerRegistration.html" );
>>>>>>> Stashed changes

})



<<<<<<< Updated upstream
//This method triggered when click event happen
app.post('/owner', urlencodedParser, NewOwner);  //using the path from index.html
=======
//This method triggered when click event happen, POST
app.post('/ownerRegistration', urlencodedParser, NewOwner);  //using the path from index.html
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
app.get('/api/ownerAccount', function (req, res) {
    
    res.sendFile( __dirname + "/" + "ownerAccount.html" );
=======
//Get information after login
//Route to login page
app.get('/api/ownerLogin', function (req, res) {
    
    res.sendFile( __dirname + "/" + "ownerLogin.html" );
>>>>>>> Stashed changes

})


<<<<<<< Updated upstream


//get to retrieve data
 app.get('/ownerInfo', urlencodedParser, ExistingOwner);  //using the path from index.html
=======
//get to retrieve data from login page
 app.get('/ownerLogin', urlencodedParser, ExistingOwner);  //using the path from index.html
>>>>>>> Stashed changes

 function ExistingOwner(req,res)
 {
     
     response =
     {
<<<<<<< Updated upstream

         email:req.query.email,
         password:req.query.password
=======
        
        
        email:req.query.email,
        password:req.query.password,
        firstName:req.query.firstName
        
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                
            email:req.query.email,
            password:req.query.password,
            firstName:req.query.firstName
=======
            owner:req.query.firstName
            /*   
            email:req.query.email,
            password:req.query.password*/


>>>>>>> Stashed changes
        }

        //parse JSON to concatenate information
        res.send(response);
 
<<<<<<< Updated upstream
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
=======
         
>>>>>>> Stashed changes
     }

 
 }

<<<<<<< Updated upstream

 app.get('/api/ownerSearch', function (req, res) {
    
    res.sendFile( __dirname + "/" + "ownerSearch.html" );
=======
//Get information to update data
//Route to update page
 app.get('/api/ownerUpdate', function (req, res) {
    
    res.sendFile( __dirname + "/" + "ownerUpdate.html" );
>>>>>>> Stashed changes

})

//get to retrieve data
<<<<<<< Updated upstream
 app.get('/ownerInfoSearch', urlencodedParser, SearchOwner);  //using the path from index.html
=======
 app.get('/ownerUpdate', urlencodedParser, SearchOwner);  //using the path from index.html
>>>>>>> Stashed changes
 
 function SearchOwner(req,res)
 {
    console.log('Im here');
     
    let objectName = objectName.text(document.querySelector('#update').value);
     response =
     {
        objectName:req.query.objectName.value
     }
 
     if(!response.email )
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
            objectName:req.query.objectName.value
        }

        //parse JSON to concatenate information
        res.send(response);
 
     }

 
 }


<<<<<<< Updated upstream
=======
//DELETE


app.get('/api/ownerDelete', function (req, res) {
    
    res.sendFile( __dirname + "/" + "ownerDelete.html" );

})




//get to retrieve data
 app.delete('/ownerDelete', urlencodedParser, DeleteOwner);  //using the path from index.html

 function DeleteOwner(req,res)
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
                
            email:req.query.owner.email,
            password:req.query.owner.password,
            firstName:req.query.owner.firstName
        }

        //parse JSON to concatenate information
        res.send(response);
 
         
     }

 
 }

//DELETE this Code
//POST new owner information
//route to owner registration
app.get('/api/ownerRegistration2', function (req, res) {

    res.sendFile( __dirname + "/" + "ownerRegistration2.html" );

})



//This method triggered when click event happen, POST
app.post('/ownerRegistration2', urlencodedParser, NewOwner);  //using the path from index.html

function NewOwner(req,res)
{
    
    response =
    {
        owner:req.body.data
        /*
        firstName:req.body.firstName, 
        lastName:req.body.lastName, 
        idNumber:req.body.idNumber,
        phoneNumber:req.body.phoneNumber,
        email:req.body.email,
        password:req.body.password
        */
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
//DELETE before this

>>>>>>> Stashed changes
 app.use("/*",function (req, res) {
    res.send("404 page not found");   
    });  

var server = app.listen(1007, function () 
{
   var host = server.address().address
   var port = server.address().port   
   console.log("Server is running at port 1007")
})


function getOption() 
{
    selectElement = document.querySelector('#update');
    output = selectElement.value;
    document.querySelector('.output').textContent = output;
}