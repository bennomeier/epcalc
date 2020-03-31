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
		

		//if (province.length == 0) {
                //    if (country == "United Kingdom") {
		//	province = "United Kngdom";
		//    }
                //}
		
		if (line["Country/Region"] == country) {
		    //console.log(d); // this prints the entire country information for the given caseType
		    // if no state is given take the first hit
		    // else if a state is given make sure it equals the entry in the record.
		    
		    if (line["Province/State"].length == 0 && (province.length == 0 || province == "All") ||  line["Province/State"] == province) {
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
	//var numberOfEntries = Math.min(200, length);
	
	for (var i = 0; i < length; i++) {
	    //index = Math.round(i/parseFloat(numberOfEntries)*length);
	    //console.log(index);

	    //instead of total confirmed add the dailz confirmed cases
	    var dailyConfirmedTotal = returnData[1][i]
	    var dailyConfirmedNew = returnData[1][i] - returnData[1][Math.max(i - 1, 0)];	    
	    returnData2.push([returnData[0][i], dailyConfirmedNew]);
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
	//console.log("Days: " + data[1]);
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

export function getMaxCases(country, province, shiftDays) {
    return aggregatedData(country, province, shiftDays).then(function(data) {
	var caseData = data;
	//console.log(caseData);
	var allCategories = [];

	for (var i = 0; i < caseData.length; i++) {
	    allCategories.push(caseData[i][0] + caseData[i][1]);
	}
	//console.log("Max all Categories: " + Math.max(...allCategories));
	return Math.max(...allCategories)
    });
}


function createDictionary(logN, dayZero, R0, flag) {

    //var n = Date.now();
    var now = new Date();
    //console.log("Full Year: " + now.getFullYear());
    var start = new Date(2020, 0, 22); // jhu data start on 2020, January, 22
    var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    //console.log('Day of year: ' + day);
    var InterventionTime = day - dayZero;

    
    // how many days have passed between today and day Zero of the jhu dataset?
    return {"logN" : logN, "dayZero": dayZero, "R0": R0, "InterventionTime": InterventionTime, "flag": flag}
}

var countryParameters = {}
countryParameters["Germany"] = {"All" : createDictionary(18.23, 20, 4.6, "de")};
countryParameters["Czechia"] = {"All" : createDictionary(16.18, 29, 3.7, "cz")};
countryParameters["Brazil"] = {"All" : createDictionary(19.15, 28, 5, "br")};
countryParameters["US"] = {"All" : createDictionary(19.6, 18, 4.88, "us")};
countryParameters["Iran"] = {"All" : createDictionary(18.21, 18, 5, "ir")};
countryParameters["Italy"] = {"All" : createDictionary(17.917, 0, 4, "it")};
countryParameters["United Kingdom"] = {"All" : createDictionary(18.01, 20, 5, "gb")};
countryParameters["France"] = {"All" : createDictionary(18.018, 20, 5, "fr")};
countryParameters["Turkey"] = {"All" : createDictionary(18.2076, 30, 5, "tr")};
countryParameters["Sweden"] = {"All" : createDictionary(16.130, 30, 5, "se")};
countryParameters["China"] = {"Hubei" : createDictionary(17.884, 0, 3, "cn")};


//countryParameters["US"] = {"All" : createDictionary(19.6, 28, 5)};

export function getDateFromDayZero(dayZero) {
    var start = Date(2020, 0, 22); // jhu data start on 2020, January, 22

    var outbreak = new Date(2020, 0, 22); // initializes the outbreak to today. 
    outbreak.setDate(outbreak.getDate() + dayZero);
    return outbreak.toLocaleDateString()
}

export function getCountryParameters(country, province, parameter) {
    return countryParameters[country][province ? province : "All"][parameter] 
}

export function checkCountryListed(country, province) {
    return country in countryParameters
}
