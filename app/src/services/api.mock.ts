import axios, { AxiosInstance } from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

export async function getMockAPI(): Promise<AxiosInstance> {
  const instance = axios.create();
  const mock = new AxiosMockAdapter(instance);
  mock.onGet("/athlete/activities").reply(200, Array.from(await import("../__mocks__/athlete_activities.json")));
  return instance;
}
