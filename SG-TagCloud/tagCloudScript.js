
function drawTagCloud() {
    // List of words
    var myWords = query.words;

    var minFontSize = 20;
    var maxFontSize = query.maxFontSize;

    var minCount = myWords[0].size;
    var maxCount = myWords[0].size;
    var tmp;
    for (var i = 0; i < myWords.length; i++) {
        tmp = myWords[i].size;
        if (tmp < minCount) minCount = tmp;
        if (tmp > maxCount) maxCount = tmp;
    }
    console.log(maxCount, minCount);

    for(var i = 0; i < myWords.length; i++) {
        myWords[i].size = (myWords[i].size - minCount)/(maxCount - minCount);
    }

    console.log(myWords);



    // set the dimensions and margins of the graph
    var clientWidth = document.getElementById('my_dataviz').clientWidth;
    var clientHeight = document.getElementById('my_dataviz').clientHeight;
    var margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = clientWidth - margin.left - margin.right,
        height = clientHeight - margin.top - margin.bottom;

    console.log("width " + width);
    console.log("height " + height);

    var surface = width + height;
    console.log("surface " + surface);



    var viewBoxVariable = "0 0 " + width + " " + height;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz").append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", viewBoxVariable)
        //.atrr("preserveAspectRatio ", "none")
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    // Wordcloud features that are different from one word to the other must be here
    var layout = d3.layout.cloud()
        .size([width, height])
        .words(myWords.map(function (d) { return { text: d.word, size: d.size }; }))
        .padding(10)        //space between words
        //.rotate(function() { return ~~(Math.random() * 2) * 90; })
        .rotate(query.rotation)
        .fontSize(function (d) { return (d.size - minCount)*((maxFontSize - minFontSize)/(maxCount - minCount)) + minFontSize; })      // font size of words
        .on("end", draw);
    layout.start();

    // This function takes the output of 'layout' above and draw the words
    // Wordcloud features that are THE SAME from one word to the other can be here
    function draw(words) {
        svg
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function (d) { return d.size; })
            .style("fill", query.color)
            .attr("text-anchor", "middle")
            .style("font-family", query.font)
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) { return d.text; });
    }
}