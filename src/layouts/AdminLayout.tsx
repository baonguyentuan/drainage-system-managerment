import React, { useState } from "react";
import {
  UserOutlined,
  SafetyOutlined,
  PartitionOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Menu } from "antd";
import { Outlet } from "react-router-dom";
import UserManagerment from "../pages/UserManagerment";

type MenuItem = Required<MenuProps>["items"][number];
type Props = {};
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}
const items: MenuItem[] = [
  getItem("User", "1", <UserOutlined />),
  getItem("Role", "2", <SafetyOutlined />),
  getItem("Endpoint", "3", <PartitionOutlined />),
];
const AdminLayout = (props: Props) => {
  return (
    <div className="grid grid-cols-5 ">
      <div className=" col-span-1">
        <Menu
          // style={{ width: 256 }}
          className="h-screen w-full"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="dark"
          items={items}
        />
      </div>
      <div className="col-span-4">
        <UserManagerment />
      </div>
    </div>
  );
};

export default AdminLayout;
