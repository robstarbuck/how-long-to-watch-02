// NOTE
// http://bl.ocks.org/mbostock/4063530
// http://jsfiddle.net/perikut/9qUVW/2/
// http://jsfiddle.net/perikut/9qUVW/2/
// http://bl.ocks.org/ChrisJamesC/4474971
// http://stackoverflow.com/questions/7241393/can-you-control-how-an-svgs-stroke-width-is-drawn
// http://jsfiddle.net/63K4n/u

var seriesdata = {
    'name': 'THOUSAND',
    'hours': 10000,
    children: [
        {'name': '24', 'duration': [6,2]},
        {'name': '30 Rock', 'duration': [2,2]},
        {'name': 'Arrested Development', 'duration': [1,1]},
        {'name': 'Battlestar Galactica', 'duration': [2,9]},
        {'name': 'Breaking Bad', 'duration': [1,2]},
        {'name': 'Curb Your Enthusiasm', 'duration': [1,6]},
        {'name': 'Downton Abbey', 'duration': [1,7]},
        {'name': 'Freaks And Geeks', 'duration': [0,14]},
        {'name': 'Game Of Thrones', 'duration': [1,6]},
        {'name': 'Homeland', 'duration': [1,3]},
        {'name': 'House Of Cards', 'duration': [0,22]},
        {'name': 'How I Met Your Mother', 'duration': [3,2]},
        {'name': 'Its Always Sunny In Philadelphia','alias':'IASIP', 'duration': [1,4]},
        {'name': 'Lost', 'duration': [3,8]},
        {'name': 'Mad Men', 'duration': [2,9]},
        {'name': 'Modern Family', 'duration': [1,9]},
        {'name': 'Parks And Recreation', 'duration': [1,8]},
        {'name': 'Scandal', 'duration': [1,8]},
        {'name': 'Sherlock', 'duration': [0,14]},
        {'name': 'The Big Bang Theory', 'duration': [2,3]},
        {'name': 'The Good Wife', 'duration': [3,7]},
        {'name': 'The Oc', 'duration': [2,9]},
        {'name': 'The Walking Dead', 'duration': [1,5]},
        {'name': 'The West Wing', 'duration': [4,0]},
        {'name': 'The Wire', 'duration': [2,2]},
        {'name': 'The Sopranoes', 'duration': [3,14]}
    ]
};

var arrdaysInMonth = [30,10];

var subTextOffset = 25;

var totalHours = function(array){
    return array[0]*24 + array[1];
}

var pluralise = function(val){
    return val === 1 ? '' : 's';
}

var daysToString = function(array){
    return array[0]+' Day'+pluralise(array[0])+', '+array[1] +' Hour'+pluralise(array[1]);
}

var daysString = function(array){
    return array[0]+' Day'+pluralise(array[0]);
}

var hoursString = function(array){
    return array[1] +' Hour'+pluralise(array[1]);
}

var winWidth = window.innerWidth;

var winHeight = window.innerHeight;

var body = d3.select("body");

var svg = body
    .insert("svg")
    .attr("viewBox","0 0 "+parseInt(winWidth) +" "+winHeight);

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

var main = svg.append("g");

// We can't chain this as we need a reference to the group and not the circle
main.append("circle")
    .attr("class","main")
    .attr("cx",function(d) { return winWidth / 2; })
    .attr("cy",function(d) { return winHeight / 2; })
    .attr("r",function(d) { return winWidth / 2; });

//main.append("text")
//    .text("One Month")
//        .attr("dominant-baseline", "central")
//        .attr("text-anchor","left")
//        .attr("y",function(){return winHeight / 2});
//
//main.append("text")
//    .text(daysToString(arrdaysInMonth))
//        .attr("class","sub")
//        .attr("dominant-baseline", "central")
//        .attr("text-anchor","left")
//        .attr("y",function(){return winHeight / 2 +subTextOffset});

seriesdata.children.map(function(elem){
    elem.hours = totalHours(elem.duration);
});

seriesdata.children.sort(function(a,b){
    return b.hours - a.hours;
});

var groups = svg.append("g").selectAll("circle")
    // If it doesn't have children (ie it's a child, return true)
    .data(pack(seriesdata).filter(function(d){return !d.children}))
    // .filter(function(){return true})
    .enter()
    .append("g");

function cteHtml(d){
    
    let a = ["<div class='_'>"];
    
    if(d.duration[0] > 0){
        a.push("<h2 class='days'>" + daysString(d.duration) + "</h2>");
    }
    if(d.duration[1] > 0){
        a.push("<h2 class='hours'>" + hoursString(d.duration) + "</h2>");
    }
    
    a.push("</div>");
    
    return a.join('');
    
}

groups.sort(function(x,y){
//    console.log(x,y);
    return d3.ascending(x.y, y.y)
});


var minh = 0;
var addit = 100;

body.append("div")
    .style("opacity","0")
    .html(cteHtml({duration:[10,10]}))
    .call(function(ob){
        minh = ob.node().offsetHeight;
//        addit = addit + ob.node().offsetHeight;
    });

//NOTE: http://stackoverflow.com/questions/24827589/d3-appending-html-to-nodes

groups.each(function(d,i){    
    
    let outer = body.append("div")
            .style("width", function() {return d.r * 2 + "px"; })
            .style("left", function() {return d.x - d.r + "px"; })
            .style("top", function() {return addit + "px"; })
            .style("z-index", 100 -i)
            .attr("class", "o-box");
    
    outer.append("div")
        .attr("class", "box")
        .attr('pointer-events', 'none')
        .style("height", function() {return (d.r * 2) + "px"; })
        .html(cteHtml(d))
        .call(function(ob){
            if(ob.node().offsetHeight < minh){
                if(d.x - d.r > winWidth / 2){
                    ob.attr("class","right- small- box");
                }else{   
                    ob.attr("class","left- small- box");
                }
            };
        });
    
    
    outer.append("div")
        .html("<h1 class='title'>" + d.name + "</h1>");

    outer.call(function(ob){
        console.log(ob.node().offsetHeight)
        addit = addit + ob.node().offsetHeight;
    });

})