// code adapted from Mike Bostock

// accessor of variable
function x(d) { return d.resid_area; }
function y(d) { return d.resid_price; }
function radius(d) { return d.pop; }
function color(d) { return d.region;}
function key(d) { return d.name; }

var p=d3.precisionFixed(0.5), f=d3.format("." + p + "f");

// Chart dimensions.
var margin = {top:19.5, right: 0, bottom: 19.5, left: 39.5},
    w = 580 - margin.right,
    h = 450 - margin.top - margin.bottom;

// Various scales. These domains make assumptions of data, naturally.
var xScale = d3.scaleLinear().domain([0, 5000]).range([0, w]),
    yScale = d3.scaleLinear().domain([0,6500]).range([h, 0]),
    radiusScale = d3.scaleLinear().domain([0, 1800]).range([0, 40]),
    colorScale = d3.scaleThreshold().domain([0.1,1.1]).range(["blue","orange"]);

// The x & y axes.
var xAxis = d3.axisBottom().scale(xScale).ticks(12, d3.format(",d")),
    yAxis = d3.axisLeft().scale(yScale);

var tooltip = d3.select("#overview").append("div")
    .attr("id", "tooltip")
    .style("display", "none")
    .style("position", "absolute")
    .html("<label><span id=\"tt_county\"></span></label>");

// Create the SVG container and set the origin.
var svg = d3.selectAll("#overview").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add the x-axis.
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis);

// Add the y-axis.
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

// Add an x-axis label.
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", w)
    .attr("y", h - 6)
    .text("New Residential Land Sales (Acre)");

// Add a y-axis label.
svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Average Residential Land Price (RMB)");

// Add the year label; the value is set on transition.
var label = svg.append("text")
    .attr("class", "year label")
    .attr("text-anchor", "end")
    .attr("y", 60)
    .attr("x", w)
    .text(2007);

// Click the Button to begin Animation
function change(){
  d3.selectAll(".dots").remove();
  
  d3.csv("data.csv", function(csv) {
  var data=csv2json(csv);
  var dot = svg.append("g")
      .attr("class", "dots")
      .selectAll(".dot")
      .data(interpolateData(2007))
      .enter()
      .append("circle")
      .attr("class", "dot")
      .style("fill", function(d) {return colorScale(color(d)); })
      .call(position)
      .sort(order)
      .on("mouseover", function(d) {
            var m = d3.mouse(d3.select("body").node());
            tooltip.style("display", null)
                .style("left", m[0] + 10 + "px")
                .style("top", m[1] - 10 + "px");
            $("#tt_county").html(key(d) + "<br>" + 
              "Mean Residential Land Price: " + y(d) + " RMB"+
              "<br>" + "New Residential Land Supply: " + x(d)+ " Acre" +
              "<br>"+ "Urban Population: " + radius(d)*10000 + " PPl");
        })
        .on("mouseout", function() {
            tooltip.style("display", "none");
        });

  // Add an overlay for the year label.
  var box = label.node().getBBox();

  var overlay = svg.append("rect")
        .attr("class", "overlay")
        .attr("x", box.x)
        .attr("y", box.y)
        .attr("width", box.width)
        .attr("height", box.height)
        .on("mouseover", enableInteraction);

  // Start a transition that interpolates the data based on year.
  svg.transition()
      .duration(10000)
      .tween("year", tweenYear)
      .each("end", enableInteraction);

  // Positions the dots based on data.
  function position(dot) {
    dot.attr("cx", function(d) { return xScale(x(d)); })
        .attr("cy", function(d) {return yScale(y(d)); })
        .attr("r", function(d) { return radiusScale(radius(d)); });
  }

  // Defines a sort order so that the smallest dots are drawn on top.
  function order(a, b) {
    return radius(b) - radius(a);
  }

  // After the transition finishes, you can mouseover to change the year.
  function enableInteraction() {
    var yearScale = d3.scaleLinear()
        .domain([2007, 2012])
        .range([box.x + 10, box.x + box.width - 10])
        .clamp(true);

    // Cancel the current transition, if any.
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
        return function(t) {displayYear(year(t));};
      }

    function displayYear(year) {
      var p=d3.precisionFixed(1); f=d3.format("." + p + "f"); 
        dot.data(interpolateData(f(year)),key).call(position).sort(order);
        label.text(Math.round(year));
      }

    function interpolateData(year) {
        return data.map(function(d) {
          return {
            name: d.city_eng,
            region: d.region,
            salary: f(d.salary[year-2007]/d.CPI[year-2007]*100),
            resid_price: f(d.resid_price[year-2007]/d.CPI[year-2007]*100),
            resid_area: f(d.resid_area[year-2007]),
            housing_price: f(d.housing_price[year-2007]/d.CPI[year-2007]*100),
            pop: f(d.pop[year-2007])
          };
        });
      }
    });
}