// function
function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = w / 2;
    y = h / 2;
    k = 1;
    centered = null;
  }
  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}


function display_tooltip(name, number, unit){
    if (number==null || isNaN(number)==true){
        return name + ": " + "NA";
    }else {
        return name + ": " + f_comma(number)+" "+unit;
    }
}

// declare global variable
var tooltip = d3.select("#content").append("div")
    .attr("id", "tooltip")
    .style("display", "none")
    .style("position", "absolute")
    .html("<label><span id=\"tt_county\"></span></label>");

var w=650, h=500, currentyear=2007, centered;

var p=d3.precisionFixed(0.5), f=d3.format("." + p + "f"), f_comma = d3.format(",");

var projection=d3.geoMercator().center([105,38]).scale(590).translate([w/2, h/2.1]);

var path=d3.geoPath().projection(projection);

var svg = d3.selectAll("#content")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

svg.append("rect")
    .attr("class","background")
    .attr("width",w)
    .attr("height", h)
    .on("click",clicked);

var g=svg.append("g");

var eng_name = d3.map(), resid_area = d3.map(), resid_price = d3.map(), 
    housing_price = d3.map(), pop=d3.map(),  salary = d3.map();

// load data files
d3.csv("data.csv",function(csv){
    var data=csv2json(csv);
    map_multiple(data,currentyear);

    d3.json("d3js-footprint-master/data/china_cities.json", function(counties){
    g.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(counties.features)
        .enter()
        .append("path")
        .style("fill", "#FFF") //get the value for the given key
        .attr("d", path)    //this line draw the paths for counties
        .attr("id", function(d) {return d.cityid;})
        .attr("data-legend",function(d) { return d.name})
        .on("click",clicked)
        .on("mouseover", function(d) {
            var m = d3.mouse(d3.select("body").node());
            tooltip.style("display", null)
            .style("left", m[0] + 10 + "px")
            .style("top", m[1] - 10 + "px");
            // tooltip
            d3.select(this).transition().duration(200).style("fill","yellow");
            $("#tt_county").html(d.properties.name + "<br>" +
            display_tooltip("Real Residential Land Price", resid_price.get(d.id)*10000, "RMB/Acre") + "<br>" +
            display_tooltip("Real Housing Price", housing_price.get(d.id), "RMB/m <sup>2</sup>") + "<br>" +
            display_tooltip("New Land Sales", resid_area.get(d.id), "Acre") + "<br>" +
            display_tooltip("Urban Population", pop.get(d.id)*10000, "People") + "<br>" +
            display_tooltip("Real Per Capita Income", salary.get(d.id), "RMB") + "<br>");
            })
        .on("mouseout", function() {
            tooltip.style("display", "none");
            d3.select(this).transition().duration(200).style("fill","#FFF");
        });

        // province
        d3.json("d3js-footprint-master/data/china_provinces.json", function(states){
            g.append("g")
            .attr("class", "states")
            .selectAll("path")
            .data(states.features)
            .enter()
            .append("path")
            .attr("d", path);
        });
    });


    d3.select('#opts').on('change', function() {
        currentyear=this.value;
        map_multiple(data, currentyear); 
    });
});







