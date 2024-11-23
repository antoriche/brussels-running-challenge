import axios, { AxiosRequestConfig } from "axios";
import { getOAuth } from "./auth";

export async function getAPI(config: AxiosRequestConfig = {}) {
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
