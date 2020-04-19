import readerJHU
import numpy as np

from countryinfo import CountryInfo


CD = readerJHU.CovidData()
CD.loadData()

country = CountryInfo()
allCountries = country.all()

countriesOnRecord = ["Argentina", "Brazil", "Czechia", "China", "France", "Germany", "Iran",
                     "Italy", "Pakistan", "Spain", "Sweden", "Switzerland", "Turkey", "United Kingdom", "US"]


countriesOnRecordString = """
countryParameters["Argentina"] = {"All" : createDictionary(17.605, 30, 4, "ar")};
countryParameters["Brazil"] = {"All" : createDictionary(19.15, 28, 5, "br")};
countryParameters["Czechia"] = {"All" : createDictionary(16.18, 29, 3.7, "cz")};
countryParameters["China"] = {"Beijing" : createDictionary(16.885, 0, 3, "cn"),"Hubei" : createDictionary(17.884, 0, 3, "cn")};
countryParameters["France"] = {"All" : createDictionary(18.018, 20, 5, "fr")};
countryParameters["Germany"] = {"All" : createDictionary(18.23, 20, 4.6, "de")};
countryParameters["Iran"] = {"All" : createDictionary(18.21, 18, 5, "ir")};
countryParameters["Italy"] = {"All" : createDictionary(17.917, 0, 4, "it")};
countryParameters["Pakistan"] = {"All" : createDictionary(19.098, 35, 4, "pk")};
countryParameters["Spain"] = {"All" : createDictionary(17.664, 20, 5, "es")};
countryParameters["Sweden"] = {"All" : createDictionary(16.130, 30, 5, "se")};
countryParameters["Switzerland"] = {"All" : createDictionary(15.963, 30, 5, "ch")};
countryParameters["Turkey"] = {"All" : createDictionary(18.2076, 30, 5, "tr")};
countryParameters["United Kingdom"] = {"All" : createDictionary(18.01, 20, 5, "gb")};
countryParameters["US"] = {"All" : createDictionary(19.6, 18, 4.88, "us")};
"""


countriesJHU = CD.getCountries()
print(countriesJHU)

def translateToJHU(name):
    translations = {"United States" : "US", "Czech Repuclic" : "Czechia"}

    if name in translations.keys():
        return translations[name]
    else:
        return name
   
#look up all countries from country info.
for c in sorted(allCountries):
    name = allCountries[c]["name"]
    flag = allCountries[c]["ISO"]["alpha2"]
    try: 
        population = allCountries[c]["population"]
    except:
        population = 1
            
    if translateToJHU(name) in countriesJHU:
        #pass

        
        if translateToJHU(name) in countriesOnRecord:
            ### find the line in the all string
            for line in countriesOnRecordString.split("\n"):
                if translateToJHU(name) in line:
                    print(line)

        else:
            provinces =  CD.getProvinces(translateToJHU(name))

            if len(provinces) == 1:
                #print(name, " ", flag, " ", population)
                print("countryParameters[\"" + name + "\"] = {\"All\"" + " : createDictionary({:.3f}, 30, 4, \"".format(np.log(population)) + flag.lower() + "\")};")
            else:
                pass
                #print("Warning: Multiple Provinces")
            
        
    elif translateToJHU(name) in countriesJHU:
        pass

        

