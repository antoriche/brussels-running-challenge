import React from "react";
import Map from "./Map";
import LoginWithStrava from "../Login/LoginWithStrava/LoginWithStrava";
import { logout, useIsLogged, useOAuth } from "../../services/auth";
import { GithubOutlined, LogoutOutlined } from "@ant-design/icons";
import { ConfigProvider, Spin, Tooltip } from "antd";
import Achievements from "../Achievements/Achievements";
import { useRunPath } from "../../hooks/useRunPath";
import { useActivities } from "../../hooks/activities";
import { usePercentByCommune } from "../../hooks/usePercentByCommune";

function Home() {
  const isLogged = useIsLogged();
  const oauth = useOAuth();

  const ranGeojson = useRunPath();
  const { data: activities, isLoading: isLoading_useActivities } = useActivities();
  const { data: percentByCommune = {}, isLoading: isLoading_usePercentByCommune } = usePercentByCommune(ranGeojson);

  return (
    <div
      style={{
        position: "relative",
        background: "linear-gradient(90deg, #1e5799 0%, #2989d8 100%)",
        height: "100%",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        //justifyContent: "center",
        padding: 0,
        margin: 0,
        paddingTop: "15vh",
      }}
    >
      <a
        href="https://github.com/antoriche/brussels-running-challenge"
        title="https://github.com/antoriche/brussels-running-challenge"
        target="_blank"
        style={{ position: "absolute", top: 10, left: 10, color: "lightgrey", fontSize: 24 }}
        rel="noreferrer"
      >
        <GithubOutlined />
      </a>
      {isLogged && (
        <div style={{ position: "absolute", top: 10, right: 10, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ color: "lightgrey", fontSize: 14 }}>
            {oauth?.athlete?.firstname} {oauth?.athlete?.lastname}
            {localStorage.getItem("USE_MOCK_DATA") && " (mock data)"}
          </div>
          <Tooltip title="Logout">
            <button
              style={{
                background: "transparent",
                border: "none",
                color: "lightgrey",
                fontSize: 24,
                cursor: "pointer",
              }}
              onClick={() => logout()}
            >
              <LogoutOutlined />
            </button>
          </Tooltip>
        </div>
      )}
      <div
        style={{
          textAlign: "center",
          position: "relative",
        }}
      >
        <h1
          style={{
            fontSize: 48,
            fontWeight: "bold",
            color: "gold",
            textShadow: "2px 2px 2px grey",
            letterSpacing: "0.05em",
          }}
        >
          Brussels Running Challenge
        </h1>
        <div style={{ margin: "20px 0" }}>
          <Map highlight={ranGeojson} />
        </div>

        {isLogged === false ? (
          <div style={{ display: "flex", alignItems: "center", flexDirection: "column", gap: 10 }}>
            <LoginWithStrava />
            <a
              style={{ color: "lightgrey", textDecoration: "underline", fontSize: "0.6rem" }}
              onClick={() => {
                localStorage.setItem("USE_MOCK_DATA", "true");
                window.location.reload();
              }}
            >
              Just try
            </a>
          </div>
        ) : (
          <>
            {isLoading_useActivities || isLoading_usePercentByCommune ? (
              <div
                style={{
                  color: "white",
                  display: "flex",
                  gap: 10,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <ConfigProvider theme={{ token: { colorPrimary: "gold" } }}>
                  <Spin />
                </ConfigProvider>
                Loading...
              </div>
            ) : (
              <Achievements percentByCommune={percentByCommune} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
