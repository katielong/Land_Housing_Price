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


function line1(d){
    var max = d3.max(d,function(d){return d.housing_price;});

    yScale.domain([0, max]);
    yAxis = d3.axisLeft().scale(yScale).ticks(4,d3.format(""));
    
    d3.select("#year-chart1")
        .selectAll(".y")
        .transition()
        .call(yAxis);

    var line = d3.line()
                .x(function(d){return xScale(d.year);})
                .y(function(d){return yScale(d.housing_price);});

    svg1.append("path")
        .attr("class","line")
        .attr("d",line(d));

    svg1.on("mouseover",function(d){

    })
}

function line2(d){
    var max = d3.max(d,function(d){return d.resid_price;});
    yScale.domain([0, max]);    
    yAxis = d3.axisLeft().scale(yScale).ticks(4,d3.format(""));
    
    d3.select("#year-chart2")
        .selectAll(".y")
        .transition()
        .call(yAxis);

    var line = d3.line()
            .x(function(d){return xScale(d.year);})
            .y(function(d){return yScale(d.resid_price);});

    svg2.append("path")
    .attr("class","line")
    .attr("d",line(d));

}


function line3(d){
    var max = d3.max(d,function(d){return d.resid_area;});
    yScale.domain([0, max]);  
    yAxis = d3.axisLeft().scale(yScale).ticks(4,d3.format(""));
    
    d3.select("#year-chart3")
        .selectAll(".y")
        .transition()
        .call(yAxis);

    var line = d3.line()
            .x(function(d){return xScale(d.year);})
            .y(function(d){return yScale(d.resid_area);});

    svg3.append("path")
    .attr("class","line")
    .attr("d",line(d));
}

function line4(d){
    var max = d3.max(d,function(d){return d.salary;});
    yScale.domain([0, max]);   
    yAxis = d3.axisLeft().scale(yScale).ticks(4,d3.format(""));
    
    d3.select("#year-chart4")
        .selectAll(".y")
        .call(yAxis);

    var line = d3.line()
            .x(function(d){return xScale(d.year);})
            .y(function(d){return yScale(d.salary);});

    svg4.append("path")
    .attr("class","line")
    .attr("d",line(d));

}

function line5(d){
    var max = d3.max(d,function(d){return d.pop;});
    yScale.domain([0, max]);  
    yAxis = d3.axisLeft().scale(yScale).ticks(4,d3.format(""));
    
    d3.select("#year-chart5")
        .selectAll(".y")
        .transition()
        .call(yAxis);


    var line = d3.line()
            .x(function(d){return xScale(d.year);})
            .y(function(d){return yScale(d.pop);});

    svg5.append("path")
    .attr("class","line")
    .attr("d",line(d));
}






// declare global variable
var tooltip = d3.select("#map").append("div")
    .attr("id", "tooltip")
    .style("display", "none")
    .style("position", "absolute")
    .html("<label><span id=\"tt_county\"></span></label>");

var w=650, h=500, currentyear=2007, centered;

var p=d3.precisionFixed(0.5), f=d3.format("." + p + "f");

var projection=d3.geoMercator().center([105,38]).scale(590).translate([w/2, h/2.1]);

var path=d3.geoPath().projection(projection);

var svg = d3.selectAll("#map")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

svg.append("rect")
    .attr("class","background")
    .attr("width",w)
    .attr("height", h)
    .on("click",clicked);

var g=svg.append("g");

var eng_name = d3.map();


// variables for line charts
// these width and height are for line charts
var margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = w/2-margin.left,
    height = h/5-margin.top-margin.bottom,
    xScale=d3.scaleLinear()
            .domain([2007,2012])
            .range([0,width]),
    yScale= d3.scaleLinear().range([height, 0]),
    tickFormat = d3.format(",");

var xAxis = d3.axisBottom().scale(xScale).ticks(3, d3.format("")).tickValues([2008,2010,2012]),
    yAxis = d3.axisLeft().scale(yScale).ticks(6,tickFormat);



// SVGs
// svg1
var svg1 = d3.select("#year-chart1")
            .append("svg")
            .attr("width",width+margin.left+margin.right)
            .attr("height",height+margin.top+margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg1.append("g")
    .attr("class","x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg1.append("g")
    .attr("class", "y axis")
    .call(yAxis);


// svg2
var svg2 = d3.select("#year-chart2")
            .append("svg")
            .attr("width",width+margin.left+margin.right)
            .attr("height",height+margin.top+margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg2.append("g")
    .attr("class","x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg2.append("g")
    .attr("class", "y axis")
    .call(yAxis);



// svg3
var svg3 = d3.select("#year-chart3")
            .append("svg")
            .attr("width",width+margin.left+margin.right)
            .attr("height",height+margin.top+margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg3.append("g")
    .attr("class","x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg3.append("g")
    .attr("class", "y axis")
    .call(yAxis);


// svg4
var svg4 = d3.select("#year-chart4")
            .append("svg")
            .attr("width",width+margin.left+margin.right)
            .attr("height",height+margin.top+margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg4.append("g")
    .attr("class","x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg4.append("g")
    .attr("class", "y axis")
    .call(yAxis);
    


// svg5
var svg5 = d3.select("#year-chart5")
            .append("svg")
            .attr("width",width+margin.left+margin.right)
            .attr("height",height+margin.top+margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg5.append("g")
    .attr("class","x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg5.append("g")
    .attr("class", "y axis")
    .call(yAxis);



// load data files
d3.csv("data.csv",function(csv){
    var data=csv2json(csv);
    data.forEach(function(d){eng_name.set(d.cityid, d.city_eng);});

    d3.json("d3js-footprint-master/data/china_cities.json", function(counties){
        g.append("g")
            .attr("class", "counties")
            .selectAll("path")
            .data(counties.features)
            .enter()
            .append("path")
            .style("fill", function(d){
                if (eng_name.get(d.id)==null){
                    return ("#AAA");
                }
                else return ("#FFF");
            }) 
            .attr("d", path)
            .attr("id", function(d) {return d.cityid;})
            .attr("data-legend",function(d) { return d.name})
            .on("click",function(d){ 
                d3.selectAll(".line").remove();
                clicked(d);
                lines(d);
            })
            .on("mouseover", function(d) {
                var m = d3.mouse(d3.select("body").node());
                tooltip.style("display", null)
                .style("left", m[0] + 5 + "px")
                .style("top", m[1] - 5 + "px");
                // tooltip
                d3.select(this).transition().duration(200).style("fill", function(d){
                    if (eng_name.get(d.id)==null){
                        return ("#AAA");
                    }
                    else return ("yellow");
                });

                if (eng_name.get(d.id)!=null){
                    $("#tt_county").html(eng_name.get(d.id));
                } else {
                    $("#tt_county").html("No Data Available");
                }
                    
            })
            .on("mouseout", function() {
                tooltip.style("display", "none");
                d3.select(this).transition().duration(200).style("fill",function(d){
                if (eng_name.get(d.id)==null){
                    return ("#AAA");
                }
                else return ("#FFF");
                });
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

    function lines(d){
        var id = d.id, target = data.filter(function(d){return d.cityid===id;})[0];
        var out=[];
        var f2 = d3.format(".0f");
        for (i=0;i<=6;i++){
            out[i] = {housing_price: +target.housing_price[i]/100, 
                      resid_price: +target.resid_price[i]/100,
                      resid_area: +target.resid_area[i]/100,
                      pop: +target.pop[i]/10,
                      salary: +target.salary[i]/1000,
                      year: +target.year[i]};}

        line1(out);
        line2(out);
        line3(out);
        line4(out);
        line5(out);
    }

});







