import * as turf from "@turf/turf";

/**
 *
 * @param line the geoline
 * @param distance the minimum distance between two points (in meters)
 * @returns
 */
export function createIntermediatePointsInLine(line: GeoJSON.LineString, distance: number): GeoJSON.LineString {
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

export function createIntermediatePointsInFeature(feature: GeoJSON.Feature, distance: number): GeoJSON.Feature {
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

export function createIntermediatePointsInFeatureCollection(features: GeoJSON.FeatureCollection, distance: number): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: features.features.filter((x) => !!x?.geometry).map((feature) => createIntermediatePointsInFeature(feature, distance)),
  };
}
