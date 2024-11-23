import React from "react";
import Map from "./Map";
import LoginWithStrava from "../Login/LoginWithStrava/LoginWithStrava";
import { logout, useIsLogged, useOAuth } from "../../services/auth";
import { LogoutOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import Achievements from "../Achievements/Achievements";
import { useRunPath } from "../../hooks/useRunPath";

function Home() {
  const isLogged = useIsLogged();
  const oauth = useOAuth();

  const ranGeojson = useRunPath();

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
        paddingTop: '15vh'
      }}
    >
      {isLogged && (
        <div style={{ position: "absolute", top: 10, right: 10, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ color: "lightgrey", fontSize: 14 }}>
            {oauth?.athlete?.firstname} {oauth?.athlete?.lastname}
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <LoginWithStrava />
          </div>
        ) : (
          <>
            <Achievements />
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
