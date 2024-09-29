import { Button, Col, Input, Row, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import { USER_DTO } from "../../models/user.model";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../../redux/user.slice";
import { getAllRoleByOrderApi } from "../../redux/role.slice";
import { RootState } from "../../redux/configStore";

type Props = {
  setOpen: Function;
};

const CreateUser = (props: Props) => {
  const [userDto, setUserDto] = useState<USER_DTO>({
    name: "",
    password: "",
    phoneNumber: "",
    mail: "",
    role: "",
  });
  const { roleLst } = useSelector((state: RootState) => state.roleSlice);
  let roleSelector = roleLst.map((role) => {
    return { value: role._id, label: role.name };
  });
  const dispatch: any = useDispatch();
  useEffect(() => {
    dispatch(getAllRoleByOrderApi({ value: "", page: 1, sort: 1 }));
  }, []);
  return (
    <div className="max-w-xl mx-auto mt-4">
      <h1 className="mb-2 font-semibold text-lg">Tạo người dùng</h1>
      <Input
        size="large"
        className="mb-2"
        placeholder="Tên"
        value={userDto.name}
        onChange={(event) => {
          setUserDto({ ...userDto, name: event.target.value });
        }}
      />
      <Input
        size="large"
        className="mb-2"
        placeholder="Mail"
        value={userDto.mail}
        onChange={(event) => {
          setUserDto({ ...userDto, mail: event.target.value });
        }}
      />

      <Input.Password
        size="large"
        className="mb-2"
        placeholder="Mật khẩu"
        value={userDto.password}
        onChange={(event) => {
          setUserDto({ ...userDto, password: event.target.value });
        }}
      />
      <Input
        size="large"
        className="mb-2"
        placeholder="Số điện thoại"
        value={userDto.phoneNumber}
        onChange={(event) => {
          setUserDto({ ...userDto, phoneNumber: event.target.value });
        }}
      />
      <Select
        size="large"
        className="w-full mb-2 text-left"
        placeholder="Role"
        options={roleSelector}
        onChange={(value) => {
          setUserDto({ ...userDto, role: value });
        }}
      ></Select>

      <Button
        className="w-1/3 mx-2 text-black"
        size="large"
        onClick={() => {
          props.setOpen(false);
        }}
      >
        Đóng
      </Button>
      <Button
        disabled={
          userDto.role.trim() !== "" &&
          userDto.name.trim() !== "" &&
          userDto.password.trim() !== "" &&
          userDto.mail.trim() !== ""
            ? false
            : true
        }
        className=" w-1/3 mx-2  bg-blue-300 hover:bg-blue-400 text-black"
        size="large"
        onClick={() => {
          dispatch(createUser(userDto));
          props.setOpen(false);
        }}
      >
        Tạo
      </Button>
    </div>
  );
};

export default CreateUser;
