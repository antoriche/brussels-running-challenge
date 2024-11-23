import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Layout } from "antd";

const { Content, Sider } = Layout;

function AppLayout() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { pathname } = useLocation();

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <Layout style={{ height: "100vh" }}>
      {/*<Sider
        collapsible
        theme="light"
        collapsed={isCollapsed}
        width={250}
        onCollapse={toggleCollapse}
        trigger={null}
        style={{
          zIndex: 5,
          position: "relative",
          boxShadow: "2px 0px 3px lightgrey",
        }}
      >
        <Link to="/">
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: 70,
            }}
          >
            <img
              src={isCollapsed ? logoOnly : logoFull}
              alt="jetpacklogofull"
              style={{
                maxWidth: "100%",
                maxHeight: 70,
                padding: 10,
                marginBottom: 24,
              }}
            />
          </div>
        </Link>
        <NavigationMenu collapsed={isCollapsed} currentPath={pathname} />
        <div style={{ position: "absolute", bottom: "0" }}>
          <a href="https://jetpack.ai" target="_blank" rel="noopener noreferrer" style={{ color: "black" }}>
            <div style={{ fontSize: isCollapsed ? 11 : 16, textAlign: isCollapsed ? "center" : undefined }}>Made with ♥ by</div>
            <img
              style={isCollapsed ? { height: 40, margin: 20 } : { height: 35, margin: 12, marginLeft: 20 }}
              src={isCollapsed ? logoOnly : logoFull}
              alt="logo"
            />
          </a>
        </div>
      </Sider>*/}
      <Layout>
        {/*<HeaderMenu toggleCollapse={toggleCollapse} collapsed={isCollapsed} />*/}
        <Content
          style={{
            //height: "calc(100vh - 64px)",
            height: "100%",
            maxHeight: "100%",
            overflowY: "auto",
            position: "relative",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
