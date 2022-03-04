//Create an array of entities for creating objects and storing/accessing data
var users = [];
var owners = [];
var property = [];
var workspaces = [];

//Create an object at array[x], one button per function one function per entity, the currently empty fields I imagine will be document.getElementById(x) when we have created x
function newUser(){
    var addUser = {
        fullName: ,
        phone: ,
        email: 
    };
    users.push(addUser);
}

function newOwner(){
    var addOwner = {
        fullName: ,
        phone: ,
        email: 
    };
    owners.push(addOwner);
}

function newProperty(){
    var addProperty = {
        address: ,
        neighbourhood: ,
        squareFootage: ,
        parking: ,
        publicTransport:
    };
    property.push(addProperty);
}

function newWorkspace(){
    var addWorkspace = {
        id: ,
        type: ,
        seats: ,
        smoking: ,
        availability: ,
        term: ,
        price: ,
        ownerInfo: //Perhaps for this we add ID's to each user and owner and then the owner can put their ID number (or perhaps it's automatic from their login) for this slot and then whenever we want the info displayed it just automatically displays the owner info from that array 
    }
    workspaces.push(addWorkspace);
}
