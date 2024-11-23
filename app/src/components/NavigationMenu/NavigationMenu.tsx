import { Menu } from "antd";
import { Link } from "react-router-dom";
import { navigationMenuRoutes } from "../../routes";
import React from "react";

type NavigationMenuProps = {
  currentPath: string;
  collapsed: boolean;
};

function NavigationMenu({ currentPath, collapsed }: NavigationMenuProps) {
  const items = navigationMenuRoutes.map((route) => ({
    disabled: route.disabled || false,
    key: route.path || "/",
    icon: React.createElement(route.icon, {}),
    label: (
      <Link to={route.path || "#"}>
        <span>{route.title}</span>
      </Link>
    ),
  }));

  return (
    <Menu
      items={items}
      mode="inline"
      selectedKeys={[currentPath]}
      style={{ borderRight: collapsed ? "1px solid #e8e8e8" : "none" }} // right border fix
    />
  );
}

export default NavigationMenu;
