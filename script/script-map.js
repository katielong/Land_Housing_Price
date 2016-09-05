// json files from d3js-footprint: http://blog.econst.org/footprint

// declare global variable
var tooltip = d3.select("#overview").append("div")
    .attr("id", "tooltip")
    .style("display", "none")
    .style("position", "absolute")
    .html("<label><span id=\"tt_county\"></span></label>"); //what does this line do?

var w = 650,
    h = 550,
    currentyear, currentvar, newdata;

var projection = d3.geoMercator().center([105, 38]).scale(590).translate([w / 2, h / 2.2]);

var path = d3.geoPath().projection(projection);

var svg = d3.selectAll("#overview")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

var quantize = d3.scaleThreshold()
    .domain([100, 300, 500, 800, 1000, 1500, 2000, 5000, 8000])
    .range(["#FFC4C0", "#FF9580", "#E58673", "#B2685A", "#7F4A40", "#693F36", "#5E302A", "#45231F", "#2E1715"]);

var p = d3.precisionFixed(0.5);
f = d3.format("." + p + "f");

// load data files
d3.csv("data.csv", function(csv) {
    var data = csv2json(csv);

    currentyear = 2007;
    currentvar = "Residential Land Price"
    newdata = which(data, currentyear, currentvar);

    var eng_name = d3.map(),
        pop = d3.map(),
        resid_area = d3.map();

    data.forEach(function(d) {
        eng_name.set(d.cityid, d.city_eng);
    });

    data.forEach(function(d) {
        pop.set(d.cityid, d.pop[currentyear - 2007]);
    });

    data.forEach(function(d) {
        resid_area.set(d.cityid, d.resid_area[currentyear - 2007]);
    });



    d3.json("d3js-footprint-master/data/china_cities.json", function(counties) {

        svg.append("g")
            .attr("class", "counties")
            .selectAll("path")
            .data(counties.features)
            .enter()
            .append("path")
            .style("fill", function(d) {
                return quantize(newdata.get(d.id));
            }) //get the value for the given key
            .attr("d", path) //this line draw the paths for counties
            .attr("id", function(d) {
                return d.cityid;
            })
            .attr("data-legend", function(d) {
                return d.name
            })
            .on("mouseover", function(d) {
                var m = d3.mouse(d3.select("body").node());
                tooltip.style("display", null)
                    .style("left", m[0] + 10 + "px")
                    .style("top", m[1] - 10 + "px");
                d3.select(this).transition().duration(200).style("fill", "yellow");
                $("#tt_county").html(d.properties.name + " (" + eng_name.get(d.id) + " City) <br>" +
                    currentvar + ": " + newdata.get(d.id) + "<br>" +
                    "Residential Area: " + resid_area.get(d.id) + " Acre <br>" +
                    "Population: " + pop.get(d.id) * 10000);
            })
            .on("mouseout", function() {
                tooltip.style("display", "none");
                d3.select(this).transition().duration(200).style("fill", function(d) {
                    return quantize(newdata.get(d.id));
                });

            });

        // province
        d3.json("d3js-footprint-master/data/china_provinces.json", function(states) {
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
        var w = 1000;
        var h = 50;

        var x = d3.scaleLinear()
            .domain([0, 8000])
            .range([0, w]);

        var xAxis = d3.axisTop()
            .scale(x)
            .tickSize(6)
            .tickValues([100, 500, 1000, 1500, 2000, 5000])
            .tickFormat(function(d) {
                return formatNumber(d);
            });

        var svg2 = d3.selectAll("#overview").append("svg")
            .attr("id", "legend")
            .attr("width", w)
            .attr("height", h);

        var g = svg2.append("g")
            .attr("class", "key")
            .attr("transform", "translate(" + 0 + "," + h / 2 + ")");

        g.selectAll("rect")
            .data(quantize.range().map(function(color) {
                var d = quantize.invertExtent(color);
                if (d[0] == null) d[0] = x.domain()[0];
                return d;
            }))
            .enter()
            .append("rect")
            .attr("height", 20)
            .attr("x", function(d, i) {
                return x(d[0]);
            })
            .attr("width", function(d) {
                return x(d[1]) - x(d[0]);
            })
            .style("fill", function(d) {
                return quantize(d[1]);
            });

        g.call(xAxis);
    })

    //drop-down menu
    d3.select('#opts').on('change', function() {
        var value = this.value;
        if (value == "resid_price") {
            currentvar = "Residential Land Price";
            newdata = which(data, currentyear, currentvar);
        } else if (value == "housing_price") {
            currentvar = "Housing Price";
            newdata = which(data, currentyear, currentvar);
        };

        d3.selectAll("path")
            .style("fill", function(d) {
                return quantize(newdata.get(d.id));
            });
    });


    // slider
    d3.selectAll("input").on("change", function change() {
        var value = this.value;
        d3.selectAll("path")
            .style("fill", function(d) {
                switch (value) {
                    case "2007":
                        currentyear = 2007;
                        newdata = which(data, currentyear, currentvar);
                        return quantize(newdata.get(d.id));
                        break;
                    case "2008":
                        currentyear = 2008;
                        newdata = which(data, currentyear, currentvar);
                        return quantize(newdata.get(d.id));
                        break;
                    case "2009":
                        currentyear = 2009;
                        newdata = which(data, currentyear, currentvar);
                        return quantize(newdata.get(d.id));
                        break;
                    case "2010":
                        currentyear = 2010;
                        newdata = which(data, currentyear, currentvar);
                        return quantize(newdata.get(d.id));
                        break;
                    case "2011":
                        currentyear = 2011;
                        newdata = which(data, currentyear, currentvar);
                        return quantize(newdata.get(d.id));
                        break;
                    case "2012":
                        currentyear = 2012;
                        newdata = which(data, currentyear, currentvar);
                        return quantize(newdata.get(d.id));
                        break;
                }
            });
    });
});
