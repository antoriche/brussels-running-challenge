import { useQuery } from "@tanstack/react-query";
import communes from "../data/communes.json";
import brusselsStreets from "../data/brussels_streets.json";
import { useWorker } from "@koale/useworker";
import percentByCommuneWorker from "./usePercentByCommune.worker";

export const usePercentByCommune = (ranGeojson: GeoJSON.FeatureCollection<GeoJSON.LineString> | null) => {
  const [worker, workerController] = useWorker(percentByCommuneWorker, {});

  return useQuery({
    queryKey: ["percentByCommune", ranGeojson],
    queryFn: async () => {
      if (!ranGeojson) return {};
      await workerController.kill();
      const percentByCommune = await worker(ranGeojson, brusselsStreets as never, communes as never);
      if (percentByCommune instanceof Error) {
        console.error(percentByCommune);
        throw percentByCommune;
      }
      return percentByCommune;
    },
  });
};
