var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var session = require('express-session');
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const { resourceUsage } = require('process');

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
app.use(bodyParser.json());

//validation of object in the database
var obj;
var exists = fs.existsSync(path.join(__dirname, 'data', 'data.json'));

if (exists) {
    //Use existing file
    var mydata = fs.readFileSync(path.join(__dirname, 'data', 'data.json'));
    // Parse it  back to object
    obj = JSON.parse(mydata);
    console.log("Successfully loaded file data.json");
}
else {
    obj = {
        Users: [],
        Owners: [],
        Properties: [],
        Workspaces: []
    };
    fs.writeFile(path.join(__dirname, 'data', 'data.json'), JSON.stringify(obj, null, 2), fileCreated);
    function fileCreated() {
        console.log("Successfully created new file data.json");
    }
}

/*** LANDING PAGE ***/
// Route to landing page    
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

//******LOGIN */
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
            console.log(currentUser);
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
                console.log(currentUser);
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
        console.log("A login attempt was made.");
        res.send("Sorry, incorrect credentials.");
    }
});


/* OWNER/USER REGISTRATION */
//POST new owner/user information
//route to owner/user registration
app.get('/SignUp', function (req, res) {
    res.sendFile(__dirname + "/SignUp.html");
})

//Post API for registering the user based on information given on Signup page
app.post('/SignUp', urlencodedParser, function (req, res) {
    if (req.body.status == "user") { //If they are a user store them as user
        var accountInfo = {
            fName: req.body.fName,
            lName: req.body.lName,
            idNumber: req.body.idNumber,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            password: req.body.password,
            rating: 5,
            rented: []
        };
        obj.Users.push(accountInfo);
    } else { //Otherwise store them as owner, since there are only 2 options
        var accountInfo = {
            fName: req.body.fName,
            lName: req.body.lName,
            idNumber: req.body.idNumber,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            password: req.body.password,
            rating: 5,
            properties: []
        };
        obj.Owners.push(accountInfo);
    }

    //Update the file with the new information
    fs.writeFile(path.join(__dirname, 'data', 'data.json'), JSON.stringify(obj, null, 2), registered);
    function registered() {
        console.log("New user created.");
        res.redirect('/registered');
    }
});

//Post registration page
app.get('/registered', function (req, res) {
    res.sendFile(path.join(__dirname, "registered.html"));
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
/*

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


//its working on the example.  Obj has been already uploaded with the JSON
 //search for information from owner
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


//Get all elements from JSON, need to figure the right paramenter on fetch
app.get("/users", (req, res) => {
    fetch(myData).then(
      async (response) => {
        const data = await response.json();
        res.status(200).send(JSON.stringify(data.slice(0, 10)));
      }
    );
});

//DELETE

//Delete data
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
            fName:req.query.owner.fName
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

/*** OWNER PAGE ***/
// Route to owner's home page (when logged in as an owner)
//route to service information.  Accesory information for a company service page
/*
app.get('/api/info', function (req, res) {

    res.sendFile( __dirname + "/" + "info.html" );
    
  });


//Get information after login
//Route to login page
app.get('/', function (req, res) {
    
    res.send(
        '<br><br><h1>Cowork Reservation Page </h1><br><br> Service Information Page: <a href="api/info">http://localhost:8080/api/info</a><br><br> Owner Registration <a href="api/ownerRegistration">http://localhost:8080/api/ownerRegistration</a> <br><br> Owner Login <a href="/">http://localhost:8080/</a> <br><br>Owner Update <a href="api/ownerUpdate">http://localhost:8080/api/ownerUpdate</a> <br><br>Owner Delete <a href="api/ownerDelete">http://localhost:8080/api/ownerDelete</a> <br>><br> Owner Registration  2<a href="api/ownerRegistration2">http://localhost:8080/api/ownerRegistration2</a>');
    });



//This method triggered when click event happen, POST
app.post('/ownerRegistration2', urlencodedParser, NewOwner);  //using the path from index.html

function NewOwner(req,res)
{
    
    response =
    {
        owner:req.body.data
        
        fName:req.body.fName, 
        lName:req.body.lName, 
        idNumber:req.body.idNumber,
        phoneNumber:req.body.phoneNumber,
        email:req.body.email,
        password:req.body.password
        
    }

    if(!response.fName ||!response.lName ||!response.idNumber ||!response.phoneNumber ||!response.email  ||!response.password )
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
            fName:req.body.fName, 
            lName:req.body.lName, 
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
                fName:req.body.fName, 
                lName:req.body.lName, 
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


 app.use("/*",function (req, res) {
    res.send("404 page not found");   
    });  
*/
var server = app.listen(1007, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Server is running at port 1007")
})


function getOption() {
    selectElement = document.querySelector('#update');
    output = selectElement.value;
    document.querySelector('.output').textContent = output;
}

app.post('/PropertyIn', urlencodedParser, function (req, res) {
            var property = {
            propName: req.body.propName,
            workspaces: []
        };
        //console.log(currentUser); //debug
        //console.log("Test"); //debug
        currentUser.properties.push(property);

    //Update the file with the new information
    fs.writeFile(path.join(__dirname, 'data', 'data.json'), JSON.stringify(obj, null, 2), propertyAdded);
    function propertyAdded() {
        console.log("New property added.");
        //res.redirect('/propertyIn'); //placeholder
    }
});