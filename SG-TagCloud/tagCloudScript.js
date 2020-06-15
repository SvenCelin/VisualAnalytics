
function drawTagCloud() {
    // List of words

    var myWords = query.words;

    var minFontSize = query.minFontSize;
    var maxFontSize = query.maxFontSize;

    console.log(minFontSize, maxFontSize);

    var minCount = myWords[0].size;
    var maxCount = myWords[0].size;
    var tmp;
    for (var i = 0; i < myWords.length; i++) {
        tmp = myWords[i].size;
        if (tmp < minCount) minCount = tmp;
        if (tmp > maxCount) maxCount = tmp;
    }

    for(var i = 0; i < myWords.length; i++) {
        myWords[i].orig = myWords[i].size;
        myWords[i].size = (myWords[i].size - minCount)/(maxCount - minCount);
    }

    maxCount = myWords[0].size;
    minCount = myWords[myWords.length - 1].size;

    console.log(maxCount, minCount);
    console.log(myWords);

    // set the dimensions and margins of the graph
    var clientWidth = document.getElementById('my_dataviz').clientWidth;
    var clientHeight = document.getElementById('my_dataviz').clientHeight;
    var margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = clientWidth - margin.left - margin.right,
        height = clientHeight - margin.top - margin.bottom;

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

    let toolTipDiv = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    // Wordcloud features that are different from one word to the other must be here
    var layout = d3.layout.cloud()
        .size([width, height])
        .words(myWords.map(function (d) { return { text: d.word, size: d.size, orig: d.orig }; }))
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
            .style("fill", function(word, index) { return getColorFromPalette(index, query.words.length)})
            .attr("text-anchor", "middle")
            .style("font-family", query.font)
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) { return d.text; })
            .on("mouseover", function(d) {
                toolTipDiv.transition()
                    .duration(200)
                    .style("opacity", .9);
                toolTipDiv.html(d.orig)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                })
            .on("mouseout", function(d) {
                toolTipDiv.transition()
                    .duration(500)
                    .style("opacity", 0);
        });
    }
}