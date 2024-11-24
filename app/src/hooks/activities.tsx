import { useQuery } from "@tanstack/react-query";
import { getAPI } from "../services/api";
import { queryClient } from "../App";
import { StravaListedActivity } from "../services/strava";

export const getActivities_ = async () => {
  const api = await getAPI();
  const res = await api.get<
    Array<
      StravaListedActivity & {
        map: {
          id: string;
          summary_polyline: string;
          polyline: string;
        };
      }
    >
  >("/strava/activities", {});
  return res.data;
};

export const useActivities = () => useQuery({ queryKey: ["strava", "activities"], queryFn: () => getActivities_() });

export const getActivities = () => queryClient.fetchQuery({ queryKey: ["strava", "activities"], queryFn: () => getActivities_() });
