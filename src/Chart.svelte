<script>
  import { scaleLinear, scaleLog } from 'd3-scale';
  import { drag } from 'd3-drag';
//  import { csv } from 'd3-fetch';
  import { selectAll } from 'd3-selection'
  import { onMount } from 'svelte';
  import { csv } from 'd3-fetch';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function range(n){
    return Array(n).fill().map((_, i) => i);
  }

  $: showTip = function (i) {
    active_hover = i
  }

  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  var sum = function(arr, bools){
    var x = 0
    for (var i = 0; i < arr.length; i++) {
      x = x + arr[i]*(bools[i] ? 1 : 0)
    }
    return x
  }

  export let y;
  export let tmax;
  export let xmax; 
  export let deaths;
  export let total;
  export let vline;
  export let timestep;
  export let total_infected;
  export let N;
  export let ymax;
  export let InterventionTime;
  export let colors; 
  export let log = false;

  const padding = { top: 20, right: 0, bottom: 20, left: 25 };

  let width  = 750;
  let height = 420;

  $: xScale = scaleLinear()
    .domain([0, y.length])
    .range([padding.left, width - padding.right]);

  $: xScaleTime = scaleLinear()
    .domain([0, tmax])
    .range([padding.left, width - padding.right]);

  $: indexToTime = scaleLinear()
    .domain([0, y.length])
    .range([0, tmax])

  $: timeToIndex = scaleLinear()
    .domain([0, tmax])
    .range([0, y.length])

  $: yScale = (log ? scaleLog(): scaleLinear())
    .domain([log ? 1: 0,  ymax/1])
    .range([height - padding.bottom, padding.top]);

  $: yScaleL = scaleLog()
    .domain([1,  ymax/1])
    .range([0, height - padding.bottom - padding.top]);


  $: innerWidth = width - (padding.left + padding.right);
  $: barWidth = innerWidth / y.length - 1.5;
  $: active_hover = -1
  $: lock = false
  var active_lock = 0

  $: active = (function () {
    if (lock){
      var i = Math.round(timeToIndex(active_lock))
      if (i > 99) {
        lock = false
        i = 0
      } else {
        return i
      }
    } else {
      return active_hover
    }
  })()
  export let active;
  export let checked;

  // var data = [[2   , 2  ], [5   , 2  ], [18  , 4  ], [28  , 6  ], [43  , 8  ], [61  , 12 ], [95  , 16 ], [139 , 19 ], [245 , 26 ], [388 , 34 ], [593 , 43 ], [978 , 54 ], [1501, 66 ], [2336, 77 ], [2922, 92 ], [3513, 107], [4747, 124]]
  var data = []



function cases(caseType, country, state) {
    // This function returns cumulative cases based on the John Hopkins University git repository.
    // At present it is possible to specify a country, but not a region.
    // THIS WILL NOT WORK FOR COUNTRIES THAT ARE DIVIDED INTO MULTIPLE REGIONS.

    // Arguments
    // caseType: either "Confirmed", "Deaths", or "Recovered"
    // country: a country
    // state: a province/state. Leave empty if this does not apply, but set it e.g. to "United Kingdom" to get the apropriate data for all of the United Kingdom.

    // url for copy and paste https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv
    
    var path = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-".concat(caseType,  ".csv")

    var totalCases = [];
    csv(path).then(function(data3) {
	data3.forEach(function(d) {
	    if (d["Country/Region"] == country) {
		
		//console.log(d); // this prints the entire country information for the given caseType

		// if no state is given take the first hit
		// else if a state is given make sure it equals the entry in the record.
		if (state.length == 0 ||  d["Province/State"] == state) {

		    var i = 0;
		    //console.log(d["Province/State"]);
		    for (var key in d) {
			if (d.hasOwnProperty(key)) {
			    if (i > 3) {
				totalCases.push(  +d[key] );
    			    }
			    i++;
			}
		    }
		}
	    }
	});
    });
    return totalCases
}

function dailyCases(totalCases) {
    // calculate the daily Cases based on a list of total cases.
    var dailyNew = []
    dailyNew.push(+ totalCases[0]);
    for (var i = 1; i < totalCases.length; i++) {
     	dailyNew.push(totalCases[i] - totalCases[i-1]);
    }
    return dailyNew
}

// for e.g., Germany set country to "Germany" and state to ""
var country = "United Kingdom";
var state = "United Kingdom";

var totalConfirmed = cases("Confirmed", country, state);
var dailyConfirmed = dailyCases(totalConfirmed)

var totalRecovered = cases("Recovered", country, state);
var dailyRecovered = dailyCases(totalRecovered)

var totalDeaths = cases("Deaths", country, state);
var dailyDeaths = dailyCases(totalDeaths)

console.log(totalDeaths);

//}//);
	
</script>

<style>
  h2 {
    text-align: center;
    font-size: 30px;
    font-weight: 300;
    font-family: nyt-franklin,arial,helvetica,sans-serif;
    font-style: normal; 
  }

  .chart {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding-top:30px;
    padding-bottom:10px;
  }

  svg {
    position: relative;
    width: 100%;
    height: 450px;
  }

  .tick {
    font-family: Helvetica, Arial;
    font-size: .725em;
    font-weight: 200;
  }

  .tick line {
    stroke: #e2e2e2;
    stroke-dasharray: 2;
  }

  .tick text {
    fill: #aaa;
    text-anchor: start;
  }

  .tick.tick-0 line {
    stroke-dasharray: 0;
  }

  .intervention line {
    stroke: #555;
    stroke-dasharray: 0;
    stroke-width:12.5;
  }


  .x-axis .tick text {
    text-anchor: middle;
  }

  .bar {
    stroke: none;
    opacity: 0.65
  }

  .total {
    color: #888;
    font-family: Helvetica, Arial;
    font-size: .725em;
    font-weight: 200;
  }


  a.tip span:before{
      content:'';
      display:block;
      width:0;
      height:0;
      position:absolute;

      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-right:8px solid black;
      left:-8px;

      top:7px;
  }

</style>

<div style="width:{width+15}px; height: {height}px; position: relative; top:20px">
  <svg style="position:absolute; height: {height}px">

    <!-- y axis -->
    <g class="axis y-axis" transform="translate(0,{padding.top})">
      {#each yScale.ticks(5) as tick}
        <g class="tick tick-{tick}" transform="translate(0, {yScale(tick) - padding.bottom})">
          <line x2="100%"></line>
          <text y="-4">{Number.isInteger(Math.log10(tick)) ? formatNumber(tick) : (log ? "": formatNumber(tick))}{ (tick == yScale.ticks(5)[0]) ? " ": ""}</text>
        </g>
      {/each}
    </g>

    <!-- x axis -->
    <g class="axis x-axis">
      {#each xScaleTime.ticks() as i}
        <g class="tick" transform="translate({xScaleTime(i)},{height})">
          <text x="0" y="-4">{i == 0 ? "Day ":""}{i}</text>
        </g>
      {/each}
    </g>

    <g class='bars'>
      {#each range(y.length) as i}
        <rect
          on:mouseover={() => showTip(i)}
          on:mouseout={() => showTip(-1)}
          on:click={() => {lock = !lock; active_lock = indexToTime(i) }}
          class="bar"
          x="{xScale(i) + 2}"
          y="{0}"
          width="{barWidth+3}"
          height="{height}"
          style="fill:white; opacity: 0">     
        </rect>
	



        {#each range(colors.length) as j}
          {#if !log}
              <rect
                on:mouseover={() => showTip(i)}
                on:mouseout={() => showTip(-1)}
                on:click={() => {lock = !lock; active_lock = indexToTime(i) }}
                class="bar"
                x="{xScale(i) + 2}"
                y="{yScale( sum(y[i].slice(0,j+1), checked) )}"
                width="{barWidth}"
                height="{Math.max(height - padding.bottom - yScale(y[i][j]*checked[j] ),0)}" 
                style="fill:{colors[j]};
                       opacity:{active == i ? 0.9: 0.6}">     
              </rect>
          {:else}
              <rect
                on:mouseover={() => showTip(i)}
                on:mouseout={() => showTip(-1)}
                on:click={() => {lock = !lock; active_lock = indexToTime(i) }}
                class="bar"
                x="{xScale(i) + 2}"
                y="{(function () { 
                        var z = yScale( sum(y[i].slice(0,j+1), checked) ); 
                        return Math.min(isNaN(z) ? 0: z, height - padding.top)
                      })()  
                    }"
                width="{barWidth}"
                height="{(function () {
                  var top = yScaleL( sum(y[i].slice(0,j+1),checked) + 0.0001 )
                  var btm = yScaleL( sum(y[i].slice(0,j),checked) + 0.0001)
                  var z = top - btm; 
                  if (z + yScale( sum(y[i].slice(0,j+1), checked) ) > height - padding.top) {
                    return top
                  } else {
                    return Math.max(isNaN(z) ? 0 : z,0)
                  }})()}" 
                style="fill:{colors[j]};
                       opacity:{active == i ? 0.9: 0.6}">     
              </rect>
          {/if}
        {/each}

      {/each}
    </g>

<!-- height="{Math.max(height - padding.bottom - yScale(y[i][j]*checked[j] ),0)}" -->

    <g class='bars'>
      {#each range(data.length) as i}
        <rect
          class="bar"
          x="{xScale( i+28 ) + 2}"
          y="{yScale( data[i][1] )}"
          width="{barWidth}"
          height="{height - padding.bottom - yScale( data[i][1] )}"
          style="fill:black; 
                 opacity: 0.5;
                 box-shadow: 4px 10px 5px 2px rgba(0,0,0,0.75);">     
        </rect>
      {/each}
    </g>

  </svg> 

  <div style="position: absolute;width:{width+15}px; height: {height}px; position: absolute; top:0px; left:0px; pointer-events: none">
    
    {#if active >= 0}
      <div style="position:absolute; 
                  pointer-events: none;
                  width:100px;
                  left:{xScale(active)}px;
                  top:{Math.max(yScale(sum(y[active], checked)),0) }px" class="tip"> 
          <!-- {#if lock} <div style="position:absolute; top:-35px; left:-3.5px; font-family: Source Code Pro">🔒</div> {/if} -->
          <svg style="position:absolute; top:-12px; left:0px" height="10" width="10">
          <path 
            d="M 0 0 L 10 0 L 5 10 z"
            fill="{lock ? '#555':'#AAA'}" 
            stroke-width="3" />
          </svg>
      </div>
    {/if}

  </div>

</div>
