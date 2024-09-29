import React, { useEffect } from "react";
import {
  UserOutlined,
  SafetyOutlined,
  PartitionOutlined,
} from "@ant-design/icons";
import { Menu, type MenuProps } from "antd";
import UserManagerment from "../pages/UserManagerment";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/configStore";
import RoleManagerment from "../pages/RoleManagerment";
import { setMenuBarStatus } from "../redux/admin.slice";
import EndpointManagerment from "../pages/EndpointManagerment";
import MeasurementManagerment from "../pages/MeasurementManagerment";
import AltitudeManagerment from "../pages/AltitudeManagerment";

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
  getItem("User", "user", <UserOutlined />),
  getItem("Role", "role", <SafetyOutlined />),
  getItem("Endpoint", "endpoint", <PartitionOutlined />),
  getItem("Measurement", "measurement", <PartitionOutlined />),
  getItem("Altitude", "altitude", <PartitionOutlined />),
];
const AdminLayout = (props: Props) => {
  const { menuBarStatus } = useSelector((state: RootState) => state.adminSlice);
  const { userDetail } = useSelector((state: RootState) => state.userSlice);

  const dispatch = useDispatch();
  const renderContent = (status: string) => {
    if (status === "user") {
      return <UserManagerment />;
    } else if (status === "role") {
      return <RoleManagerment />;
    } else if (status === "endpoint") {
      return <EndpointManagerment />;
    } else if (status === "measurement") {
      return <MeasurementManagerment />;
    } else {
      return <AltitudeManagerment />;
    }
  };
  // useEffect(()=>{
  //   if(userDetail ||userDetail.)
  // },[userDetail])
  return (
    <div className="grid grid-cols-5 ">
      <div className=" col-span-1">
        <Menu
          // style={{ width: 256 }}
          className="h-screen w-full"
          selectedKeys={[menuBarStatus]}
          // defaultSelectedKeys={["user"]}
          // defaultOpenKeys={["user"]}
          mode="inline"
          theme="dark"
          items={items}
          onClick={async (value) => {
            await dispatch(setMenuBarStatus({ status: value.key }));
          }}
        />
      </div>
      <div className="col-span-4">{renderContent(menuBarStatus)}</div>
    </div>
  );
};

export default AdminLayout;
