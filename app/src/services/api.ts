import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { getOAuth } from "./auth";
import { getMockAPI } from "./api.mock";

export async function getAPI(config: AxiosRequestConfig = {}): Promise<AxiosInstance> {
  if (localStorage.getItem("USE_MOCK_DATA")) {
    return await getMockAPI();
  }

  let token = "";
  const oauth = await getOAuth();
  if (oauth) {
    token = oauth.access_token;
  }
  return axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    ...config,
    headers: {
      "Content-Type": "application/json",
      Authorization: token && `Bearer ${token}`,
      ...(config.headers || {}),
    },
  });
}
