import React from "react";
import CONNECT_WITH_STRAVA from "../../../assets/connect_with_strava.png";

const CLIENT_ID = process.env.REACT_APP_STRAVA_CLIENT_ID;
const REDIRECT_URL = `https://${process.env.REACT_APP_DOMAIN}/oauth-login`;
function LoginWithStrava() {
  return (
    <a
      href={`https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&amp;response_type=code&amp;scope=read,read_all,profile:read_all,activity:read,activity:read_all&amp;redirect_uri=${REDIRECT_URL}`}
    >
      <img src={CONNECT_WITH_STRAVA} width="193" height="48" style={{ display: "block", marginRight: "-4px", marginLeft: "4px" }} />
    </a>
  );
}

export default LoginWithStrava;
