import { useQuery } from "@tanstack/react-query";
import { getAPI } from "../services/api";
import { queryClient } from "../App";
import { StravaApi, StravaListedActivity } from "../services/strava";
import { getOAuth } from "../services/auth";

export const getActivitiesFromStrava = async () => {
  const oauth = await getOAuth();
  if (!oauth && !localStorage.getItem("USE_MOCK_DATA")) throw new Error("Not logged in");
  const strava = new StravaApi(`Bearer ${oauth?.access_token}`);
  let query: Awaited<ReturnType<StravaApi["listActivities"]>> = [];

  let queryTmp: typeof query = [];
  let i = 1;
  const PER_PAGE = 200;
  do {
    queryTmp = await strava.listActivities({ page: i, per_page: PER_PAGE });
    query = query.concat(queryTmp);
    i++;
  } while (queryTmp.length > 0 && queryTmp.length === PER_PAGE);
  //query = await strava.listActivities({ page: 1, per_page: 5 });

  query = query.filter((activity) => activity.type === "Run" && activity.location_country === "Belgium");

  query = await Promise.all(
    query.map(async (activity) => {
      //const details = await strava.getActivity(activity.id);
      const gpx = null; // await strava.getGPX(activity.id);
      return {
        ...activity,
        gpx,
        //map: details.map,
      };
    }),
  );
  return query;
};

/**
 * get activities from api
 * @deprecated
 */
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

export const useActivities = () => useQuery({ queryKey: ["strava", "activities"], queryFn: () => getActivitiesFromStrava() });

export const getActivities = () => queryClient.fetchQuery({ queryKey: ["strava", "activities"], queryFn: () => getActivitiesFromStrava() });
