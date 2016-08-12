// function to transform csv to json
function csv2json(csv){ 
      var nested = d3.nest()
        .key(function(d){ return d.cityid; })
        .entries(csv)
      var p=d3.precisionFixed(0.5); f=d3.format("." + p + "f"); 

      var json = nested.map(function(d){
        var namerecord = {};
        namerecord.cityid = d.key; 
        namerecord.city = d.values[0].city;
        namerecord.province = d.values[0].province;
        namerecord.city_eng = d.values[0].city_eng;
        namerecord.region = +d.values[0].abv_prov;

        namerecord.resid_price = d.values.map(function(c){ return f(+c.resid_price/c.CPI*100);});
        namerecord.resid_area= d.values.map(function(c){ return f(+c.resid_area);});
        namerecord.housing_price = d.values.map(function(c){ return f(+c.housing_price/c.CPI*100);});
        namerecord.salary = d.values.map(function(c){ return f(+c.each_salary/c.CPI*100);});
        namerecord.pop = d.values.map(function(c){ return +c.nmzrk; });
        namerecord.year = d.values.map(function(c){ return +c.year});
        
        return namerecord;
      });
      
      return json;
}

// function to transform csv to json
function csv2json_scatter(csv){ 
      var nested = d3.nest()
        .key(function(d){ return d.cityid; })
        .entries(csv)

      var p=d3.precisionFixed(0.5); f=d3.format("." + p + "f"); 

      var json = nested.map(function(d){
        var namerecord = {};
        namerecord.cityid = d.key; 
        namerecord.city = d.values[0].city;
        namerecord.province = d.values[0].province;
        namerecord.city_eng = d.values[0].city_eng;
        namerecord.region = +d.values[0].abv_prov;

        namerecord.resid_price = d.values.map(function(c){ return {year: c.year, value: f(+c.resid_price/c.CPI*100)}; });
        namerecord.housing_price = d.values.map(function(c){ return {year: c.year, value: f(+c.housing_price/c.CPI*100)}; });
        namerecord.pop = d.values.map(function(c){ return {year: c.year, value: f(+c.nmzrk)}; }); 
        namerecord.resid_area= d.values.map(function(c){ return {year: c.year, value: f(+c.resid_area)}; });

        // per capita var
        namerecord.salary = d.values.map(function(c){ return {year: c.year, value: f(+c.each_salary/c.CPI*100)}; });
        namerecord.per_resid_area= d.values.map(function(c){ return {year: c.year, value: f(+c.resid_area/c.nmzrk)}; });
        namerecord.per_ind_area = d.values.map(function(c){ return {year: c.year, value: f(+c.ind_area/c.nmzrk)}; });
        namerecord.per_houseinvest_re = d.values.map(function(c){ return {year: c.year, value: f(+c.houseinvest_re/c.CPI*100/c.nmzrk)}; });

        return namerecord;
      });
      
      return json;
}

// animation: navigate among variables
function which(dataset, year, variable){
    var sub = d3.map();
    dataset.forEach(function(d){
        if (variable=="Residential Land Price"){
        sub.set(d.cityid, +d.resid_price[year-2007]);}
        else if (variable=="Housing Price"){
        sub.set(d.cityid, +d.housing_price[year-2007]);}
        else if (variable=="New Land Sales"){
        sub.set(d.cityid,+d.resid_area[year-2007]);}
        else if (variable=="Urban Population"){
        sub.set(d.cityid,+d.pop[year-2007]);}
        else if (variable=="Salary"){
        sub.set(d.cityid,+d.salary[year-2007]);}
    });
    return sub;
}