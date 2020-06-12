//currently hardcoded
var query = {
    userType: false, //true means Verified, false means all
    userName: "user1", //array of selected user names, or just one username for now?
    dateFrom : "2020-01-01" , //unix time TODO
    dateTo : "2020-01-05", //CHANGE THIS!
    //colorPallete : "pallete1", //name of the collor pallete 
    maxFontSize : 80,
    maxTags : 50,
    color : "#696969",
    rotation : 0,
    font: "Impact", //add more font names in index.html as options
    words: []
};

function setUserType(value){
    if (value == 1) {
        query.userType = true;
    } else {
        query.userType = false;
    }
    generate();
}

function setUserName(value){
    query.userName = value;
    generate();
}

function setDateFrom(value){
    query.dateFrom = value;
    generate();
}

function setDateTo(value){
    query.dateTo = value;
    generate();
}

function setFont(value){
    query.font = value;
    generate();
}

function setColor(value){
    query.color = value;
    generate();
}

function setMaxFontSize(value){
    query.maxFontSize = value;
    generate();
}

function setMaxTags(value){
    query.maxTags = value;
    generate();
}

function setRotation(value){
    query.rotation = value;
    generate();
}

function showMenu(menuChoice) {
    var menu1 = document.getElementById("dataFilters");
    var menu2 = document.getElementById("visualisation");

    if (menuChoice == "dataFilters") {
        menu1.style.display = "block";
        menu2.style.display = "none";
    } else {
        menu1.style.display = "none";
        menu2.style.display = "block";
    }
}

function generate() {
    document.getElementById("my_dataviz").innerHTML = "";
    //ToDo: this should refresh the:  my_dataviz div
    drawTagCloud();
    console.dir(query);
}


function fetchData(){
    var url = "http://127.0.0.1:5000/searchWords";
    var request = new XMLHttpRequest()
    request.open('GET', url);
    request.responseType = 'text';
    request.send();
    request.onload = function() {
        var responseArray = request.response;
        responseArray = responseArray.replace(/\s+/g, '');
        responseArray = responseArray.replace(/'/g, '');
        var myArray = new Array();
        myArray = responseArray.slice( 1, -1).split(",");
        var i;
        var listOfObjects = [];
        for (i = 0; i < myArray.length; i+=2) {
          var singleObj = {}
          singleObj['word'] = myArray[i];
          singleObj['size'] = parseInt(myArray[i+1], 10);
          listOfObjects.push(singleObj);
        }
        query.words = listOfObjects;
    };
    console.log("fetched");
    console.log(query.words);
}