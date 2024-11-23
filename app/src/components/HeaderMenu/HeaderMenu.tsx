import React from "react";
import { Layout } from "antd";

import "./HeaderMenu.css";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useMatches } from "react-router";

const { Header } = Layout;

type HeaderMenuProps = {
  collapsed: boolean;
  toggleCollapse: () => void;
};
function HeaderMenu({ collapsed, toggleCollapse }: HeaderMenuProps) {
  const Icon = collapsed ? MenuUnfoldOutlined : MenuFoldOutlined;
  const matches = useMatches();
  const handle = matches?.[matches.length - 1]?.handle as { title: string } | undefined;
  const title = handle?.title || "";

  return (
    <Header
      style={{
        background: "#fff",
        padding: 0,
        display: "flex",
        alignItems: "center",
        zIndex: 1,
        boxShadow: "0 3px 6px lightgrey",
        clipPath: "inset(0px 0px -6px 0px)",
        justifyContent: "space-between",
      }}
    >
      <div className="header-menu-left">
        {toggleCollapse && ( // show only if we have toggleCollapse
          <Icon className="trigger" onClick={toggleCollapse} />
        )}
        <h2
          style={{
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
    </Header>
  );
}

export default HeaderMenu;
