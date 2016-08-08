// accessor of variable
function x1(d) { return d.resid_price; }
function y1(d) { return d.next_housing_price; }

function x2(d) { return d.housing_price; }
function y2(d) { return d.resid_price; }

function key(d) { return d.name; }
function radius(d) { return d.pop; }

//global functions
function order(a, b) {
  return radius(b) - radius(a);
}

function interpolateValues(values,year){
  var bisect = d3.bisector(function(d) { return d.year; }),
      i = bisect.left(values,year,0,values.length-1), 
      a = values[i];    

  if (year<=2012){
    if (i>0){
      var b = values[i-1];
      t = (year - a.year)/(b.year-a.year);
      return a.value*(1-t)+b.value*t;
    }
    return a.value;
  }
  else if (year>2012){
    var end = values[values.length-1];
    return end.value;
  }
}

//start
var p=d3.precisionFixed(0.5), f=d3.format("." + p + "f");

var margin = {top:19.5, right: 13, bottom: 19.5, left: 35},
    w = 450 - margin.right,
    h = 400 - margin.top - margin.bottom;

var x1Scale =  d3.scaleSqrt().domain([0,6500]).range([0, w]),
    y1Scale = d3.scaleSqrt().domain([400, 8500]).range([h, 0]),
    x2Scale =  d3.scaleSqrt().domain([400, 8500]).range([0, w]),
    y2Scale = d3.scaleSqrt().domain([0,6500]).range([h, 0]),
    radiusScale = d3.scaleLinear().domain([0, 1800]).range([0, 50]);

var x1Axis = d3.axisBottom().scale(x1Scale).ticks(8, d3.format(",d")),
    y1Axis = d3.axisLeft().scale(y1Scale),
    x2Axis = d3.axisBottom().scale(x2Scale).ticks(8, d3.format(",d")),
    y2Axis = d3.axisLeft().scale(y2Scale);

var tooltip = d3.select("#content1").append("div")
    .attr("id", "tooltip")
    .style("display", "none")
    .style("position", "absolute")
    .html("<label><span id=\"tt_county\"></span></label>");


// svg1
var svg = d3.select("#content1").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + h + ")")
    .call(x1Axis);

svg.append("g")
    .attr("class", "y axis")
    .call(y1Axis);

svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", w)
    .attr("y", h - 6)
    .text("Real Residential Land Price (*10,000 RMB/Acre)");

svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Next Year Real Housing Price (RMB/m2)");

var label = svg.append("text")
    .attr("class", "year label")
    .attr("text-anchor", "end")
    .attr("y", 60)
    .attr("x", w)
    .text(2007);

// svg2
var svg2 = d3.select("#content2").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg2.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + h + ")")
    .call(x2Axis);

svg2.append("g")
    .attr("class", "y axis")
    .call(y2Axis);

svg2.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", w)
    .attr("y", h - 6)
    .text("Real Housing Price (RMB/m2)");

svg2.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Real Residential Land Price (*10,000 RMB/Acre)");

var label2 = svg2.append("text")
    .attr("class", "year label")
    .attr("text-anchor", "end")
    .attr("y", 60)
    .attr("x", w)
    .text(2007);





// change for svg
function change1(){
d3.selectAll(".dots").remove();

d3.csv("data.csv", function(csv){
  var data=csv2json_scatter(csv);
  dot = svg.append("g")
      .attr("class", "dots")
      .selectAll(".dot")
      .data(interpolateData(2007))
      .enter()
      .append("circle")
      .attr("class", "dot")
      .style("fill","#FFF")
      .call(position1)
      .sort(order)
      .on("mouseover", function(d) {
            var m = d3.mouse(d3.select("body").node());
            // tooltip
            tooltip.style("display", null)
                .style("left", m[0] + 10 + "px")
                .style("top", m[1] - 10 + "px");
            $("#tt_county").html(key(d)+" City");
        })
        .on("mouseout", function() {
            tooltip.style("display", "none");
        });

  // animation
  svg.transition()
      .duration(10000)
      .tween("year", tweenYear);

  function position1(dot) {
    dot.attr("cx", function(d) { return x1Scale(x1(d)); })
        .attr("cy", function(d) {return y1Scale(y1(d)); })
        .attr("r", function(d) { return radiusScale(radius(d)); });
    }
    
  function tweenYear() {
      var year = d3.interpolateNumber(2007, 2012);
      return function(t) {displayYear(year(t));};
  }

  function displayYear(year) {
    dot.data(interpolateData(year),key).call(position1).sort(order);
    label.text(Math.round(year));
  }

  function interpolateData(year) {
      return data.map(function(d) {
        return {
          name: d.city_eng,
          region: d.region,
          salary: interpolateValues(d.salary,year),
          resid_price: interpolateValues(d.resid_price,year),
          pop: interpolateValues(d.pop, year),

          // current and next year housing price interpolation
          housing_price: interpolateValues(d.housing_price,year),
          next_housing_price: interpolateValues(d.housing_price,year+1),

          // per capita
          per_resid_area: interpolateValues(d.per_resid_area,year),
          per_ind_area: interpolateValues(d.per_ind_area, year),
          per_houseinvest_re:interpolateValues(d.per_houseinvest_re, year)
        };
      });
    }
  });
}


// change for svg2
function change2(){
      d3.selectAll(".dots").remove();
      d3.csv("data.csv", function(csv){
        var data=csv2json_scatter(csv);
        
      dot2 = svg2.append("g")
                    .attr("class", "dots")
                    .selectAll(".dot")
                    .data(interpolateData(2007))
                    .enter()
                    .append("circle")
                    .attr("class", "dot")
                    .style("fill","#FFF")
                    .call(position2)
                    .sort(order)
                    .on("mouseover", function(d) {
                          var m = d3.mouse(d3.select("body").node());
                          // tooltip
                          tooltip.style("display", null)
                              .style("left", m[0] + 10 + "px")
                              .style("top", m[1] - 10 + "px");
                          $("#tt_county").html(key(d)+" City");
                      })
                      .on("mouseout", function() {
                          tooltip.style("display", "none");
                      });

      // animation
      svg2.transition()
          .duration(10000)
          .tween("year", tweenYear2);


      function position2(dot){
      dot.attr("cx", function(d) { return x2Scale(x2(d)); })
          .attr("cy", function(d) {return y2Scale(y2(d)); })
          .attr("r", function(d) { return radiusScale(radius(d)); });
      }

      function tweenYear2() {
        var year = d3.interpolateNumber(2007, 2012);
        return function(t) {displayYear2(year(t));};
      }

      function displayYear2(year) {
        dot2.data(interpolateData(year),key).call(position2).sort(order);
        label2.text(Math.round(year));
      }
        
      function interpolateData(year) {
      return data.map(function(d) {
        return {
          name: d.city_eng,
          region: d.region,
          salary: interpolateValues(d.salary,year),
          resid_price: interpolateValues(d.resid_price,year),
          pop: interpolateValues(d.pop, year),

          // current and next year housing price interpolation
          housing_price: interpolateValues(d.housing_price,year),
          next_housing_price: interpolateValues(d.housing_price,year),

          // per capita
          per_resid_area: interpolateValues(d.per_resid_area,year),
          per_ind_area: interpolateValues(d.per_ind_area, year),
          per_houseinvest_re:interpolateValues(d.per_houseinvest_re, year)
        };
      });
    }
  });
}


function change(){
  change1();
  change2();
}