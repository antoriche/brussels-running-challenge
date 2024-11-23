import { useActivities } from "./activities";
import { createIntermediatePointsInFeatureCollection, mapRunningPathOnStreets, polylineToGeojson } from "../services/mapUtils";
import brusselsStreets from "../data/brussels_streets.json";
import { useQuery } from "@tanstack/react-query";
import { useWorker } from "@koale/useworker";

const workerFn = async (
  data: NonNullable<ReturnType<typeof useActivities>["data"]>,
  brusselsStreets,
  {
    createIntermediatePointsInFeatureCollection_,
    mapRunningPathOnStreets_,
    polylineToGeojson_,
  }: {
    createIntermediatePointsInFeatureCollection_: typeof createIntermediatePointsInFeatureCollection;
    mapRunningPathOnStreets_: typeof mapRunningPathOnStreets;
    polylineToGeojson_: typeof polylineToGeojson;
  },
) => {
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
        coordinates: polylineToGeojson_(activity.map.summary_polyline).map(([lng, lat]) => [lat, lng]),
      },
    })),
  };
  const geojson_with_more_points = createIntermediatePointsInFeatureCollection_(initial_geojson, 10);
  const running_streets = mapRunningPathOnStreets_(
    geojson_with_more_points,
    createIntermediatePointsInFeatureCollection_(brusselsStreets as never, 20),
  );

  return running_streets;
};

export const useRunPath = () => {
  const { data } = useActivities();

  const [worker, workerController] = useWorker(workerFn, {});

  const { data: runPath } = useQuery({
    queryKey: ["runPath", data],
    queryFn: async () => {
      if (!data) return null;
      console.log("navigator", navigator.serviceWorker);
      console.log("workerController.status", workerController.status);
      await workerController.kill();
      console.log("queryFn", data);
      const d = await worker(data, brusselsStreets, {
        createIntermediatePointsInFeatureCollection_: createIntermediatePointsInFeatureCollection,
        mapRunningPathOnStreets_: mapRunningPathOnStreets,
        polylineToGeojson_: polylineToGeojson,
      });
      console.log("result", d);
      return d;
    },
  });
  return runPath ?? null;
};
