// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- wip
// @ts-nocheck
/* eslint-disable consistent-default-export-name/default-export-match-filename -- wip */

const workerFn = async (
  data: NonNullable<ReturnType<typeof useActivities>["data"]>,
  brusselsStreets,
): Promise<GeoJSON.FeatureCollection<GeoJSON.LineString, GeoJSON.GeoJsonProperties> | Error> => {
  importScripts("https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js");
  importScripts("https://cdn.jsdelivr.net/npm/lodash/lodash.min.js");

  /** COPYING FUNCTIONS TO BE PACKAGES IN SERVICE WORKER */

  function polylineToGeojson(str: string, precision?: number) {
    let index = 0;
    let lat: number = 0;
    let lng: number = 0;
    let coordinates: [number, number][] = [];
    let shift = 0;
    let result = 0;
    let byte: number | null = null;
    let latitude_change;
    let longitude_change;
    let factor = Math.pow(10, precision || 5);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {
      // Reset shift, result, and byte
      byte = null;
      shift = 0;
      result = 0;

      do {
        byte = str.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      latitude_change = result & 1 ? ~(result >> 1) : result >> 1;

      shift = result = 0;

      do {
        byte = str.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      longitude_change = result & 1 ? ~(result >> 1) : result >> 1;

      lat += latitude_change;
      lng += longitude_change;

      coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
  }

  function mapRunningPathOnStreets(
    runningPath: GeoJSON.FeatureCollection,
    streets: GeoJSON.FeatureCollection,
    distance: number = 30,
  ): GeoJSON.FeatureCollection {
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

    let ranStreets: GeoJSON.FeatureCollection = {
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

  function createIntermediatePointsInLine(line: GeoJSON.LineString, distance: number): GeoJSON.LineString {
    if (!line.coordinates || line.coordinates.length < 2) return line;
    const lineString = turf.lineString(line.coordinates);
    const length = turf.length(lineString, { units: "meters" });
    const steps = Math.max(Math.floor(length / distance), 2);
    const points: GeoJSON.Position[] = [];
    for (let i = 0; i < steps; i++) {
      const segment = turf.along(lineString, i * distance, { units: "meters" });
      points.push(segment.geometry.coordinates);
    }
    return turf.lineString(points).geometry;
  }

  function createIntermediatePointsInFeature(feature: GeoJSON.Feature, distance: number): GeoJSON.Feature {
    if (feature.geometry.type === "LineString") {
      return turf.feature(createIntermediatePointsInLine(feature.geometry, distance));
    } else if (feature.geometry.type === "MultiLineString") {
      return turf.feature({
        type: "MultiLineString",
        coordinates: feature.geometry.coordinates.map((line) => createIntermediatePointsInLine(turf.lineString(line).geometry, distance).coordinates),
      });
    } else {
      return feature;
    }
  }

  function createIntermediatePointsInFeatureCollection(features: GeoJSON.FeatureCollection, distance: number): GeoJSON.FeatureCollection {
    return {
      type: "FeatureCollection",
      features: features.features.filter((x) => !!x?.geometry).map((feature) => createIntermediatePointsInFeature(feature, distance)),
    };
  }

  /** END OF FUNCTIONS */

  const initial_geojson: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: data.map((activity) => ({
      type: "Feature",
      properties: {
        id: activity.id,
        name: activity.name,
      },
      geometry: {
        type: "LineString",
        coordinates: polylineToGeojson(activity.map.summary_polyline).map(([lng, lat]) => [lat, lng]),
      },
    })),
  };
  try {
    const geojson_with_more_points = createIntermediatePointsInFeatureCollection(initial_geojson, 10);
    const running_streets = mapRunningPathOnStreets(
      geojson_with_more_points,
      createIntermediatePointsInFeatureCollection(brusselsStreets as never, 20),
    );
    return running_streets;
  } catch (e) {
    //to debug in the console
    //return new Error(e.stack);
    return e;
  }
};

export default workerFn;
