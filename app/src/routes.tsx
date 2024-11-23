/* eslint-disable react/no-multi-comp -- allow subrouting components */
import { HomeOutlined } from "@ant-design/icons";
import { Result, Spin } from "antd";
import React, { lazy } from "react";
import { DataRouteObject, useRouteError } from "react-router";
import AppLayout from "./AppLayout";
import { QueryParamProvider } from "use-query-params";
import HomeButton from "./components/UI/HomeButton";
import RetryButton from "./components/UI/RetryButton";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";

function LoadingSpin() {
  return <Spin spinning tip="Loading..." style={{ textAlign: "center", width: "100%", marginTop: "100px" }} />;
}

export function NotFound() {
  return <Result status="404" title="404" subTitle="Sorry, the page you visited does not exist." extra={<HomeButton />} />;
}

export function ErrorBoundary() {
  const error: unknown = useRouteError();
  return <Result status="500" title={error?.toString()} subTitle="Sorry, something went wrong" extra={<RetryButton />} />;
}

export const routes: DataRouteObject[] = [
  {
    id: "root",
    path: "/",
    element: (
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <AppLayout />
      </QueryParamProvider>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        id: "home",
        path: "/",
        index: true,
        element: (
          <React.Suspense fallback={<LoadingSpin />}>
            {React.createElement(
              lazy(() => import("./components/Home/Home")),
              {},
            )}
          </React.Suspense>
        ),
        errorElement: <ErrorBoundary />,
        handle: {
          title: "Home",
          icon: HomeOutlined,
        },
      },
      {
        id: "login",
        path: "/oauth-login",
        element: (
          <React.Suspense fallback={<LoadingSpin />}>
            {React.createElement(
              lazy(() => import("./components/Login/Login")),
              {},
            )}
          </React.Suspense>
        ),
      },
      {
        id: "not-found",
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

const appendChildren = <R extends typeof routes>(routes: R): DataRouteObject[] =>
  routes.map((route) => (route?.children ? appendChildren(route.children) : route)).flat();

export const navigationMenuRoutes = appendChildren(routes)
  .filter((route) => !!route.handle?.icon)
  .map((route) => ({
    id: route.id,
    path: route.path,
    title: route.handle?.title,
    icon: route.handle?.icon,
    disabled: route.handle?.disabled,
  }));
