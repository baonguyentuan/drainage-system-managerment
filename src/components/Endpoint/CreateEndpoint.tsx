import { Button, Input, Select } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { ENDPOINT_DTO } from "../../models/endpoint.model";
import { createEndpoint } from "../../redux/endpoint.slice";

type Props = {
  setOpen: Function;
};

const CreateEndpoint = (props: Props) => {
  const [endpointDetail, setEndpointDetail] = useState<ENDPOINT_DTO>({
    path: "",
    method: "GET",
    group: "auth",
    description: "",
  });
  const dispatch: any = useDispatch();
  return (
    <div className="max-w-xl mx-auto mt-4">
      <h1 className="mb-2 font-semibold text-lg">Tạo người dùng</h1>
      <Input
        size="large"
        className="mb-2"
        placeholder="ĐƯờng dẫn"
        value={endpointDetail.path}
        onChange={(event) => {
          setEndpointDetail({ ...endpointDetail, path: event.target.value });
        }}
      />
      <Select
        defaultValue="GET"
        className="w-full text-left"
        onChange={(value) => {
          setEndpointDetail({ ...endpointDetail, method: value });
        }}
        options={[
          { value: "POST", label: "POST" },
          { value: "GET", label: "GET" },
          { value: "PUT", label: "PUT" },
          { value: "PATCH", label: "PATCH" },
          { value: "DELETE", label: "DELETE" },
        ]}
      />
      {/* <Input
        size="large"
        className="mb-2"
        placeholder="Phương thức"
        value={endpointDetail.method}
        onChange={(event) => {
          setEndpointDetail({ ...endpointDetail, method: event.target.value });
        }}
      /> */}
      <Select
        className="w-full text-left"
        defaultValue="auth"
        onChange={(value) => {
          setEndpointDetail({ ...endpointDetail, group: value });
        }}
        options={[
          { value: "auth", label: "auth" },
          { value: "user", label: "user" },
          { value: "role", label: "role" },
          { value: "endpoint", label: "endpoint" },
          //   { value: "delete", label: "DELETE" },
        ]}
      />
      {/* <Input
        size="large"
        className="mb-2"
        placeholder="Nhóm"
        value={endpointDetail.group}
        onChange={(event) => {
          setEndpointDetail({ ...endpointDetail, group: event.target.value });
        }}
      /> */}
      <Input
        size="large"
        className="mb-2"
        placeholder="Mô tả"
        value={endpointDetail.description}
        onChange={(event) => {
          setEndpointDetail({
            ...endpointDetail,
            description: event.target.value,
          });
        }}
      />
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
        className=" w-1/3 mx-2  bg-blue-300 hover:bg-blue-400 text-black"
        size="large"
        onClick={() => {
          dispatch(createEndpoint(endpointDetail));
          props.setOpen(false);
        }}
      >
        Tạo
      </Button>
    </div>
  );
};

export default CreateEndpoint;
