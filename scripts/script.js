// NOTES
// http://bl.ocks.org/mbostock/4063530
// http://jsfiddle.net/perikut/9qUVW/2/
// http://jsfiddle.net/perikut/9qUVW/2/
// http://bl.ocks.org/ChrisJamesC/4474971
// http://stackoverflow.com/questions/7241393/can-you-control-how-an-svgs-stroke-width-is-drawn
// http://jsfiddle.net/63K4n/u

var seriesdata = {
    'name':'THOUSAND',
    'hours':10000,
    children:[
        {'name':'24','duration':[6,2]},
        {'name':'30 ROCK','duration':[2,2]},
        {'name':'ARRESTED DEVELOPMENT','duration':[1,1]},
        {'name':'BATTLESTAR GALACTICA','duration':[2,9]},
        {'name':'BREAKING BAD','duration':[1,2]},
        {'name':'CURB YOUR ENTHUSIASM','duration':[1,6]},
        {'name':'DOWNTON ABBEY','duration':[1,7]},
        {'name':'FREAKS AND GEEKS','duration':[0,14]},
        {'name':'GAME OF THRONES','duration':[1,6]},
        {'name':'HOMELAND','duration':[1,3]},
        {'name':'HOUSE OF CARDS','duration':[0,22]},
        {'name':'HOW I MET YOUR MOTHER','duration':[3,2]},
        {'name':'ITS ALWAYS SUNNY IN PHILADELPHIA','alias':'IASIP','duration':[1,4]},
        {'name':'LOST','duration':[3,8]},
        {'name':'MAD MEN','duration':[2,9]},
        {'name':'MODERN FAMILY','duration':[1,9]},
        {'name':'PARKS AND RECREATION','duration':[1,8]},
        {'name':'SCANDAL','duration':[1,8]},
        {'name':'SHERLOCK','duration':[0,14]},
        {'name':'THE BIG BANG THEORY','duration':[2,3]},
        {'name':'THE GOOD WIFE','duration':[3,7]},
        {'name':'THE OC','duration':[2,9]},
        {'name':'THE WALKING DEAD','duration':[1,5]},
        {'name':'THE WEST WING','duration':[4,0]},
        {'name':'THE WIRE','duration':[2,2]}
    ]
};

var arrdaysInMonth = [30,11];

var subTextOffset = 25;

var winWidth = window.innerWidth;

var winHeight = window.innerHeight;

var totalHours = function(array){
    return array[0]*24 + array[1];
}

var pluralise = function(val){
    return val === 1 ? '' : 's';
}

var daysToString = function(array){
    return array[0]+' Day'+pluralise(array[0])+', '+array[1] +' Hour'+pluralise(array[1]);
}

var pack = d3.layout.pack()
    .sort(null)
    .size([winWidth, winHeight])
    .value(function(d){
        return totalHours(d.duration);
    })
    .radius(function(r){
        // This funciton gives us our radius relative to the width of the window
        // Days of the month * hours in the day * 2 to make a diameter
        return winWidth / (30.4375 * 24 * 2) * r;
    })
    .padding(45);

var svg = d3.select("body")
    .insert("svg:svg")
    .attr("viewBox","0 0 "+winWidth+" "+winHeight)
    .attr("perserveAspectRatio","xMinYMid");

var main = svg.append("g");

// We can't chain this as we need a reference to the group and not the circle
main.append("circle")
    .attr("class","main")
    .attr("cx",function(d) { return winWidth / 2; })
    .attr("cy",function(d) { return winHeight / 2; })
    .attr("r",function(d) { return winWidth / 2; });

main.append("text")
    .text("One Month")
        .attr("dominant-baseline", "central")
        .attr("text-anchor","left")
        .attr("y",function(){return winHeight / 2});

main.append("text")
    .text(daysToString(arrdaysInMonth))
        .attr("class","sub")
        .attr("dominant-baseline", "central")
        .attr("text-anchor","left")
        .attr("y",function(){return winHeight / 2 +subTextOffset});

seriesdata.children.map(function(elem){
    elem.hours = totalHours(elem.duration);
});

seriesdata.children.sort(function(a,b){
    return b.hours - a.hours;
});

// debugger;

var groups = svg.append("g").selectAll("circle")
    // If it doesn't have children (ie it's a child, return true)
    .data(pack(seriesdata).filter(function(d){return !d.children}))
    // .data(pack(data1))
    // .filter(function(){return true})
    .enter()
    .append("g");

groups.append("circle")
        .attr("class",function(d){return d.depth ? "child" : "root"})
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", function(d) { return d.r; });

groups.insert("text")
        .text(function(d){return d.alias ? d.alias : d.name})
            .attr("x", function(d) {return d.x; })
            .attr("y", function(d) {return d.y; })
            .attr("dominant-baseline", "central")
            .attr("text-anchor","middle");

groups.insert("text")
    .text(
        function(d){

            return daysToString(d.duration);

        })
        .attr("class","sub")
        .attr("x", function(d) {return d.x; })
        .attr("y", function(d) {return d.y+subTextOffset; })
        .attr("text-anchor","middle");

// initRepeat, fires once from the closure and is then assigned to updateWindow
// updateWindow fires on window resize 
var updateWindow = (function initRepeat(){

    x = window.innerWidth;
    y = window.innerHeight;

    svg.attr("width",x).attr("height",y);

    return initRepeat;

})();

window.onresize = updateWindow;