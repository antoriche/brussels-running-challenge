import _ from "lodash";
import * as turf from "@turf/turf";
import { LineString } from "geojson";

export function mapRunningPathOnStreets(
  runningPath: GeoJSON.FeatureCollection,
  streets: GeoJSON.FeatureCollection,
  distance: number = 30,
): GeoJSON.FeatureCollection<LineString> {
  const run_points = _(runningPath.features)
    .map((street) => street.geometry)
    .map((geometry) => {
      if (geometry?.type === "LineString") {
        return geometry.coordinates;
      } else if (geometry?.type === "MultiLineString") {
        return geometry.coordinates.flat();
      } else {
        return [];
      }
    })
    .flatten()
    .uniqBy(([lon, lat]) => `${lon},${lat}`)
    .value();

  const run_points_keys = _(run_points)
    .groupBy(([lon, lat]) => `${lon.toFixed(3)},${lat.toFixed(3)}`)
    .value();

  let ranStreets: GeoJSON.FeatureCollection<LineString> = {
    type: "FeatureCollection",
    features: [],
  };
  //run_brussels_street_points
  streets.features
    .map((d) => d.geometry)
    .reduce((acc: GeoJSON.Position[][], geometry) => {
      if (geometry?.type === "LineString") {
        acc = [...acc, geometry.coordinates];
      } else if (geometry?.type === "MultiLineString") {
        acc = [...acc, ...geometry.coordinates];
      }
      return acc;
    }, [])
    .forEach((street) => {
      const coordinates = street.map((coord, i) => {
        const nearest_points = run_points_keys[`${coord[0].toFixed(3)},${coord[1].toFixed(3)}`];
        if (!nearest_points) return false;
        const nearest_points_featurecollection = turf.featureCollection(nearest_points.map((coord) => turf.point(coord)));
        const point = turf.point(coord);
        const nearest_point = turf.nearestPoint(point, nearest_points_featurecollection);
        return turf.distance(point, nearest_point, { units: "meters" }) <= distance ? coord : false;
      });

      /* split coordinates between "false" */
      const chunks: GeoJSON.Position[][] = [];
      let chunk: GeoJSON.Position[] = [];
      coordinates.forEach((coord) => {
        if (coord) {
          chunk.push(coord);
        } else {
          //console.log(chunk)
          if (chunk.length > 0) {
            chunks.push(chunk);
            chunk = [];
          }
        }
      });
      if (chunk.length > 0) {
        chunks.push(chunk);
      }

      //coordinates.split(false).forEach
      for (const coordinates of chunks) {
        ranStreets.features.push({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates,
          },
        });
      }
    });
  return ranStreets;
}
