import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AmplifyProvider } from "@aws-amplify/ui-react";
import configureAuth from "./configureEnvironment/configureAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./App.css";
import "antd/dist/reset.css";
import { routes } from "./routes";
import AuthenticatorWrapper from "./components/Utils/AuthenticatorWrapper";

export const shouldSkipAuth = () => process.env.REACT_APP_SKIP_AUTH === "SKIP";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

if (!shouldSkipAuth()) {
  configureAuth();
}

const router = createBrowserRouter(routes);

function App() {
  return (
    <AmplifyProvider>
      <AuthenticatorWrapper>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          {window.location.hostname === "localhost" && <ReactQueryDevtools />}
        </QueryClientProvider>
      </AuthenticatorWrapper>
    </AmplifyProvider>
  );
}

export default App;
