// function to transform csv to json
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
        namerecord.region = +d.values[0].abv_prov;

        namerecord.resid_price = d.values.map(function(c){ return +c.resid_price; });
        namerecord.resid_area= d.values.map(function(c){ return +c.resid_area; });
        namerecord.housing_price = d.values.map(function(c){ return +c.housing_price; });
        namerecord.salary = d.values.map(function(c){ return +c.each_salary; });
        namerecord.pop = d.values.map(function(c){ return +c.nmzrk; });
        namerecord.CPI = d.values.map(function(c){ return +c.CPI; });
        
        return namerecord;
      });
      
      return json;
}

// animation: choose variable
function which(dataset, year, variable){
    var sub = d3.map();
    dataset.forEach(function(d){
        if (variable=="Residential Land Price"){
        sub.set(d.cityid, f(+d.resid_price[year-2007]/d.CPI[year-2007]*100));}
        else if (variable=="Housing Price"){
        sub.set(d.cityid, f(+d.housing_price[year-2007]/d.CPI[year-2007]*100));}
        else if (variable=="New Land Sales"){
        sub.set(d.cityid,f(+d.resid_area[year-2007]));}
        else if (variable=="Urban Population"){
        sub.set(d.cityid,f(+d.pop[year-2007]));}
        else if (variable=="Salary"){
        sub.set(d.cityid,f(+d.salary[year-2007]/d.CPI[year-2007]*100));}
    });
    return sub;
}

// zoomin: simultaneous map multiple d3.map objects
function map_multiple(d, year){
    d.forEach(function(d){
        eng_name.set(d.cityid, d.city_eng);
        resid_area.set(d.cityid,f(+d.resid_area[year-2007]));
        resid_price.set(d.cityid, f(+d.resid_price[year-2007]/d.CPI[year-2007]*100));
        housing_price.set(d.cityid, f(+d.housing_price[year-2007]/d.CPI[year-2007]*100));
        pop.set(d.cityid,f(+d.pop[year-2007]));
        salary.set(d.cityid,f(+d.salary[year-2007]/d.CPI[year-2007]*100));
    });
}