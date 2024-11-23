import communes from "../../data/communes.json";
import brusselsStreets from "../../data/brussels_streets.json";
import * as turf from "@turf/turf";
import { LineString } from "geojson";

export type Challenge = {
  name: string;
  percentage: (ranGeojson: GeoJSON.FeatureCollection<GeoJSON.LineString>) => number;
};

const challenges: Challenge[] = [
  ...(communes as GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>).features.map((commune) => ({
    name: `Run in ${commune.properties?.name_fr}`,
    percentage: (ranGeojson: GeoJSON.FeatureCollection<GeoJSON.LineString>) => {
      const all_streets_in_etterbeek = turf.featureCollection(
        (brusselsStreets as GeoJSON.FeatureCollection<LineString | GeoJSON.MultiLineString>).features
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

      const running_streets_in_etterbeek = turf.featureCollection(
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
      return turf.length(running_streets_in_etterbeek) / turf.length(all_streets_in_etterbeek);
    },
  })),
];

export default challenges;
