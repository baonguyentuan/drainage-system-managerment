import { Button } from "antd";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import configRouter from "../untils/config/configRouter";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetail } from "../redux/user.slice";
import { RootState } from "../redux/configStore";

type Props = {};

const HomeLayout = (props: Props) => {
  const { userDetail } = useSelector((state: RootState) => state.userSlice);
  console.log(userDetail);

  const navigate = useNavigate();
  const dispatch: any = useDispatch();
  useEffect(() => {
    if (localStorage.getItem("accessToken") !== null) {
      dispatch(getUserDetail());
    }
  }, []);
  return (
    <div className="w-full">
      <div className=" bg-slate-200 px-4 py-2">
        {userDetail !== null ? (
          <p>{userDetail.name}</p>
        ) : (
          <Button
            className=" bg-red-300"
            onClick={() => {
              navigate(configRouter.public.login);
            }}
          >
            Login
          </Button>
        )}
      </div>
      <Outlet />
    </div>
  );
};

export default HomeLayout;
