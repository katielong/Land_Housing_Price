// function
function change(){
    newdata = which(data,currentyear,currentvar);
    d3.json("d3js-footprint-master/data/china_cities.json", function(counties){
        d3.selectAll("path")
        .data(counties.features)
        .transition()
        .duration(750)
        .style("fill",function(d){return quantize(newdata.get(d.id));});
    });    
}

function animateMap(){    
    if (playing==false){
       playing=true; 
       timer=setInterval(function(){
            if(currentyear!=2012){
                currentyear +=1;
            }
            else if (currentyear==2012){
                currentyear=2007;}
            change();
            d3.select("#clock").html(currentyear);
            d3.select("input").attr("value","STOP");
            playing=true;
        },2007);
    }
    else if (playing==true){
            clearInterval(timer);
            d3.select("input").attr("value","PLAY");
            playing=false;
        }
}

// declare global variable
var tooltip = d3.select("#content").append("div")
    .attr("id", "tooltip")
    .style("display", "none")
    .style("position", "absolute")
    .html("<label><span id=\"tt_county\"></span></label>");

var w=650, h=500, playing=false, currentyear, currentvar, newdata, data, timer;

var p=d3.precisionFixed(0.5), f=d3.format("." + p + "f");

var projection=d3.geoMercator().center([105,38]).scale(590).translate([w/2, h/2.1]);

var path=d3.geoPath().projection(projection);

var quantize = d3.scaleThreshold()
    .domain([100, 200, 500, 1000, 2000, 5000, 8000, 10000, 12000, 15000, 50000])
    .range(['#a50026','#d73027','#f46d43','#fdae61','#fee090','#ffffbf','#e0f3f8','#abd9e9','#74add1','#4575b4','#313695']);

var svg = d3.selectAll("#content")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

// load data files
d3.csv("data.csv",function(csv){
    data=csv2json(csv);

    currentyear=2007;
    currentvar="Residential Land Price"
    newdata = which(data,currentyear,currentvar);

    // english name for each city
    var eng_name = d3.map();
    data.forEach(function(d){
        eng_name.set(d.cityid, d.city_eng);
    });

    d3.json("d3js-footprint-master/data/china_cities.json", function(counties){

    svg.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(counties.features)
        .enter()
        .append("path")
        .style("fill", function(d) {return quantize(newdata.get(d.id)); }) 
        .attr("d", path)    
        .attr("id", function(d) {return d.cityid;})
        .attr("data-legend",function(d) { return d.name})
        .on("mouseover", function(d) {
            var m = d3.mouse(d3.select("body").node());
            tooltip.style("display", null)
            .style("left", m[0] + 10 + "px")
            .style("top", m[1] - 10 + "px");
            d3.select(this).transition().duration(200).style("fill","yellow");
            $("#tt_county").html(d.properties.name + " ( " + eng_name.get(d.id) + " ): " + newdata.get(d.id));})
        .on("mouseout", function() {
            tooltip.style("display", "none");
            d3.select(this).transition().duration(200).style("fill",function(d) { return quantize(newdata.get(d.id)); });
        });

    d3.select("#clock").html(currentyear);

        // province
    d3.json("d3js-footprint-master/data/china_provinces.json", function(states){
        svg.append("g")
        .attr("class", "states")
        .selectAll("path")
        .data(states.features)
        .enter()
        .append("path")
        .attr("d", path);
    });

    // legend
    var h=50;
    var x = d3.scaleLinear().domain([0,15000]).range([0,w]);
    var arr = [100, 200, 500, 1000, 2000, 5000, 8000, 10000, 12000];

    var xAxis = d3.axisTop()
    .scale(x)
    .tickSize(9) 
    .tickValues([1500, 3000, 4500, 6000, 7500, 9000, 10500, 12000, 13500])
    .tickFormat(function(d, i) {return arr[i];});   

    var svg2 = d3.selectAll("#content").append("svg")
    .attr("id","legend")
    .attr("width", w)
    .attr("height", h);

    var g = svg2.append("g")
    .attr("class", "key")
    .attr("transform", "translate(" + 0 + "," + h / 2 + ")");

    g.selectAll("rect")
    .data(quantize.range().map(function(color){
            var d = quantize.invertExtent(color);
            if (d[0] == null) d[0] = x.domain()[0];
            return d;}))
    .enter()
    .append("rect")
    .attr("height", 20)
    .attr("x", function(d, i) { return w/10 * i; })
    .attr("width", function(d) { return w/10; })
    .style("fill", function(d) { return quantize(d[1]); });
    
    g.call(xAxis);

    //drop-down menu
    d3.select('#opts').on('change', function() {
        var value=this.value;
        currentvar = value;
        newdata=which(data,currentyear,currentvar);
        d3.selectAll("path")
        .style("fill", function(d){return quantize(newdata.get(d.id));});
    });
    });
});






