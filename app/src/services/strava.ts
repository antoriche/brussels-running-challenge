import axios, { AxiosInstance } from "axios";

export type StravaListedActivity = Awaited<ReturnType<StravaApi["listActivities"]>>[0];

export type StravaActivity = Awaited<ReturnType<StravaApi["getActivity"]>>;

export class StravaApi {
  instance: AxiosInstance;
  constructor(private authorizationHeader: string) {
    this.instance = axios.create({
      baseURL: "https://www.strava.com/api/v3",
      headers: {
        Authorization: this.authorizationHeader,
      },
    });
  }

  listActivities({ page, per_page }: { page?: number; per_page?: number }): Promise<
    Array<{
      id: number;
      name: string;
      location_city: string | null;
      location_country: string | null;
      type: string;
      map: {
        id: string;
        summary_polyline: string;
        polyline: string;
      };
    }>
  > {
    return this.instance
      .get("/athlete/activities", {
        params: {
          page,
          per_page,
        },
      })
      .then((response) => response.data);
  }

  getActivity(id: number): Promise<{
    id: number;
    name: string;
    map: {
      id: string;
      summary_polyline: string;
      polyline: string;
    };
  }> {
    return this.instance
      .get(`/activities/${id}`, {
        params: {},
      })
      .then((response) => response.data);
  }

  getGPX(id: number): Promise<unknown> {
    return this.instance
      .get(`/routes/${id}/export_gpx`, {
        params: {},
      })
      .then((response) => response.data);
  }
}
