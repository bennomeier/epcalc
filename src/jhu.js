import { csv } from 'd3-fetch';

var basePath = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_"

var pathConfirmed = basePath.concat("confirmed_global.csv")
var pathDeaths = basePath.concat("deaths_global.csv")

    // based on this>
    //console.log("Country: " + country);
    //console.log("Province: " + province);
    
var dataPromise = Promise.all([csv(pathDeaths), csv(pathConfirmed)])

var days = 0;


function getData(country, province, shiftDays) {
    var returnData = [[],[],[]]; // this stores all the days from github
    var returnData2 = []; // this just stores a subset for plotting
    var days = 0;
    var k = 0;
    return dataPromise.then(function(files) {
	files.forEach(function(file) {								
	    var totalCases = []
	    file.forEach(function(line) {
		if (line["Country/Region"] == country) {
		    //console.log(d); // this prints the entire country information for the given caseType
		    // if no state is given take the first hit
		    // else if a state is given make sure it equals the entry in the record.
		    
		    if (province.length == 0 ||  line["Province/State"] == province) {
			//console.log(line);
			var i = 0;
			days = 0;
			//console.log(d["Province/State"]);
			for (var key in line) {
			    if (line.hasOwnProperty(key)) {
				if (i > 3 + shiftDays) {
				    returnData[k].push(  +line[key] );
				    days++;
    				}
				i++;
			    }
			}
		    }
		}
	    })
	    k++;
	})
	return [returnData, days] // this is all the data. Now we need to create the 33 item subset
    });
}



export function aggregatedData(country, province, shiftDays) {
    return getData(country, province, shiftDays).then(function(countryData) {
	var returnData = countryData[0]
	var returnData2 = [];
	var length = returnData[0].length;
	var index = 0;

	// it may be is better here to just send out all the days.
	// and leave the refactoring to the Chart part of the  App
	var numberOfEntries = Math.min(200, length);
	
	for (var i = 0; i < numberOfEntries; i++) {
	    index = Math.round(i/parseFloat(numberOfEntries)*length);
	    //console.log(index);
	    returnData2.push([returnData[0][index], returnData[1][index]]);
	}
	//console.log("returnData2: " + returnData2);
	//console.log("length of abvoe: " + returnData2.length);
	return returnData2;
    }).catch(function(err) {
	console.log(err);    //handle error
    });
}

export function getDays(country, province, shiftDays) {
    return getData(country, province, shiftDays).then(function(data) {
	console.log("Days: " + data[1]);
	return data[1]
    });
}


export function getFatalitiesToday(country, province, shiftDays) {
    return aggregatedData(country, province, shiftDays).then(function(data) {
        //console.log("Hello from get FAtalities");
	//console.log("Fatalities: " + data.slice(-1)[0][0]);
	return data.slice(-1)[0][0]
								 });
}


export function getConfirmedToday(country, province, shiftDays) {
    return aggregatedData(country, province, shiftDays).then(function(data) {
	return data.slice(-1)[0][1]
								 });
}
