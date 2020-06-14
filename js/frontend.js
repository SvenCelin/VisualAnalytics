//currently hardcoded
var query = {
    userType: false, //true means Verified, false means all
    userName: "user1", //array of selected user names, or just one username for now?
    dateFrom: "2020-01-01", //unix time TODO
    dateTo: "2020-01-05", //CHANGE THIS!
    //colorPallete : "pallete1", //name of the collor pallete 
    minFontSize: 20,
    maxFontSize: 80,
    maxTags: 50,
    color: "#696969",
    rotation: 0,
    font: "Impact", //add more font names in index.html as options
    words: [],
    loading: {}
};

function setUserType(value) {
    if (value == 1) {
        query.userType = true;
    } else {
        query.userType = false;
    }
}

function setUserName(value) {
    query.userName = value;
}

function setDateFrom(value) {
    query.dateFrom = value;
}

function setDateTo(value) {
    query.dateTo = value;
}

function setFont(value) {
    query.font = value;
}

function setColor(value) {
    query.color = value;
}

function setMinFontSize(value) {
    query.mainFontSize = value;
}

function setMaxFontSize(value) {
    query.maxFontSize = value;
}

function setMaxTags(value) {
    query.maxTags = value;
}

function setRotation(value) {
    query.rotation = value;
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
    document.getElementById("generateButton").innerHTML = "Loading";

    document.getElementById("my_dataviz").innerHTML = "";

    fetchMeta(loadingBarStart);

    drawTagCloud();

    //ToDo: make sure this is called only when the tag cloud is actually drawn
    //TODO: find out why isn't it working right now
    loadingBarSTOP();
}

function fetchMeta(_callback) {
    var url = "http://127.0.0.1:5000/meta";
    var request = new XMLHttpRequest()
    request.open('GET', url);
    request.responseType = 'text';
    request.send();
    request.onload = function () {
        //var responseArray = ;
        query.loading = JSON.parse(request.response);
        //query.loading now has properties: tweets, words, userCount, minDate, maxDate
        console.log(query.loading.tweets);
        _callback();
    };
}

function loadingBarStart() {
    document.getElementById("loadingIcon").style.display = "block";
    document.getElementById("loadingText").innerHTML = 
    "Looking through <b>" + query.loading.tweets + " tweets </b><br> with <b>" + query.loading.words +  "</b> unique <b>words</b> <br>from <b>" + query.loading.userCount + " users.</b>";
}

function loadingBarSTOP() {
    document.getElementById("loadingIcon").style.display = "none";
    document.getElementById("generateButton").innerHTML = "Generate";
    console.log("stop");
}

function fetchData() {
    var url = "http://127.0.0.1:5000/searchWords";
    var request = new XMLHttpRequest()
    request.open('GET', url);
    request.responseType = 'text';
    request.send();
    request.onload = function () {
        var responseArray = request.response;
        responseArray = responseArray.replace(/\s+/g, '');
        responseArray = responseArray.replace(/'/g, '');
        var myArray = new Array();
        myArray = responseArray.slice(1, -1).split(",");
        var i;
        var listOfObjects = [];
        for (i = 0; i < myArray.length; i += 2) {
            var singleObj = {}
            singleObj['word'] = myArray[i];
            singleObj['size'] = parseInt(myArray[i + 1], 10);
            listOfObjects.push(singleObj);
        }
        query.words = listOfObjects;
    };
    console.log("fetched");
    console.log(query.words);
}