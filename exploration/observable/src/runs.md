---
theme: dashboard
title: Runs
toc: false
---

# My runs 🏃‍♂️

```js
import * as turf from "npm:@turf/turf"
import 'npm:svg-pan-zoom-container'
```

<!-- Load and transform the data -->

```js
const data = FileAttachment("data/export.csv").csv({typed: true});
  /* Array<{
    latitude: number | null,
    longitude: number | null,
    altitude: number | null,
    timestamp: string,
    heart_rate: number,
    cadence: number,
    speed: number,
    lap: number,
    file: string
  }> */
```

```js
const brussels_streets1 = FileAttachment("data/brussels_streets1.geojson").json();
const brussels_streets2 = FileAttachment("data/brussels_streets2.geojson").json();
```

```js
const brussels_streets = {
  type: "FeatureCollection",
  features: [
    ...brussels_streets1.features,
    ...brussels_streets2.features,
  ]
};
```

```js
// transform points to geojson
const geojson = {
  type: "FeatureCollection",
  features: _(data).groupBy("file").map((points, file) => {
    const coordinates = points.map(d => [d.longitude, d.latitude]).filter(
      ([lon, lat]) => lon != null && lat != null
    );
    return {
    type: "Feature",
    properties: {
      timestamp: points[0].timestamp,
      heart_rate: points[0].heart_rate,
      cadence: points[0].cadence,
      speed: points[0].speed,
      lap: points[0].lap,
      file,
    },
    geometry: {
      type: "LineString",
      coordinates
    },
  }}).value(),
}
```

```js
const run_points = _(geojson.features).map(street => street.geometry).map(geometry => {
  if (geometry?.type === "LineString") {
    return geometry.coordinates
  } else if (geometry?.type === "MultiLineString") {
    return geometry.coordinates.flat()
  } else {
    return []
  }
}).flatten().uniqBy(([lon, lat]) => `${lon},${lat}`).value()

const run_points_keys = _(run_points).groupBy(([lon, lat]) => `${lon.toFixed(3)},${lat.toFixed(3)}`).value()
```
  
```js
run_points
```

```js
run_points_keys
```

```js
const brussels_street_points = _(brussels_streets.features).map(street => street.geometry).map(geometry => {
  if (geometry?.type === "LineString") {
    return geometry.coordinates
  } else if (geometry?.type === "MultiLineString") {
    return geometry.coordinates.flat()
  } else {
    return []
  }
}).flatten().uniqBy(([lon, lat]) => `${lon},${lat}`).sort().value()
```

```js
brussels_street_points
```


```js
//filter points that are less than 10 meters from run_points
//const run_brussels_street_points = brussels_street_points.filter((coord) => 
//  run_points.some((run_coord) => turf.distance(turf.point(coord), turf.point(run_coord)) <= 0.01)
//)

```

```js
let ranStreets = {
    type: "FeatureCollection",
    features: []
};
let missingStreets = {
    type: "FeatureCollection",
    features: []
};
//run_brussels_street_points
brussels_streets.features
  .map(d=>d.geometry)
  .reduce((acc, geometry) => {
    if (geometry?.type === "LineString") {
      acc = [...acc, geometry.coordinates]
    } else if (geometry?.type === "MultiLineString") {
      acc = [...acc, ...geometry.coordinates]
    }
    return acc
  },[])
  .forEach(street => {
    const coordinates = street.map(
      (coord,i) => {
        const nearest_points = run_points_keys[`${coord[0].toFixed(3)},${coord[1].toFixed(3)}`]
        if(!nearest_points) return false
        const nearest_points_featurecollection = turf.featureCollection(nearest_points.map(coord=>(turf.point(coord))))
        const point = turf.point(coord)
        const nearest_point = turf.nearestPoint(point, nearest_points_featurecollection)
        return turf.distance(point, nearest_point, {units: 'kilometers'}) <= 0.05 ? coord : false
      }
    );

    /* split coordinates between "false" */
    const chunks = []
    let chunk = []
    coordinates.forEach(coord => {
      if (coord) {
        chunk.push(coord)
      } else {
        //console.log(chunk)
        if (chunk.length > 0) {
          chunks.push(chunk)
          chunk = []
        }
      }
    })
    if (chunk.length > 0) {
      chunks.push(chunk)
    }
    
    
    //coordinates.split(false).forEach
    for (const coordinates of chunks) {
      ranStreets.features.push({
        type: "Feature",
        //properties: street.properties,
        geometry: {
          type: "LineString",
          coordinates
        }
      });
    }
  });
```


```js
ranStreets
```



```js
const svg = Plot.plot({
  projection: {
    type: "mercator",
    //rotate: [-9, -34],
    domain: brussels_streets,
    //inset: -1000,
  },
  marks: [
    Plot.sphere({fill: "black", stroke: "currentColor"}),
    Plot.graticule({strokeOpacity: 0.3}),
    
    
    Plot.geo(brussels_streets,{
      color: "grey",
      //fill: "red",
      stroke: "lightgrey",
      strokeWidth: 0.3,
      opacity: 0.5,
      //title: d => d.properties.timestamp
    }),

    // Plot.geo(geojson,{
    //   color: "red",
    //   stroke: "red",
    //   strokeWidth: 1,
    //   opacity: 0.3,
    // }),
    Plot.geo(ranStreets,{
      color: "gold",
      stroke: "gold",
      strokeWidth: 0.3,
      //opacity: 0.8,
    }),
    // Plot.dot(brussels_street_points, {
    //   fill: "white",
    //   r: 0.3,
    //   strokeWidth: 0
    // }),
  ],
})
```
<div>
${turf.length(ranStreets, {units: 'kilometers'}).toFixed(0)}
km ran on 
${turf.length(brussels_streets, {units: 'kilometers'}).toFixed(0)}
</div>

<div
  data-zoom-on-wheel
  data-pan-on-drag
>${svg}</div>
