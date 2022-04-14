/*
Name: Final Project
Course Code: SODV1201
Program: Software Development Diploma
Authors:
Colin From
Frank Berrocal
Pedro Ferreira
Peter Kosa
*/


//global variable for dataset modification.
var dataCheck = true;
//dataset provided for Assignment.
var dataSet = [   
  [ "Brielle Williamson", "Integration Specialist", "New York", "4804", "2012/12/02", "$372,000" ],
  [ "Herrod Chandler", "Sales Assistant", "San Francisco", "9608", "2012/08/06", "$137,500" ],
  [ "Rhona Davidson", "Integration Specialist", "Tokyo", "6200", "2010/10/14", "$327,900" ],
  [ "Colleen Hurst", "Javascript Developer", "San Francisco", "2360", "2009/09/15", "$205,500" ],
  [ "Sonya Frost", "Software Engineer", "Edinburgh", "1667", "2008/12/13", "$103,600" ],
  [ "Jena Gaines", "Office Manager", "London", "3814", "2008/12/19", "$90,560" ],
  [ "Quinn Flynn", "Support Lead", "Edinburgh", "9497", "2013/03/03", "$342,000" ],
  [ "Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800" ],
  [ "Garrett Winters", "Accountant", "Tokyo", "8422", "2011/07/25", "$170,750" ],
  [ "Ashton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ],
  [ "Cedric Kelly", "Senior Javascript Developer", "Edinburgh", "6224", "2012/03/29", "$433,060" ],
  [ "Airi Satou", "Accountant", "Tokyo", "5407", "2008/11/28", "$162,700" ],
  [ "Charde Marshall", "Regional Director", "San Francisco", "6741", "2008/10/16", "$470,600" ],
  [ "Haley Kennedy", "Senior Marketing Designer", "London", "3597", "2012/12/18", "$313,500" ],
  [ "Tatyana Fitzpatrick", "Regional Director", "London", "1965", "2010/03/17", "$385,750" ],
  [ "Michael Silva", "Marketing Designer", "London", "1581", "2012/11/27", "$198,500" ],
  [ "Paul Byrd", "Chief Financial Officer (CFO)", "New York", "3059", "2010/06/09", "$725,000" ],
  [ "Gloria Little", "Systems Administrator", "New York", "1721", "2009/04/10", "$237,500" ],
  [ "Bradley Greer", "Software Engineer", "London", "2558", "2012/10/13", "$132,000" ],
  [ "Dai Rios", "Personnel Lead", "Edinburgh", "2290", "2012/09/26", "$217,500" ],
  [ "Jenette Caldwell", "Development Lead", "New York", "1937", "2011/09/03", "$345,000" ],
  [ "Yuri Berry", "Chief Marketing Officer (CMO)", "New York", "6154", "2009/06/25", "$675,000" ],
  [ "Caesar Vance", "Pre-Sales Support", "New York", "8330", "2011/12/12", "$106,450" ],
  [ "Doris Wilder", "Sales Assistant", "Sidney", "3023", "2010/09/20", "$85,600" ],
  [ "Angelica Ramos", "Chief Executive Officer (CEO)", "London", "5797", "2009/10/09", "$1,200,000" ],
  [ "Gavin Joyce", "Developer", "Edinburgh", "8822", "2010/12/22", "$92,575" ],
  [ "Jennifer Chang", "Regional Director", "Singapore", "9239", "2010/11/14", "$357,650" ],
  [ "Brenden Wagner", "Software Engineer", "San Francisco", "1314", "2011/06/07", "$206,850" ],
  [ "Fiona Green", "Chief Operating Officer (COO)", "San Francisco", "2947", "2010/03/11", "$850,000" ],
  [ "Shou Itou", "Regional Marketing", "Tokyo", "8899", "2011/08/14", "$163,000" ],
  [ "Michelle House", "Integration Specialist", "Sidney", "2769", "2011/06/02", "$95,400" ],
  [ "Suki Burks", "Developer", "London", "6832", "2009/10/22", "$114,500" ],
  [ "Prescott Bartlett", "Technical Author", "London", "3606", "2011/05/07", "$145,000" ],
  [ "Gavin Cortez", "Team Leader", "San Francisco", "2860", "2008/10/26", "$235,500" ],
  [ "Martena Mccray", "Post-Sales support", "Edinburgh", "8240", "2011/03/09", "$324,050" ],
  [ "Unity Butler", "Marketing Designer", "San Francisco", "5384", "2009/12/09", "$85,675" ]
];

window.onload = setTimeout(function(){
    showPictureName();
  }, 10000); //element containing picture name is shown after 10 seconds.

function showPictureName() {
  document.getElementById("picture").style = "display: inherit";
}

//initially, the webpage will always be showing the profile.
function showProfile() {
  document.getElementById("profile").style = "display: inherit";
  document.getElementById("markToGrade").style = "display: none";
  document.getElementById("staffPage").style = "display: none";
  document.getElementById("weatherPage").style = "display: none";
  setTimeout(function(){ //for returning to this page in the future.
    showPictureName();
  }, 10000);
}

function showMark() {
  document.getElementById("profile").style = "display: none";
  document.getElementById("markToGrade").style = "display: inherit";
  document.getElementById("staffPage").style = "display: none";
  document.getElementById("weatherPage").style = "display: none";
  document.getElementById("picture").style = "display: none"
}

function showStaff() {
  document.getElementById("profile").style = "display: none";
  document.getElementById("markToGrade").style = "display: none";
  document.getElementById("staffPage").style = "display: inherit";
  document.getElementById("weatherPage").style = "display: none";
  document.getElementById("picture").style = "display: none"
  if (dataCheck){ //the first time Staff page is open, this function will fix the salaries on the dataset so they can be read as numbers, therefore allowing sort methods to work without issues.
    for (let i = 0; i < dataSet.length; i++){
      dataSet[i][5] = dataSet[i][5].substring(1);
      dataSet[i][5] = dataSet[i][5].replaceAll(",", "")
      dataSet[i][5] = parseFloat(dataSet[i][5]);
    }
    printDataset() //prints table in the order it was given for the assignment.
    dataCheck = false; //so that this will only run once.
  }
}

function showWeather() {
  document.getElementById("profile").style = "display: none";
  document.getElementById("markToGrade").style = "display: none";
  document.getElementById("staffPage").style = "display: none";
  document.getElementById("weatherPage").style = "display: inherit";
}

function markToGrad() {
  let a = document.getElementById("markBox").value;
  let input = document.getElementById("markBox");
  if (!document.getElementById("markBox").checkValidity()) {
    document.getElementById("markValidation").innerHTML = input.validationMessage; //since the input already only allows numbers, this is the only error message possible.
  }
  else { //by running the ifs in inverted order, I need only to check for the minimum score for each grade.
    if (a < 50) document.getElementById("markValidation").innerHTML = "Student grade is F."; 
    if (a > 50) document.getElementById("markValidation").innerHTML = "Student grade is D.";
    if (a > 70) document.getElementById("markValidation").innerHTML = "Student grade is C.";
    if (a > 80) document.getElementById("markValidation").innerHTML = "Student grade is B.";
    if (a > 90) document.getElementById("markValidation").innerHTML = "Student grade is A.";
    }
}

function printDataset() {
  let stringData = ""; //makes sure string is always empty at first.
  for (let i = 0; i < dataSet.length; i++) { //iterates first dimension
    for (let j = 0; j <dataSet[i].length; j++){ //iterates second dimension
      if (i == 0 && j == 0) stringData += dataSet[i][j];  //if it's the very first entry, enters it raw.
      else {
        if (j == 0) stringData += "<br>" + dataSet[i][j];  //if it's the first entry of a new line, add a line break.
        if (j == dataSet[i].length-1) stringData += ", $" + dataSet[i][j];  //if it's the last line, add a dollar sign.
        else stringData += ", " + dataSet[i][j]; //if it's entry after the first one of every line, add a comma for beautification purposes.
      }
    }
  }
  document.getElementById("datasetOutput").innerHTML = stringData;
}

function sortByName() {
  dataSet = dataSet.sort(function(a,b) {
    if (a[0] > b[0]) return  1;
    if (a[0] < b[0]) return -1;
});
  printDataset()
}

function sortBySalary() {
  dataSet = dataSet.sort(function(a,b) {
    if (a[5] > b[5]) return  1;
    if (a[5] < b[5]) return -1;;
  });
  printDataset()
}

function temperatureCalc() {
  let a = document.getElementById("tempBox").value;
  //named function
  function celsius(temp){
    return ((temp - 32) * 5/9).toFixed(2);
  }
  //anonymous function
  let kelvin = function(temp){
    return ((temp - 32) * 5/9 + 273.15).toFixed(2);
  }
  if (a < -459.67) alert ("Invalid input, temperature must be greater or equal to -459.67°F") //didnt use .validationMessage to make it different from previous Mark to Grade function.
  else document.getElementById("tempConversion").innerHTML = a + "°F is equivalent to: <br>" + celsius(a) + "°C and " + kelvin(a) + "K.";
}