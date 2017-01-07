More and more I'm seeing D3 in job-specs for JavaScript developers, so I figured it was high time I took a look at it.

We're going to be reproducing this popular infographic, detailing the time it takes to binge watch our favourite series using [D3](http://d3js.org). Before we begin, Here's what the finished product looks like in case it's not worth you while.

[Demo](http://blog.ouinon.co/how-long-to-watch-01/)

![How Long to Watch](http://nielsentopten.com/wp-content/uploads/2014/04/Binge-Shows-Shortest-to-LongestRevised.png "Top 10 How long to watch")

This will be part of a series looking at how to use D3. In parts 02 and 03 we'll be looking at how to make the data a little more interactive, this post will look simply at rendering out the graphics.

Seeing some of the showcase examples in __D3__ might stir a little anxiety in some developers, it did in me. Thoughts of having to calculate individual vectors, Pythagoras theorem, spelling hypotenuse etc. Luckily for us, most of those demonstrations rely on built-in D3 [Layouts](https://github.com/mbostock/d3/wiki/Layouts). For this example we're going to be using the [pack](https://github.com/mbostock/d3/wiki/Pack-Layout) layout.

## The Code

Let's start by getting our SVG on the page.

##### FIG.01
```js
var winWidth = window.innerWidth;

var winHeight = window.innerHeight;

var svg = d3.select("body")
    .insert("svg")
    .attr("viewBox","-20 0 "+parseInt(winWidth+40) +" "+winHeight);
```

>> You may see a few examples of __.insert("svg:svg")__ about on the web.You can read more about it [here](https://github.com/mbostock/d3/wiki/Selections#insert).

Most of this should be self-explanatory but we want our graphic to be responsive, as such we need to set the [viewBox](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox) of our element to the same size as the browser window. This will mean that the initial load will determine the maximum width of our graphic. In this part we will not be redrawing the graphic responsively so this strategy makes sense. 

```
.attr("viewBox","-20 0 "+parseInt(winWidth+40) +" "+winHeight);
```

The viewBox is yet another thing I won't be covering in this post, __Sara Soueidan__ has however written an extensive [blog](http://sarasoueidan.com/blog/svg-coordinate-systems/) on the subject all the way from Lebanon, it's worth checking out if you don't understand it you'll also see why I haven't covered it.

A big part of getting up and running with D3 is working out the syntax for SVGs. Although SVGs appear to be the typical use case the low-level nature of D3 means we could be rendering our circles in HTML if we choose.

## Can we crack on?

Yes we can, let's add some elements to our SVG:

##### FIG.02
```js
var main = svg.append("g");

main.append("circle")
    .attr("class","month")
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
```

Here we've added a month element to our SVG, which comprises of a circle that spans the width of the page, along with some text to explain it's purpose.

##### FIG.03
```js
seriesdata.children.map(function(elem){
    elem.hours = totalHours(elem.duration);
});

seriesdata.children.sort(function(a,b){
    return b.hours - a.hours;
});
```

We're nearly there, before we render-out our data though there's a couple of things to do. Firstly adding our `hours` value to elements in the array is easy enough with __map__. From there we just need to sort our data and this is easy enough now that we have our `hours` value to use.

With our data ready for inclusion, we can take a look at our d3.layout.pack function.


##### FIG.04    
```js
var pack = d3.layout.pack()
    .sort(null)
    .size([winWidth, winHeight])
    .value(function(d){
        return totalHours(d.duration);
    })
    .radius(function(r){
        // This funciton gives us our radius relative to the width of the window
        // Days of the month * hours in the day * 2 to make it a diameter
        return winWidth / (30.4375 * 24 * 2) * r;
    })
    .padding(45);

```

The important things to note here are the following:

- `d3.layout.pack` when invoked will return an array, it'll run through the data and produce a new dataset derived from the one we provide it.
- `.sort(null)` prevents D3 from sorting our data by default.
- `.value(…)` Vitally points to the data that we should be looking at.
- `.radius(…)` Specifies exactly what radius to give to our circles, without which '_the radius is determined automatically from the node value, scaled to fit the layout size._'.
- __children__ is already defined in our data, it must be specified with this exact key (`children`). Without this we would need to attach a `.children(…)` function in order to point the layout to those elements. 

With all that in mind, let's perform our _Coup de grâce_ and gift-wrap this little puppy up for our sweet-hearts:

##### FIG.05
```js
var groups = svg.append("g").selectAll("circle")
    // If it doesn't have children (ie it's a child, return true)
    .data(pack(seriesdata).filter(function(d){return !d.children}))
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
```

You can see where we invoke the pack function we discussed in [FIG.04](#fig04). Straight after invoking it we're filtering out the parent node, the only element that has a `children` property.

These two chained functions `.data(…).enter(…)` are the work-horse of D3 and there is an excellent post on [data-joins](http://bost.ocks.org/mike/join/)  on the D3 website.

Continued work on the post will include some interactivity so I'll keep you posted, though I'm not yet sure how.

<div class="o-tbl SpcA">
    <div class="tbl">
        <div class="cll">
            <a href="https://github.com/ouinon/how-long-to-watch-01" class="btn Icn clWhite">
                <label>View Project on Github</label>
                <div class="icn">
                    <i class="fa fa-github fs2r"></i>
                </div>
            </a>
        </div>
    </div>
</div>

#### NOTA-BENES

- I couldn't get the site to publish because I had included front-matter in the README file, force of habit.

#### SUPPORTING SITES

- [http://brettterpstra.com/2012/09/26/github-tip-easily-sync-your-master-to-github-pages/](http://brettterpstra.com/2012/09/26/github-tip-easily-sync-your-master-to-github-pages/)
- [http://oli.jp/2011/github-pages-workflow/](http://oli.jp/2011/github-pages-workflow/)
- [http://stackoverflow.com/questions/5084100/post-commit-hook-not-running](http://stackoverflow.com/questions/5084100/post-commit-hook-not-running)
- [http://jsfiddle.net/63K4n/](http://jsfiddle.net/63K4n/)
- [http://sarasoueidan.com/demos/interactive-svg-coordinate-system/index.html](http://sarasoueidan.com/demos/interactive-svg-coordinate-system/index.html)