import { useActivities } from "./activities";
import { useQuery } from "@tanstack/react-query";
import { useWorker } from "@koale/useworker";
import useRunPathWorker from "./useRunPath.worker";
import brusselsStreets from "../data/brussels_streets.json";

export const useRunPath = () => {
  const { data } = useActivities();

  const [worker, workerController] = useWorker(useRunPathWorker, {});

  const { data: runPath } = useQuery({
    queryKey: ["runPath", data],
    queryFn: async () => {
      if (!data) return null;
      await workerController.kill();
      const d = await worker(data, brusselsStreets);
      if (d instanceof Error) {
        console.error(d);
        throw d;
      }
      return d;
    },
  });
  return runPath ?? null;
};
