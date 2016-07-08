// json files from d3js-footprint: http://blog.econst.org/footprint

function csv2json(csv){ 
      var nested = d3.nest()
        .key(function(d){ return d.cityid; })
        .entries(csv)
        
      var json = nested.map(function(d){
        var namerecord = {};
        namerecord.cityid = d.key; 
        namerecord.city = d.values[0].city;
        namerecord.province = d.values[0].province;
        namerecord.city_eng = d.values[0].city_eng;
        
        namerecord.resid_price = d.values.map(function(c){ return c.resid_price; });
        namerecord.resid_area= d.values.map(function(c){ return c.resid_area; });
        namerecord.housing_price = d.values.map(function(c){ return c.housing_price; });
        namerecord.CPI = d.values.map(function(c){ return c.CPI; });
        namerecord.pop = d.values.map(function(c){ return c.nmzrk; });
        return namerecord;
      });
      return json;
}

function which(data, year){
    data.forEach(function(d){
        rateById.set(d.cityid, +d.resid_price[year-2007]);
    });
}


var tooltip = d3.select("body").append("div")
    .attr("id", "tooltip")
    .style("display", "none")
    .style("position", "absolute")
    .html("<label><span id=\"tt_county\"></span></label>");//what does this line do?

var rateById = d3.map();

var w=650;
var h=550;

var projection=d3.geoMercator().center([105,38]).scale(590).translate([w/2, h/2.2]);
var path=d3.geoPath().projection(projection);

var svg = d3.select("body")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

var quantize = d3.scaleThreshold()
    .domain([100, 200, 350, 500, 800, 3000, 5000, 8000, 10000])
    .range(["#FFC4C0", "#FF9580", "#E58673","#B2685A", "#7F4A40", "#693F36", "#5E302A", "#45231F", "#2E1715"]);


d3.csv("data.csv",function(csv){
    var data=csv2json(csv);
    which(data,2007);
    
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
        .style("fill", function(d) { return quantize(rateById.get(d.id)); }) //get the value for the given key
        .attr("d", path)    //this line draw the paths for counties
        .attr("id", function(d) {return d.cityid;})
        .attr("data-legend",function(d) { return d.name})
        .on("mouseover", function(d) {
            var m = d3.mouse(d3.select("body").node());
            tooltip.style("display", null)
                .style("left", m[0] + 10 + "px")
                .style("top", m[1] - 10 + "px");
            d3.select(this).transition().duration(200).style("fill","yellow");
            $("#tt_county").text(d.properties.name + " (" + eng_name.get(d.id) + " City ): " + rateById.get(d.id));
        })
        .on("mouseout", function() {
            tooltip.style("display", "none");
            d3.select(this).transition().duration(200).style("fill",function(d) { return quantize(rateById.get(d.id)); });

        });


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
            var formatNumber = d3.format(".0f");
            var w=1000;
            var h=50;

            var x = d3.scaleLinear()
            .domain([0,10000])
            .range([0,w]);

            var xAxis = d3.axisTop()
            .scale(x)
            .tickSize(6)
            .tickValues([100,500,1000,2000,5000,8000])
            .tickFormat(function(d) {return formatNumber(d);});                

            var svg2 = d3.selectAll("body").append("svg")
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
            .attr("x", function(d, i) { return x(d[0]); })
            .attr("width", function(d) { return x(d[1])-x(d[0]); })
            .style("fill", function(d) { return quantize(d[1]); });
            
            g.call(xAxis);
    })

    // slider
    d3.selectAll("input").on("change", function change() {
        var value = this.value;

        d3.selectAll("path")
        .style("fill", function(d) {
            switch (value) {
                case "2007":
                    which(data,2007);
                    return quantize(rateById.get(d.id));
                    break;
                case "2008":
                    which(data,2008);
                    return quantize(rateById.get(d.id));
                    break;
                case "2009":
                    which(data,2009);
                    return quantize(rateById.get(d.id));
                    break;
                case "2010":
                    which(data,2010);
                    return quantize(rateById.get(d.id));
                    break;
                case "2011":
                    which(data,2011);
                    return quantize(rateById.get(d.id));
                    break;
                case "2012":
                    which(data,2012);
                    return quantize(rateById.get(d.id));
                    break;
            }
        });
    });

});



