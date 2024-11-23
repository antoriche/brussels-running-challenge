import { useActivities } from "./activities";
import { createIntermediatePointsInFeatureCollection, mapRunningPathOnStreets, polylineToGeojson } from "../services/mapUtils";
import brusselsStreets from "../data/brussels_streets.json";
import { useQuery } from "@tanstack/react-query";

export const useRunPath = () => {
    const { data } = useActivities();

    const { data: runPath } = useQuery({
        queryKey: ["runPath", data],
        queryFn: () => {
            if (!data) return null;
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
            const geojson_with_more_points = createIntermediatePointsInFeatureCollection(initial_geojson, 10);
            const running_streets = mapRunningPathOnStreets(
                geojson_with_more_points,
                createIntermediatePointsInFeatureCollection(brusselsStreets as never, 20),
            );

            return running_streets;
        },
    });
    return runPath ?? null
};
