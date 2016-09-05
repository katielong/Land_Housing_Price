// code adapted from Mike Bostock's Wealth and Health of Nations

// accessor of variable
function x(d) {
    return d.resid_area; }

function y(d) {
    return d.resid_price; }

function key(d) {
    return d.name; }

//control for the size and color of each dot
function radius(d) {
    return d.pop; }

function color(d) {
    return d.salary; }

var p = d3.precisionFixed(0.5),
    f = d3.format("." + p + "f");
var out;

var margin = { top: 19.5, right: 13, bottom: 19.5, left: 35 },
    w = 600 - margin.right,
    h = 500 - margin.top - margin.bottom;

var xScale = d3.scaleSqrt().domain([0, 5000]).range([0, w]),
    yScale = d3.scaleSqrt().domain([0, 6500]).range([h, 0]),
    radiusScale = d3.scaleLinear().domain([0, 1800]).range([0, 50]),
    colorScale = d3.scaleThreshold().domain([9889, 11380, 13470]).range(['#c6dbef', '#6baed6', '#2171b5', '#08306b']);

var xAxis = d3.axisBottom().scale(xScale).ticks(12, d3.format(",d"));
yAxis = d3.axisLeft().scale(yScale);

var tooltip = d3.select("#content").append("div")
    .attr("id", "tooltip")
    .style("display", "none")
    .style("position", "absolute")
    .html("<label><span id=\"tt_county\"></span></label>");

var svg = d3.selectAll("#content").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", w)
    .attr("y", h - 6)
    .text("New Land Sales (Acre)");

svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Real Residential Land Price (*10,000 RMB/Acre)");

var label = svg.append("text")
    .attr("class", "year label")
    .attr("text-anchor", "end")
    .attr("y", 60)
    .attr("x", w)
    .text(2007);

//Add legend
var legend_x = d3.scaleLinear().domain([5000, 35000]).range([0, w + margin.right]),
    arr = [5090, 9889, 11380, 13470, 34060],
    legend_h = 20;

var legend_axis = d3.axisTop()
    .scale(legend_x)
    .tickSize(5)
    .tickValues([5000, 12500, 20000, 27500, 35000])
    .tickFormat(function(d, i) {
        return arr[i]; });

var legend = d3.select("#content")
    .append("svg")
    .attr("id", "legend")
    .attr("width", w + margin.right + 10)
    .attr("height", legend_h * 3.5);

var g = legend.append("g")
    .attr("class", "key")
    .attr("transform", "translate(" + margin.left + "," + legend_h + ")");

legend.append("text")
    .attr("id", "legend-text")
    .attr("transform", "translate(" + margin.left + "," + legend_h * 3 + ")")
    .text("Real Per capita Income (RMB)");

g.selectAll("rect")
    .data(colorScale.range().map(function(color) {
        var d = colorScale.invertExtent(color);
        if (d[0] == null) d[0] = legend_x.domain()[0];
        return d;
    }))
    .enter()
    .append("rect")
    .attr("height", legend_h)
    .attr("x", function(d, i) {
        return (w + margin.right) / 4 * i; })
    .attr("width", function(d) {
        return (w + margin.right) / 4; })
    .style("fill", function(d) {
        return colorScale(d[0]); });

g.call(legend_axis);


// Select to show all cities or just major/non-major cities
d3.select("#major").on("change", function() {
    var val = this.value;
    if (val == "Only Major Cities") { out = 1; } else if (val == "Only Non-major Cities") { out = 0; } else { out = 2; }
    d3.selectAll(".dots").remove();
});



// Click the Button to begin Animation
function change() {
    d3.selectAll(".dots").remove();
    d3.csv("data.csv", function(csv) {

        var data = csv2json_scatter(csv);

        if (out == 1 | out == 0) {
            data = $.grep(data, function(d) {
                return d.region === out;
            });
        }

        var dot = svg.append("g")
            .attr("class", "dots")
            .selectAll(".dot")
            .data(interpolateData(2007))
            .enter()
            .append("circle")
            .attr("class", "dot")
            .style("fill", function(d) {
                return colorScale(color(d)); })
            .call(position)
            .sort(order)
            .on("mouseover", function(d) {
                var m = d3.mouse(d3.select("body").node());
                var currentcol = $(this).css("fill")
                    // tooltip
                tooltip.style("display", null)
                    .style("left", m[0] + 10 + "px")
                    .style("top", m[1] - 10 + "px");
                $("#tt_county").html(key(d) + " City");

                // dot opacity
                $(".dot").css("opacity", "0.3");
                $(".dot").filter(function() {
                    return $(this).css("fill") == currentcol;
                }).css("opacity", "1");

            })
            .on("mouseout", function() {
                $(".dot").css("opacity", "1");
                tooltip.style("display", "none");
            });

        var box = label.node().getBBox();

        var overlay = svg.append("rect")
            .attr("class", "overlay")
            .attr("x", box.x)
            .attr("y", box.y)
            .attr("width", box.width)
            .attr("height", box.height)
            .on("mouseover", enableInteraction);

        svg.transition()
            .duration(20000)
            .tween("year", tweenYear)
            .each("end", enableInteraction);


        // Position the dots based on data
        function position(dot) {
            dot.attr("cx", function(d) {
                    return xScale(x(d)); })
                .attr("cy", function(d) {
                    return yScale(y(d)); })
                .attr("r", function(d) {
                    return radiusScale(radius(d)); });
        }

        // Smallest dots are drawn on top
        function order(a, b) {
            return radius(b) - radius(a);
        }

        // Mouseover to change the year
        function enableInteraction() {
            var yearScale = d3.scaleLinear()
                .domain([2007, 2012])
                .range([box.x + 10, box.x + box.width - 10])
                .clamp(true);

            // Cancel current transition
            svg.transition().duration(0);

            overlay
                .on("mouseover", mouseover)
                .on("mouseout", mouseout)
                .on("mousemove", mousemove)
                .on("touchmove", mousemove);

            function mouseover() {
                label.classed("active", true);
            }

            function mouseout() {
                label.classed("active", false);
            }

            function mousemove() {
                displayYear(yearScale.invert(d3.mouse(this)[0]));
            }
        }

        function tweenYear() {
            var year = d3.interpolateNumber(2007, 2012);
            return function(t) { displayYear(year(t)); };
        }

        function displayYear(year) {
            dot.data(interpolateData(year), key).call(position).sort(order);
            label.text(Math.round(year));
        }

        function interpolateData(year) {
            return data.map(function(d) {
                return {
                    name: d.city_eng,
                    region: d.region,
                    salary: interpolateValues(d.salary, year),
                    resid_price: interpolateValues(d.resid_price, year),
                    resid_area: interpolateValues(d.resid_area, year),
                    housing_price: interpolateValues(d.housing_price, year),
                    pop: interpolateValues(d.pop, year)
                };
            });
        }

        function interpolateValues(values, year) {
            var bisect = d3.bisector(function(d) {
                return d.year; });
            var i = bisect.left(values, year, 0, values.length - 1),
                a = values[i];
            if (i > 0) {
                var b = values[i - 1],
                    t = (year - a.year) / (b.year - a.year);
                return a.value * (1 - t) + b.value * t;
            }
            return a.value;
        }
    });
}
