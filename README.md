# EPCALC Fork

This is a fork of @gabgoh's epcalc epidemic calculator that shows country-specific up to date real world Deaths and Confirmed Cases as listed by the Johns Hopkins University Github Repository https://github.com/CSSEGISandData .

*Update 2020/03/26: Reorganization of the code. A jhu.js module now loads the JHU data. For the past it is possible to plot the JHU data, the simulation, or both. Some country data are shown in the plot. For simple countries (no regions), the country can be passed to the app as a country argument, e.g. url.github.io/ . At present the logarithm of the population size should be passed as well, i.e.
index.html?logN=15&country=Czechia

The compiled App is now in a docs folder, and can be accessed at https://bennomeier.github.io/epcalc/index.html

To get information for a specific, JHU listed country use, e.g., https://bennomeier.github.io/epcalc/index.html?country=Czechia&logN=16.18

*Update 2020/03/25: Update for new JHU data format. Real-time JHU Data for Deaths and Confirmed are now shown in the plot for a hard-coded country. 

*Update 2020/03/24: Asynchronous import of the github data using d3-fetch is now implemented, and work has begun on the svelte code that draws the data.*

---


The objective of this project is to include Johns Hopkins University real-time data of the pandemic.

These data may be supplemented in the future with country specific information such as population sizes, and descriptive rates.

The faint hope is that a simulation that projects the current data into the future may facilitate a stronger, faster response to the pandemic.

The simulation uses a simple SEIR model.

Now is not the time to question this model or that model, now is the time to accept the simple dynamics of the pandemic and act.

Please feel free to reuse the code in this repository in whichever way you like.

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
