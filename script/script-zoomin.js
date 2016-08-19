// function
function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 5;
    centered = d;
  } else {
    x = w / 2;
    y = h / 22;
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


function chart1(d){
    var max = d3.max(d,function(d){return d.housing_price;}),
        max2 = d3.max(d,function(d){return d.resid_price;});

    yScale.domain([0, max]);
    yScale2.domain([0, max2]);
    
    yAxis = d3.axisLeft().scale(yScale).ticks(6,d3.format("")).tickSizeOuter(0);
    yAxis2 = d3.axisRight().scale(yScale2).ticks(6,d3.format("")).tickSizeOuter(0);
  
    d3.select("#year-chart1")
        .selectAll(".y")
        .transition()
        .call(yAxis);

    d3.select("#year-chart1")
        .selectAll(".y2")
        .transition()
        .call(yAxis2);

    var line = d3.line()
                .x(function(d){return xScale(d.year);})
                .y(function(d){return yScale(d.housing_price);}),

        line2 = d3.line()
                .x(function(d){return xScale(d.year)})
                .y(function(d){return yScale2(d.resid_price);});

    svg1.append("path")
        .attr("class","line")
        .attr("d",line(d));

    svg1.append("path")
        .attr("class","line2")
        .attr("d",line2(d));

    svg1.selectAll(".dot")
        .data(d)
        .enter().append("circle")
        .attr("r", 3)
        .attr("cx", function(d){return xScale(d.year);})
        .attr("cy", function(d){return yScale(d.housing_price);})

    svg1.selectAll(".dot")
        .data(d)
        .enter().append("circle")
        .attr("r", 3)
        .attr("cx", function(d){return xScale(d.year);})
        .attr("cy", function(d){return yScale2(d.resid_price);})


}

function chart2(d){
    var max = d3.max(d,function(d){return d.resid_area;}),
    max3 = d3.max(d,function(d){return d.resid_price;});

    yScale.domain([0, max]); 
    yScale3.domain([0, max3]);

    yAxis = d3.axisLeft().scale(yScale).ticks(6,d3.format("")).tickSizeOuter(0);
    yAxis3 = d3.axisRight().scale(yScale3).ticks(6,d3.format("")).tickSizeOuter(0);

    d3.select("#year-chart2")
        .selectAll(".y")
        .transition()
        .call(yAxis);

    d3.select("#year-chart2")
        .selectAll(".y2")
        .transition()
        .call(yAxis3);

    var line = d3.line()
            .x(function(d){return xScale(d.year);})
            .y(function(d){return yScale3(d.resid_price);});
    
    svg2.selectAll(".dot")
        .data(d)
        .enter().append("circle")
        .attr("r", 3)
        .attr("cx", function(d){return xScale(d.year);})
        .attr("cy", function(d){return yScale3(d.resid_price);})


    svg2.append("path")
        .attr("class","line2")
        .attr("d",line(d));

    svg2.selectAll(".bar")
        .data(d)
        .enter()
        .append("rect")
        .attr("x", function(d){return xScale_bar(d.year);})
        .attr("width", "39px")
        .attr("y", function(d){return yScale(d.resid_area);})
        .attr("height", function(d){return height - yScale(d.resid_area);});
}



// global variable
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
var id_eng = d3.map(), eng_id = d3.map();


// variables for charts
var margin = {top: 20, right: 30, bottom: 20, left: 50},
    width = w/2-margin.left,
    height = h/2-margin.top-margin.bottom,
    pos=[];

// position for tick values
for (i=0;i<6;i++){
    pos.push(3*(2*i+1)+39.83*i);}
pos.push(275);

var xScale=d3.scaleLinear()
            .domain([2006.5,2012.5])
            .range([0,width]),
    xScale_bar = d3.scaleOrdinal()
                .domain([2007,2008,2009,2010,2011,2012,2013])
                .range(pos),

    yScale = d3.scaleLinear().range([height, 0]), 
    yScale2 = d3.scaleLinear().range([height, 0]),
    yScale3 = d3.scaleLinear().range([height, 0]),
    tickFormat = d3.format(",");

var xAxis = d3.axisBottom()
                .scale(xScale)
                .ticks(6, d3.format(""))
                .tickValues([2007,2008,2009,2010,2011,2012]),
    xAxis_bar = d3.axisBottom()
                .scale(xScale_bar)
                .ticks(6, d3.format(""))
                .tickValues([2007,2008,2009,2010,2011,2012]),

    yAxis = d3.axisLeft().scale(yScale), 
    yAxis2 = d3.axisRight().scale(yScale2), 
    yAxis3 = d3.axisRight().scale(yScale3);



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

svg1.append("g")
    .attr("class", "y2 axis")
    .attr("transform", "translate(" + width + ",0)")
    .call(yAxis2);

svg1.append("text")
    .attr("text-anchor", "end")
    .attr("x", margin.left+40)
    .attr("y", -10)
    .style("fill","steelblue")
    .text("Real Housing Price(1000 RMB/m2)");

svg1.append("text")
    .attr("text-anchor", "end")
    .attr("x", width+margin.right)
    .attr("y", -10)
    .style("fill","red")
    .text("Residential Land Price(100,000RMB/Acre)");


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

svg2.append("g")
    .attr("class", "y2 axis")
    .attr("transform", "translate(" + width + ",0)")
    .call(yAxis3);

svg2.append("text")
    .attr("text-anchor", "end")
    .attr("x", margin.left)
    .attr("y", -10)
    .style("fill","#666")
    .text("New Land Sales (Acre)");

svg2.append("text")
    .attr("text-anchor", "end")
    .attr("x", width+margin.right)
    .attr("y", -10)
    .style("fill","red")
    .text("Residential Land Price(100,000RMB/Acre)");
    

// load data files
d3.csv("data.csv",function(csv){
    var data=csv2json(csv);
    data.forEach(function(d){
        id_eng.set(d.cityid, d.city_eng);
        eng_id.set(d.city_eng, d.cityid);
    });


    d3.json("d3js-footprint-master/data/china_cities.json", function(counties){
        g.append("g")
            .attr("id", "counties")
            .attr("class", "counties")
            .selectAll("path")
            .data(counties.features)
            .enter()
            .append("path")
            .attr("d", path)
            .on("click",function(d){ 
                d3.selectAll(".line").remove();
                d3.selectAll(".line2").remove();
                d3.selectAll("rect").remove();
                d3.selectAll("circle").remove();
                clicked(d);
                lines(d);
            })
            .on("mouseover", function(d) {
                var m = d3.mouse(d3.select("body").node());
                tooltip.style("display", null)
                .style("left", m[0] + 5 + "px")
                .style("top", m[1] - 5 + "px");

                if (id_eng.get(d.id)!=null){
                    $("#tt_county").html(id_eng.get(d.id));
                } else {
                    $("#tt_county").html("No Data Available");
                }     
            })
            .on("mouseout", function() {
                tooltip.style("display", "none");
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

            // enable search
            d3.select("#search").on("input", function(d){
                var city = this.value,
                    city_json = counties.features.filter(function(d){
                        return d.id==eng_id.get(city);
                    })[0];
                d3.selectAll(".line").remove();
                d3.selectAll(".line2").remove();
                d3.selectAll("rect").remove();  
                d3.selectAll("circle").remove();
                clicked(city_json);
                lines(city_json);
            });
    });

    function lines(d){
        var id = d.id, target = data.filter(function(d){return d.cityid===id;})[0];
        var out=[];
        var f2 = d3.format(".0f");
        for (i=0;i<=5;i++){
            out[i] = {housing_price: +target.housing_price[i]/100, 
                      resid_price: +target.resid_price[i]/100,
                      resid_area: +target.resid_area[i]/100,
                      year: +target.year[i]};}

        chart1(out);
        chart2(out);
    }

});









