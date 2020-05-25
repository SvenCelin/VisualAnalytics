//currently hardcoded
var query = {
    userType: false, //true means Verified, false means all
    userName: "user1", //array of selected user names, or just one username for now?
    dateFrom : "2020-01-01" , //unix time TODO
    dateTo : "2020-01-05", //CHANGE THIS!
    //colorPallete : "pallete1", //name of the collor pallete 
    maxFontSize : 25,
    maxTags : 50,
    color : "#696969",
    rotation : 0,
    font: "Impact" //add more font names in index.html as options
};

function setUserType(value){
    if (value == 1) {
        query.userType = true;
    } else {
        query.userType = false;
    }
}

function setUserName(value){
    query.userName = value;
}

function setDateFrom(value){
    query.dateFrom = value;
}

function setDateTo(value){
    query.dateTo = value;
}

function setFont(value){
    query.font = value;
}

function setColor(value){
    query.color = value;
}

function setMaxFontSize(value){
    query.maxFontSize = value;
}

function setMaxTags(value){
    query.maxTags = value;
}

function setRotation(value){
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
    //ToDo: this should refresh the:  my_dataviz div
    console.dir(query);
} 