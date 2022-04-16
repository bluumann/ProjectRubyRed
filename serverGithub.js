var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
const { resourceUsage } = require('process');

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));




//FRANK
//************************************************************** */
//Parse

var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json());

//FRANK
//validation file (database)
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
        obj= {owner:[]};
    }


/*** LANDING PAGE ***/
// Route to landing page, login
app.get('/', function (req, res) {

  res.sendFile(__dirname + '/index.html');
  });


//******LOGIN */
//get to retrieve data from login page
app.post('/', urlencodedParser, ExistingOwner);  //using the path from index.html

function ExistingOwner(req,res)
{
   response =
   {
      email:req.body.email,
      password:req.body.password
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
          //testing this ===> owner:req.query.firstName
            
          email:req.body.email,
          password:req.body.password


      }
      //parse JSON to concatenate information
      res.send(response);
   }
}


//FRANK
/*** OWNER PAGE ***/
//**Owner Functions in Owners page */
// Route to owner's home page (when logged in as an owner)
//route to service information.  Accesory information for a company service page
app.get('/api/info', function (req, res) {

  res.send(
    '<br><br><h1>Cowork Reservation Page </h1><br><br> Service Information Page: <a href="api/info">http://localhost:8080/api/info</a><br><br> Owner Registration <a href="api/ownerRegistration">http://localhost:8080/api/ownerRegistration</a> <br><br> Owner Login <a href="/">http://localhost:8080/</a> <br><br>Owner Update <a href="api/ownerUpdate">http://localhost:8080/api/ownerUpdate</a> <br><br>Owner Delete <a href="api/ownerDelete">http://localhost:8080/api/ownerDelete</a> <br>><br> Owner Registration  2<a href="api/ownerRegistration2">http://localhost:8080/api/ownerRegistration2</a>');
});

//FRANK

/*
app.get('/', function (req, res) {
    
  res.send(
      '<br><br><h1>Cowork Reservation Page </h1><br><br> Service Information Page: <a href="api/info">http://localhost:8080/api/info</a><br><br> Owner Registration <a href="api/ownerRegistration">http://localhost:8080/api/ownerRegistration</a> <br><br> Owner Login <a href="/">http://localhost:8080/</a> <br><br>Owner Update <a href="api/ownerUpdate">http://localhost:8080/api/ownerUpdate</a> <br><br>Owner Delete <a href="api/ownerDelete">http://localhost:8080/api/ownerDelete</a> <br>><br> Owner Registration  2<a href="api/ownerRegistration2">http://localhost:8080/api/ownerRegistration2</a>');
  });
*/

/* OWNER REGISTRATION */
//POST new owner information
//route to owner registration
/*app.get('/', function (req, res) {
  res.sendFile( __dirname + "/" );
})*/

app.get('/SignUp', function (req, res) {

  res.sendFile(__dirname + '/' + 'SignUp.html');
  });


//This method triggered when click event happen, POST
app.post('/SignUp', urlencodedParser, NewOwner);  //using the path from index.html

function NewOwner(req,res)
{
  if (req.body.status == "owner") {
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


}

// Route to logged in page
app.post('/logged', function (req, res) {
  res.sendFile(__dirname + '/logged.html');
});

<<<<<<< Updated upstream:serverGithub.js
/*** USER PAGE ***/
// Route to logged in an user page
app.get('/user', function (req, res) {
  res.sendFile(__dirname + '/user.html');
=======
app.post('/registered', function (req, res) {
  res.sendFile(__dirname + '/registered.html');
});


//OWNER UPDATE
//Get information to update data
//Route to update page
app.get('/api/ownerUpdate', function (req, res) {
    
  res.sendFile( __dirname + "/" + "ownerUpdate.html" );

})

//get to retrieve data
app.get('/ownerUpdate', urlencodedParser, SearchOwner);  //using the path from index.html

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

//OWNER UPDATE
//its working on the example.  Obj has been already uploaded with the JSON
//search for information from owner.  Use get to obtain params
app.get("/owner/:name", function(req,res){
  var name = req.params.name;
  var reply;
  for (var i = 0, l = obj.owner.length; i < l; i++) { 

      var myobj = obj.owner[i].first_name; 
      res.send(obj.owner[i].first_name);

      if(name == myobj){
          console.log("your data " + myobj + " and " + name + " are matching ")   
          reply={
              first_name:req.params.name,
              last_name:obj.user[i].last_name, 
              msg:"search found",                        
          } //end of obj
       }//end of if 
  }//end of for
  res.send(JSON.stringify(reply) + " is found , GET request, however this route is not fully implemented")

})

//OWNER DISPLAY ALL OBJECTS
//Get all elements from JSON, need to figure the right paramenter on fetch
app.get("/users", (req, res) => {
  fetch(myData).then(
    async (response) => {
      const data = await response.json();
      res.status(200).send(JSON.stringify(data.slice(0, 10)));
    }
  );
>>>>>>> Stashed changes:serverStart.js
});

//OWNER DELETE
//Delete data.  If GET method used, then params are populated.
app.get('/api/ownerDelete', function (req, res) {
  
  res.sendFile( __dirname + "/" + "ownerDelete.html" );

})


//get to retrieve data to be deleted
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

//Frank's END
//************************************************************** */


/*** USER PAGE ***/
// Route to logged in an user page
app.get('/user', function (req, res) {
  res.sendFile(__dirname + '/user.html');
});





//changed server number for validation 
var server = app.listen(8050, function () {
  console.log('Server is running on port 8050');
  var host = server.address().address;
  var port = server.address().port;
});