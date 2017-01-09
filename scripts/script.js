/*global d3*/
(function() {
    'use strict';

    function totalHours(array) {
        return array[0] * 24 + array[1];
    }

    function pluralise(val) {
        return val === 1 ? '' : 's';
    }

    function daysString(array) {
        return array[0] + ' Day' + pluralise(array[0]);
    }

    function hoursString(array) {
        return array[1] + ' Hour' + pluralise(array[1]);
    }

    function cteHtml(d) {

        var a = ["<div class='_'>"];

        if (d.duration[0] > 0) {
            a.push("<h2 class='days'>" + daysString(d.duration) + "</h2>");
        }
        if (d.duration[1] > 0) {
            a.push("<h2 class='hours'>" + hoursString(d.duration) + "</h2>");
        }

        a.push("</div>");

        return a.join('');

    }
    
    var arrdaysInMonth = [30, 10];

    var winWidth = window.innerWidth;

    var winHeight = window.innerHeight;

    var winRatio = winHeight / winWidth;

    d3.json('data.json',function(er,seriesdata){

        var main = d3.select("main");

        var pack = d3.layout.pack()
            .sort(null)
            .size([winWidth, winHeight])
            .value(function(d) {
                return totalHours(d.duration);
            })
            .radius(function(r) {
                // This function gives us our radius relative to the width of the window
                // Days of the month * hours in the day * 2 to make a diameter
                return winWidth / (30.4375 * 24 * 2) * r;
            })
            .padding(45);

        seriesdata.children.map(function(elem) {
            elem.hours = totalHours(elem.duration);
        });

        seriesdata.children.sort(function(a, b) {
            return b.hours - a.hours;
        });

        var groups = main
            .data(pack(seriesdata));

        var minh = 0;
        var addit = 0;

        // Used to grab the minh value to determine what can fit in a square
        main.append("div")
            .style("opacity", "0")
            .html(cteHtml({
                duration: [10, 10]
            }))
            .call(function(ob) {
                minh = ob.node().offsetHeight;
                ob.remove();
            });

        //console.log(gropus);

        var outer =
            main
            .selectAll("div")
            .data(pack(seriesdata))
            .enter()
            .append("div")
            .filter(function(d) {
                return !d.children;
            })
            .style("width", function(d) {
                return d.r * 2 + "px";
            })
            .style("left", function(d) {
                return d.x - d.r + "px";
            })
            .style("top", '0px')
            .each(function(d) {
                var ob = d3.select(this);
                if (d.x - d.r > winWidth / 2) {
                    ob.attr("class", "right- o-box");
                } else {
                    ob.attr("class", "left- o-box");
                }
            }).append("div")
            .attr("class", "box")
            .attr('pointer-events', 'none')
            .style("height", function(d) {
                return d.r * 2 * winRatio + "px";
            })
            .html(function(d) {
                return cteHtml(d);
            })
            .each(function() {
                if (this.offsetHeight < minh) {
                    d3.select(this).attr("class", "small- box");
                }
            });

        outer.each(function(o, i) {

            var p = this.parentNode;

            d3.select(p).append("div")
                .html(function(d) {
                    return "<h1 class='title'>" + d.name + "</h1>";
                });

            d3.select(p).call(function(ob) {

                this.style("top", addit + 'px');

                addit = addit + p.offsetHeight;

                main.style("height", addit + 'px');

            });

        });
    });
    
}());