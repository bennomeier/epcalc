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

		//var myCountry = checkCountryListed(country, province) ? country : "US";
		//var myProvince = checkCountryListed(country, province) ? province : "All";

		//console.log("myProvince", myProvince);
		
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

export var countryParameters = {}
countryParameters["Afghanistan"] = {"All" : createDictionary(17.074, 30, 4, "af")};
countryParameters["Albania"] = {"All" : createDictionary(14.879, 30, 4, "al")};
countryParameters["Algeria"] = {"All" : createDictionary(17.471, 30, 4, "dz")};
countryParameters["Angola"] = {"All" : createDictionary(17.009, 30, 4, "ao")};
countryParameters["Antigua and Barbuda"] = {"All" : createDictionary(11.366, 30, 4, "ag")};
countryParameters["Argentina"] = {"All" : createDictionary(17.605, 30, 4, "ar")};
countryParameters["Armenia"] = {"All" : createDictionary(14.917, 30, 4, "am")};
countryParameters["Austria"] = {"All" : createDictionary(15.959, 30, 4, "at")};
countryParameters["Azerbaijan"] = {"All" : createDictionary(16.072, 30, 4, "az")};
countryParameters["Bahrain"] = {"All" : createDictionary(14.090, 30, 4, "bh")};
countryParameters["Bangladesh"] = {"All" : createDictionary(18.875, 30, 4, "bd")};
countryParameters["Barbados"] = {"All" : createDictionary(12.560, 30, 4, "bb")};
countryParameters["Belarus"] = {"All" : createDictionary(16.064, 30, 4, "by")};
countryParameters["Belgium"] = {"All" : createDictionary(16.234, 30, 4, "be")};
countryParameters["Belize"] = {"All" : createDictionary(12.765, 30, 4, "bz")};
countryParameters["Benin"] = {"All" : createDictionary(16.117, 30, 4, "bj")};
countryParameters["Bhutan"] = {"All" : createDictionary(13.535, 30, 4, "bt")};
countryParameters["Bolivia"] = {"All" : createDictionary(16.121, 30, 4, "bo")};
countryParameters["Bosnia and Herzegovina"] = {"All" : createDictionary(15.148, 30, 4, "ba")};
countryParameters["Botswana"] = {"All" : createDictionary(14.521, 30, 4, "bw")};
countryParameters["Brazil"] = {"All" : createDictionary(19.15, 28, 5, "br")};
countryParameters["Brunei"] = {"All" : createDictionary(12.883, 30, 4, "bn")};
countryParameters["Bulgaria"] = {"All" : createDictionary(15.796, 30, 4, "bg")};
countryParameters["Burkina Faso"] = {"All" : createDictionary(16.668, 30, 4, "bf")};
countryParameters["Burundi"] = {"All" : createDictionary(16.070, 30, 4, "bi")};
countryParameters["Cambodia"] = {"All" : createDictionary(16.536, 30, 4, "kh")};
countryParameters["Cameroon"] = {"All" : createDictionary(16.830, 30, 4, "cm")};
countryParameters["Central African Republic"] = {"All" : createDictionary(15.365, 30, 4, "cf")};
countryParameters["Chad"] = {"All" : createDictionary(16.397, 30, 4, "td")};
countryParameters["Chile"] = {"All" : createDictionary(16.696, 30, 4, "cl")};
countryParameters["China"] = {"Beijing" : createDictionary(16.885, 0, 3, "cn"),"Hubei" : createDictionary(17.884, 0, 3, "cn")};
countryParameters["Colombia"] = {"All" : createDictionary(17.685, 30, 4, "co")};
countryParameters["Costa Rica"] = {"All" : createDictionary(15.366, 30, 4, "cr")};
countryParameters["Croatia"] = {"All" : createDictionary(15.267, 30, 4, "hr")};
countryParameters["Cuba"] = {"All" : createDictionary(16.232, 30, 4, "cu")};
countryParameters["Cyprus"] = {"All" : createDictionary(13.662, 30, 4, "cy")};
countryParameters["Djibouti"] = {"All" : createDictionary(13.694, 30, 4, "dj")};
countryParameters["Dominica"] = {"All" : createDictionary(11.175, 30, 4, "dm")};
countryParameters["Dominican Republic"] = {"All" : createDictionary(16.155, 30, 4, "do")};
countryParameters["Ecuador"] = {"All" : createDictionary(16.581, 30, 4, "ec")};
countryParameters["Egypt"] = {"All" : createDictionary(18.289, 30, 4, "eg")};
countryParameters["El Salvador"] = {"All" : createDictionary(15.672, 30, 4, "sv")};
countryParameters["Equatorial Guinea"] = {"All" : createDictionary(14.173, 30, 4, "gq")};
countryParameters["Eritrea"] = {"All" : createDictionary(15.693, 30, 4, "er")};
countryParameters["Estonia"] = {"All" : createDictionary(14.090, 30, 4, "ee")};
countryParameters["Ethiopia"] = {"All" : createDictionary(18.292, 30, 4, "et")};
countryParameters["Fiji"] = {"All" : createDictionary(13.664, 30, 4, "fj")};
countryParameters["Finland"] = {"All" : createDictionary(15.515, 30, 4, "fi")};
countryParameters["France"] = {"All" : createDictionary(18.018, 20, 5, "fr")};
countryParameters["Gabon"] = {"All" : createDictionary(14.353, 30, 4, "ga")};
countryParameters["Georgia"] = {"All" : createDictionary(15.317, 30, 4, "ge")};
countryParameters["Germany"] = {"All" : createDictionary(18.23, 20, 4.6, "de")};
countryParameters["Ghana"] = {"All" : createDictionary(17.113, 30, 4, "gh")};
countryParameters["Greece"] = {"All" : createDictionary(16.213, 30, 4, "gr")};
countryParameters["Grenada"] = {"All" : createDictionary(11.546, 30, 4, "gd")};
countryParameters["Guatemala"] = {"All" : createDictionary(16.576, 30, 4, "gt")};
countryParameters["Guinea"] = {"All" : createDictionary(16.179, 30, 4, "gn")};
countryParameters["Guinea-Bissau"] = {"All" : createDictionary(14.373, 30, 4, "gw")};
countryParameters["Guyana"] = {"All" : createDictionary(13.573, 30, 4, "gy")};
countryParameters["Haiti"] = {"All" : createDictionary(16.190, 30, 4, "ht")};
countryParameters["Honduras"] = {"All" : createDictionary(15.982, 30, 4, "hn")};
countryParameters["Hungary"] = {"All" : createDictionary(16.106, 30, 4, "hu")};
countryParameters["Iceland"] = {"All" : createDictionary(12.701, 30, 4, "is")};
countryParameters["India"] = {"All" : createDictionary(20.957, 30, 4, "in")};
countryParameters["Indonesia"] = {"All" : createDictionary(19.346, 30, 4, "id")};
countryParameters["Iran"] = {"All" : createDictionary(18.21, 18, 5, "ir")};
countryParameters["Iraq"] = {"All" : createDictionary(17.399, 30, 4, "iq")};
countryParameters["Ireland"] = {"All" : createDictionary(15.668, 30, 4, "ie")};
countryParameters["Israel"] = {"All" : createDictionary(15.928, 30, 4, "il")};
countryParameters["Italy"] = {"All" : createDictionary(17.917, 0, 4, "it")};
countryParameters["Jamaica"] = {"All" : createDictionary(14.815, 30, 4, "jm")};
countryParameters["Japan"] = {"All" : createDictionary(18.660, 30, 4, "jp")};
countryParameters["Jordan"] = {"All" : createDictionary(15.713, 30, 4, "jo")};
countryParameters["Kazakhstan"] = {"All" : createDictionary(16.671, 30, 4, "kz")};
countryParameters["Kenya"] = {"All" : createDictionary(17.548, 30, 4, "ke")};
countryParameters["Kuwait"] = {"All" : createDictionary(15.000, 30, 4, "kw")};
countryParameters["Kyrgyzstan"] = {"All" : createDictionary(15.569, 30, 4, "kg")};
countryParameters["Laos"] = {"All" : createDictionary(15.717, 30, 4, "la")};
countryParameters["Latvia"] = {"All" : createDictionary(14.505, 30, 4, "lv")};
countryParameters["Lebanon"] = {"All" : createDictionary(15.227, 30, 4, "lb")};
countryParameters["Liberia"] = {"All" : createDictionary(15.296, 30, 4, "lr")};
countryParameters["Libya"] = {"All" : createDictionary(15.649, 30, 4, "ly")};
countryParameters["Liechtenstein"] = {"All" : createDictionary(10.522, 30, 4, "li")};
countryParameters["Lithuania"] = {"All" : createDictionary(14.890, 30, 4, "lt")};
countryParameters["Luxembourg"] = {"All" : createDictionary(13.217, 30, 4, "lu")};
countryParameters["Madagascar"] = {"All" : createDictionary(16.899, 30, 4, "mg")};
countryParameters["Malawi"] = {"All" : createDictionary(16.576, 30, 4, "mw")};
countryParameters["Malaysia"] = {"All" : createDictionary(17.231, 30, 4, "my")};
countryParameters["Maldives"] = {"All" : createDictionary(12.740, 30, 4, "mv")};
countryParameters["Mali"] = {"All" : createDictionary(16.573, 30, 4, "ml")};
countryParameters["Malta"] = {"All" : createDictionary(12.939, 30, 4, "mt")};
countryParameters["Mauritania"] = {"All" : createDictionary(15.081, 30, 4, "mr")};
countryParameters["Mauritius"] = {"All" : createDictionary(14.048, 30, 4, "mu")};
countryParameters["Mexico"] = {"All" : createDictionary(18.601, 30, 4, "mx")};
countryParameters["Moldova"] = {"All" : createDictionary(15.085, 30, 4, "md")};
countryParameters["Monaco"] = {"All" : createDictionary(10.517, 30, 4, "mc")};
countryParameters["Mongolia"] = {"All" : createDictionary(14.910, 30, 4, "mn")};
countryParameters["Morocco"] = {"All" : createDictionary(17.326, 30, 4, "ma")};
countryParameters["Mozambique"] = {"All" : createDictionary(17.036, 30, 4, "mz")};
countryParameters["Namibia"] = {"All" : createDictionary(14.564, 30, 4, "na")};
countryParameters["Nepal"] = {"All" : createDictionary(17.135, 30, 4, "np")};
countryParameters["New Zealand"] = {"All" : createDictionary(15.330, 30, 4, "nz")};
countryParameters["Nicaragua"] = {"All" : createDictionary(15.629, 30, 4, "ni")};
countryParameters["Niger"] = {"All" : createDictionary(16.657, 30, 4, "ne")};
countryParameters["Nigeria"] = {"All" : createDictionary(19.000, 30, 4, "ng")};
countryParameters["Norway"] = {"All" : createDictionary(15.456, 30, 4, "no")};
countryParameters["Oman"] = {"All" : createDictionary(15.224, 30, 4, "om")};
countryParameters["Pakistan"] = {"All" : createDictionary(19.098, 35, 4, "pk")};
countryParameters["Panama"] = {"All" : createDictionary(15.127, 30, 4, "pa")};
countryParameters["Papua New Guinea"] = {"All" : createDictionary(15.817, 30, 4, "pg")};
countryParameters["Paraguay"] = {"All" : createDictionary(15.746, 30, 4, "py")};
countryParameters["Peru"] = {"All" : createDictionary(17.243, 30, 4, "pe")};
countryParameters["Philippines"] = {"All" : createDictionary(18.428, 30, 4, "ph")};
countryParameters["Poland"] = {"All" : createDictionary(17.466, 30, 4, "pl")};
countryParameters["Portugal"] = {"All" : createDictionary(16.165, 30, 4, "pt")};
countryParameters["Qatar"] = {"All" : createDictionary(14.635, 30, 4, "qa")};
countryParameters["Romania"] = {"All" : createDictionary(16.808, 30, 4, "ro")};
countryParameters["Russia"] = {"All" : createDictionary(18.801, 30, 4, "ru")};
countryParameters["Rwanda"] = {"All" : createDictionary(16.213, 30, 4, "rw")};
countryParameters["Saint Kitts and Nevis"] = {"All" : createDictionary(10.915, 30, 4, "kn")};
countryParameters["Saint Lucia"] = {"All" : createDictionary(12.123, 30, 4, "lc")};
countryParameters["Saint Vincent and the Grenadines"] = {"All" : createDictionary(11.599, 30, 4, "vc")};
countryParameters["San Marino"] = {"All" : createDictionary(10.396, 30, 4, "sm")};
countryParameters["Saudi Arabia"] = {"All" : createDictionary(17.242, 30, 4, "sa")};
countryParameters["Senegal"] = {"All" : createDictionary(16.419, 30, 4, "sn")};
countryParameters["Seychelles"] = {"All" : createDictionary(11.407, 30, 4, "sc")};
countryParameters["Sierra Leone"] = {"All" : createDictionary(15.641, 30, 4, "sl")};
countryParameters["Singapore"] = {"All" : createDictionary(15.515, 30, 4, "sg")};
countryParameters["Slovakia"] = {"All" : createDictionary(15.505, 30, 4, "sk")};
countryParameters["Slovenia"] = {"All" : createDictionary(14.541, 30, 4, "si")};
countryParameters["Somalia"] = {"All" : createDictionary(16.196, 30, 4, "so")};
countryParameters["South Africa"] = {"All" : createDictionary(17.805, 30, 4, "za")};
countryParameters["South Sudan"] = {"All" : createDictionary(16.248, 30, 4, "ss")};
countryParameters["Spain"] = {"All" : createDictionary(17.664, 20, 5, "es")};
countryParameters["Sri Lanka"] = {"All" : createDictionary(16.825, 30, 4, "lk")};
countryParameters["Sudan"] = {"All" : createDictionary(17.434, 30, 4, "sd")};
countryParameters["Suriname"] = {"All" : createDictionary(13.189, 30, 4, "sr")};
countryParameters["Sweden"] = {"All" : createDictionary(16.130, 30, 5, "se")};
countryParameters["Switzerland"] = {"All" : createDictionary(15.963, 30, 5, "ch")};
countryParameters["Syria"] = {"All" : createDictionary(16.949, 30, 4, "sy")};
countryParameters["Tanzania"] = {"All" : createDictionary(17.675, 30, 4, "tz")};
countryParameters["Thailand"] = {"All" : createDictionary(17.988, 30, 4, "th")};
countryParameters["Togo"] = {"All" : createDictionary(15.760, 30, 4, "tg")};
countryParameters["Trinidad and Tobago"] = {"All" : createDictionary(14.099, 30, 4, "tt")};
countryParameters["Tunisia"] = {"All" : createDictionary(16.212, 30, 4, "tn")};
countryParameters["Turkey"] = {"All" : createDictionary(18.2076, 30, 5, "tr")};
countryParameters["Uganda"] = {"All" : createDictionary(17.367, 30, 4, "ug")};
countryParameters["Ukraine"] = {"All" : createDictionary(17.576, 30, 4, "ua")};
countryParameters["United Arab Emirates"] = {"All" : createDictionary(16.061, 30, 4, "ae")};
countryParameters["United Kingdom"] = {"All" : createDictionary(18.01, 20, 5, "gb")};
countryParameters["US"] = {"All" : createDictionary(19.6, 18, 4.88, "us")};
countryParameters["Uruguay"] = {"All" : createDictionary(15.041, 30, 4, "uy")};
countryParameters["Uzbekistan"] = {"All" : createDictionary(17.233, 30, 4, "uz")};
countryParameters["Venezuela"] = {"All" : createDictionary(17.224, 30, 4, "ve")};
countryParameters["Vietnam"] = {"All" : createDictionary(18.312, 30, 4, "vn")};
countryParameters["Western Sahara"] = {"All" : createDictionary(13.281, 30, 4, "eh")};
countryParameters["Yemen"] = {"All" : createDictionary(17.072, 30, 4, "ye")};
countryParameters["Zambia"] = {"All" : createDictionary(16.525, 30, 4, "zm")};
countryParameters["Zimbabwe"] = {"All" : createDictionary(16.385, 30, 4, "zw")};


//countryParameters["US"] = {"All" : createDictionary(19.6, 28, 5)};

export function getDateFromDayZero(dayZero) {
    var start = Date(2020, 0, 22); // jhu data start on 2020, January, 22

    var outbreak = new Date(2020, 0, 22); // initializes the outbreak to today. 
    outbreak.setDate(outbreak.getDate() + dayZero);
    return outbreak.toLocaleDateString()
}

export function getCountryParameters(country, province, parameter) {	
    if (checkCountryListed(country, province)) {
	// console.log("Country Here: ", country);
	// console.log("Province Here: ", province);
	return countryParameters[country][province ? province : "All"][parameter]
    } else {
	return None
    }
}

export function checkCountryListed(country, province) {
    return country in countryParameters
}
