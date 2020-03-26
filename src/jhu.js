import { csv } from 'd3-fetch';

var basePath = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_"

var pathConfirmed = basePath.concat("confirmed_global.csv")
var pathDeaths = basePath.concat("deaths_global.csv")

    // based on this>
    //console.log("Country: " + country);
    //console.log("Province: " + province);
    
var dataPromise = Promise.all([csv(pathDeaths), csv(pathConfirmed)])

export function aggregatedData(country, province) {
    var returnData = [[],[],[]]; // this stores all the days from github
    var returnData2 = []; // this just stores a subset for plotting

    var k = 0;
    return dataPromise.then(function(files) {
	files.forEach(function(file) {								
	    var totalCases = []
	    file.forEach(function(line) {
		if (line["Country/Region"] == country) {
		    //console.log(d); // this prints the entire country information for the given caseType
		    // if no state is given take the first hit
		    // else if a state is given make sure it equals the entry in the record.
		    
		    if (province.length == 0 ||  line["Province/State"] == state) {
			//console.log(line);
			var i = 0;
			//console.log(d["Province/State"]);
			for (var key in line) {
			    if (line.hasOwnProperty(key)) {
				if (i > 3) {
				    returnData[k].push(  +line[key] );
    				}
				i++;
			    }
			}
		    }
		}
	    })
	    k++;
	})
	return returnData // this is all the data. Now we need to create the 33 item subset
    }).then(function(returnData) {
	var length = returnData[0].length;
	var index = 0;
	for (var i = 0; i < 33; i++) {
	    index = Math.round(i/parseFloat(33)*length);
	    //console.log(index);
	    returnData2.push([returnData[0][index], returnData[1][index]]);
	    //returnData2[1].push(returnData[1][index]);
	    //returnData2[2].push(returnData[2][index]);
	}
	console.log(returnData2.length);
	return returnData2;
    }).catch(function(err) {
	console.log(err);    //handle error
    });
}


export function getFatalitiesToday(country, province) {
    return aggregatedData(country, province).then(function(data) {
        //console.log("Hello from get FAtalities");
	//console.log("Data: " + data.slice(-1)[0][0]);
	return data.slice(-1)[0][0]
								 });
}


export function getConfirmedToday(country, province) {
    return aggregatedData(country, province).then(function(data) {
	return data.slice(-1)[0][1]
								 });
}
