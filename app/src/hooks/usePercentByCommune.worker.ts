// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- wip
//@ts-nocheck
/* eslint-disable consistent-default-export-name/default-export-match-filename -- wip */

/*
 * This file is an experiment using web worker. It is executed in a separate thread.
 * It may not import anything from the main thread. Next step would probably be to build the worker with a webpack configuration.
 */

async function worker(
  ranGeojson: GeoJSON.FeatureCollection<GeoJSON.LineString>,
  brusselsStreets: GeoJSON.FeatureCollection<GeoJSON.LineString | GeoJSON.MultiLineString>,
  communes: GeoJSON.FeatureCollection,
): Record<string, number> | Error {
  try {
    importScripts("https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js");
    importScripts("https://cdn.jsdelivr.net/npm/lodash/lodash.min.js");

    function processCommunePercentage(commune) {
      const all_streets_in_commune = turf.featureCollection(
        brusselsStreets.features
          .filter((f) => f.geometry)
          .map(
            (f) =>
              f.geometry && {
                ...f,
                geometry:
                  f.geometry.type === "MultiLineString"
                    ? {
                        ...f.geometry,
                        coordinates: f.geometry.coordinates
                          .map((c) => c.filter(([lng, lat]) => lng && lat && turf.booleanPointInPolygon(turf.point([lng, lat]), commune.geometry)))
                          .filter((c) => c.length > 1),
                      }
                    : {
                        ...f.geometry,
                        coordinates: f.geometry.coordinates.filter(
                          ([lng, lat]) => lng && lat && turf.booleanPointInPolygon(turf.point([lng, lat]), commune.geometry),
                        ),
                      },
              },
          )
          .filter((f) => f.geometry.coordinates.length > 1),
      );

      const running_streets_in_commune = turf.featureCollection(
        ranGeojson.features
          .map((f) => ({
            ...f,
            geometry: {
              ...f.geometry,
              coordinates: f.geometry.coordinates.filter(
                ([lng, lat]) => lng && lat && turf.booleanPointInPolygon(turf.point([lng, lat]), commune.geometry),
              ),
            },
          }))
          .filter((f) => f.geometry.coordinates.length > 1),
      );
      return turf.length(running_streets_in_commune) / turf.length(all_streets_in_commune);
    }

    const ret: Record<string, number> = {};
    for (const commune of communes.features) {
      ret[commune.properties.name_fr] = processCommunePercentage(commune);
    }
    return ret;
  } catch (error) {
    return error;
  }
}

export default worker;
