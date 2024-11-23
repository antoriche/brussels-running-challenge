import React, { useEffect } from "react";
import { setOAuth } from "../../services/auth";
import { getAPI } from "../../services/api";
import { Alert } from "antd";

function Login() {
  const [error, setError] = React.useState<string | null>(null);
  useEffect(() => {
    const stravaAuthorizationCode = new URLSearchParams(window.location.search).get("code");
    getAPI()
      .then((api) => api.post("/oauth", { code: stravaAuthorizationCode }))
      .then((response) => response.data)
      .then(async (oauth) => {
        await setOAuth(oauth);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
      });
  }, []);

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <Alert
          message="Error"
          description={error}
          onClick={() => {
            window.location.href = "/";
          }}
          type="error"
          showIcon
        />
      </div>
    );
  }
  return <div>Redirecting...</div>;
}

export default Login;
