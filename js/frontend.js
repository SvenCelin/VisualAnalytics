//currently hardcoded
var query = {
    userType: false, //true means Verified, false means all
    userName: undefined, //array of selected user names, or just one username for now?
    dateFrom: undefined, //unix time TODO
    dateTo: undefined, //CHANGE THIS!
    minFontSize: 20,
    maxFontSize: 80,
    maxTags: 50,
    rotation: 0,
    font: "Impact", //add more font names in index.html as options
    words: [],
    loading: {}
};


let customPaletteName = "Custom one color";
let palettes = [
    {name: "Pastel", colors:["#987284","#9dbf9e","#d0d6b5","#f9b5ac","#ee7674"]},
    {name: "Blue gradient", colors:["#03045e","#0077b6","#00b4d8","#90e0ef","#caf0f8"]},
    {name: "Pink/red/black", colors:["#ffd9da","#ea638c","#89023e","#30343f","#1b2021"]},
    {name: "Blueish/yellow/red", colors:["#7fb7be","#d3f3ee","#dacc3e","#bc2c1a","#7d1538"]},
    {name: "A lot of colors", colors:["#ffe74c","#ff5964","#ffffff","#6bf178","#35a7ff","#454545","#6ba292","#35ce8d","#69306d","#0e103d"]},
    {name: customPaletteName, colors: []}
]

let config = {
    chosenPalette: palettes[0],
    customColor: {}
}

function setUserType(value) {
    if (value == 1) {
        query.userType = true;
    } else {
        query.userType = false;
    }
}

function setUserName(value) {
    query.userName = value;
    console.log(query.userName);
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

function setToCustomColor(value) {
    config.customColor = value;
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

    setupShowCase();
}

function getColorFromPalette(index, total){
    if(config.chosenPalette.name === customPaletteName) {
        return config.customColor;
    }
    let paletteToUse = palettes.find(value => value.name === config.chosenPalette.name);
    let relative = index / total;
    let colorCount = paletteToUse.colors.length;
    let colorIndex = Math.floor(Math.min(relative * colorCount, colorCount -1));
    return paletteToUse.colors[colorIndex];
}

function generate() {
    document.getElementById("generateButton").innerHTML = "Loading";

    document.getElementById("my_dataviz").innerHTML = "";

    fetchMeta(loadingBarStart);
    fetchData(drawTagCloud);
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
        _callback();
    };
}

function setColorPallete(value) {
    if(value === customPaletteName) {
        showById('customColorContainer')
        hideById('showCaseWrapper')
        config.chosenPalette = palettes[palettes.length - 1]
    } else {
        hideById('customColorContainer')
        config.chosenPalette = palettes.find(searchValue => searchValue.name === value);
        showById('showCaseWrapper')
        setupShowCase();
    }
}

function setupShowCase() {
    let showCaseId = document.getElementById('colorShowCase');
    showCaseId.innerHTML = '';
    let colorCount = config.chosenPalette.colors.length;
    let totalWidth = showCaseId.clientWidth;
    config.chosenPalette.colors.forEach(value => {
        let colorDiv = document.createElement('div');
        colorDiv.style.backgroundColor = value;
        colorDiv.style.width = (totalWidth / colorCount - 0.1) + 'px';
        colorDiv.style.height = showCaseId.clientHeight + 'px';
        colorDiv.style.float = 'left';
        showCaseId.appendChild(colorDiv);
    })
}

function loadPalettes() {
    let paletteDropDown = document.getElementById('paletteDropDown');
    palettes.forEach(value => {
        let option = document.createElement("option");
        option.text = value.name;
        option.value = value.name;
        paletteDropDown.add(option);
    })
    hideById('customColorContainer');
    showById('showCaseWrapper')
}

function hideById(id) {
    document.getElementById(id).style.display = "none";
}

function showById(id) {
    document.getElementById(id).style.display = "block";
}

function loadingBarStart() {
    document.getElementById("loadingIcon").style.display = "block";
    document.getElementById("loadingText").innerHTML =
        "Looking through <b>" + query.loading.tweets + " tweets </b><br> with <b>" + query.loading.words + "</b> unique <b>words</b> <br>from <b>" + query.loading.userCount + " users.</b>";
}

function loadingBarSTOP() {
    document.getElementById("loadingIcon").style.display = "none";
    document.getElementById("generateButton").innerHTML = "Generate";
    //console.log("stop");
}

function fetchData(_callback) {

    var url = "http://127.0.0.1:5000/searchWords";
    let queryParams = [];
    if(query.userName){
       queryParams.push({name: 'user_name', value: query.userName});
    }
    if(query.userType == true){
        queryParams.push({name: 'verified', value: 'true'});
    }
    if(query.dateFrom){
        queryParams.push({name: 'from', value: query.dateFrom});
    }
    if(query.dateTo) {
        queryParams.push({name: 'to', value: query.dateTo});
    }
    if(query.maxTags) {
        queryParams.push({name: 'maxCount', value: query.maxTags});
    }
    if(queryParams.length > 0) {
        url += '?';
    }
    url += queryParams.map(value => value.name +'=' + value.value).join('&');
    console.log(url);
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
        loadingBarSTOP();
        _callback();
    };
    console.log("fetched");
    console.log(query.words);
}

function populateUserSearch(){
    var url = "http://127.0.0.1:5000/userNames";
    var request = new XMLHttpRequest()
    request.open('GET', url);
    request.responseType = 'text';
    request.send();
    request.onload = function () {
        //var responseArray = ;
        var names = JSON.parse(request.response);

        var options = '';

        for(var i = 0; i < names.length; i++)
          options += '<option value="'+names[i]+'" />';
      
        document.getElementById('userName').innerHTML = options;
    };
}
document.addEventListener('DOMContentLoaded', function() {
    loadPalettes();
});
