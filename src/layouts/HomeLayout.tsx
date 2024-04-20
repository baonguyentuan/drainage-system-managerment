import { Button, Space } from "antd";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import configRouter from "../untils/config/configRouter";

type Props = {};

const HomeLayout = (props: Props) => {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      <div className=" bg-slate-200 px-4 py-2 flex justify-end">
        <Space className="mx-auto">
          <Button
            className=" bg-red-300"
            onClick={() => {
              navigate(configRouter.public.login);
            }}
          >
            Login
          </Button>
        </Space>
      </div>
      <Outlet />
    </div>
  );
};

export default HomeLayout;
