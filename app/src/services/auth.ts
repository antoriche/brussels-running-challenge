import localforage from "localforage";
import { useQuery } from "@tanstack/react-query";

export type OAuth = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete?: {
    firstname?: string;
    lastname?: string;
  };
};

export const setOAuth = (oauth: OAuth) => localforage.setItem("oauth", oauth);

export const getOAuth = () => localforage.getItem<OAuth | undefined>("oauth");

export const useOAuth = () => {
  const { data: oauth } = useQuery({
    queryKey: ["oauth"],
    queryFn: getOAuth,
  });
  return oauth;
};

export const isLogged = async () => {
  if (localStorage.getItem("USE_MOCK_DATA")) {
    return true;
  }
  const oauth = await getOAuth();
  // check if token is expired
  return !!(oauth && oauth.expires_at * 1000 > Date.now());
};

export const useIsLogged = () => {
  const { data: isLogged_ } = useQuery({
    queryKey: ["isLogged"],
    queryFn: () => isLogged(),
  });
  return isLogged_;
};

export const logout = async () => {
  localStorage.removeItem("USE_MOCK_DATA");
  await localforage.removeItem("oauth");
  window.location.href = "/";
};
