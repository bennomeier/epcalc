# EPCALC Fork

This is a fork of @gabgoh's epcalc epidemic calculator that shows country-specific up to date real world Deaths and Confirmed Cases as listed by the Johns Hopkins University Github Repository https://github.com/CSSEGISandData .

* Update 2020/03/30: Plot daily increase in the number of confirmed cases, update documentation.

* Update 2020/03/29: The documentation and the color scheme have been updated.


* Update 2020/03/28: The usage of the calculator has been simplified for a few countries. Simply pass the country as an argument, e.g.

https://bennomeier.github.io/epcalc/index.html?country=US

and the app will try to look up population size and day of outbreak.

For now the countries that support this feature are

- Germany
- Czechia
- Brazil
- US
- Iran
- Italy
- United Kingdom
- France

For countries with regions it is possible to specify the region, but right now only the combination China/Hubei is supported:
https://bennomeier.github.io/epcalc/index.html?country=US




* Old Updates

** Update 2020/03/27 - 2: xAxis and yAxis scaling fixed. Control for Time Shift has been added.
At the moment an instructional and freightening example is Brazil:

https://bennomeier.github.io/epcalc/index.html?country=Brazil&logN=19.15&dayZero=28&R0=5&InterventionAmt=1&InterventionTime=36

A strategy selection menu has been added that will set the future R value. This is not functional yet. 



** Update 2020/03/27 - 1: Time Shift for Countries*

For simple countries (regions are not supported yet), the country can be passed to the app as a country argument.

At present the logarithm of the population size should be passed as well.

dayZero is a further optional argument that corresponds to the delay between the beginning of JHU data (January 22nd, 2020) and the effective beginning of the outbreak in the specified country.

The compiled App can be accessed at https://bennomeier.github.io/epcalc/index.html

To get information for a specific JHU listed country use, e.g.,

https://bennomeier.github.io/epcalc/index.html?country=US&logN=19.6&dayZero=28

https://bennomeier.github.io/epcalc/index.html?country=Brazil&logN=19.15&dayZero=28

https://bennomeier.github.io/epcalc/index.html?country=Germany&logN=18.231&dayZero=29

https://bennomeier.github.io/epcalc/index.html?country=Czechia&logN=16.18&dayZero=37

The next update will see further bugfixes.

** Update 2020/03/26: Reorganization of the code. A jhu.js module now loads the JHU data. For the past it is possible to plot the JHU data, the simulation, or both. *

** Update 2020/03/25: Update for new JHU data format. Real-time JHU Data for Deaths and Confirmed are now shown in the plot for a hard-coded country. *

** Update 2020/03/24: Asynchronous import of the github data using d3-fetch is now implemented, and work has begun on the svelte code that draws the data.*

---


The objective of this project is to include Johns Hopkins University real-time data of the pandemic.

These data may be supplemented in the future with country specific information such as population sizes, and descriptive rates.

The faint hope is that a simulation that projects the current data into the future may facilitate a stronger, faster response to the pandemic.

The simulation uses a simple SEIR model as implemented by Gabgoh.

---

# svelte app

This is a project template for [Svelte](https://svelte.dev) apps. It lives at https://github.com/sveltejs/template.

To create a new project based on this template using [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit sveltejs/template svelte-app
cd svelte-app
```

*Note that you will need to have [Node.js](https://nodejs.org) installed.*


## Get started

Install the dependencies...

```bash
cd svelte-app
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.


## Deploying to the web

### With [now](https://zeit.co/now)

Install `now` if you haven't already:

```bash
npm install -g now
```

Then, from within your project folder:

```bash
cd public
now
```

As an alternative, use the [Now desktop client](https://zeit.co/download) and simply drag the unzipped project folder to the taskbar icon.

### With [surge](https://surge.sh/)

Install `surge` if you haven't already:

```bash
npm install -g surge
```

Then, from within your project folder:

```bash
npm run build
surge public
```
