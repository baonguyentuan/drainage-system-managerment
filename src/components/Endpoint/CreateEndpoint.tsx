import { Button, Form, Input, Select, Table, Upload } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { ENDPOINT_DTO } from "../../models/endpoint.model";
import { createEndpointApi } from "../../redux/endpoint.slice";
import { UploadOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import { endpointConfig } from "../../untils/config/configEndpoint";
type Props = {
  setOpen: Function;
};
const columns: TableProps<ENDPOINT_DTO>["columns"] = [
  {
    title: "Đường dẫn",
    dataIndex: "path",
    key: "path",
  },
  {
    title: "Phương thức",
    dataIndex: "method",
    key: "method",
  },
  {
    title: "Nhóm",
    dataIndex: "group",
    key: "group",
  },
  {
    title: "Mô tả",
    key: "description",
    dataIndex: "description",
  },
];
const CreateEndpoint = (props: Props) => {
  const [endpointDetail, setEndpointDetail] = useState<ENDPOINT_DTO>({
    path: "",
    method: "GET",
    group: "auth",
    description: "",
  });
  const [endpointCreateLst, setEndpointCreateLst] = useState<ENDPOINT_DTO[]>(
    []
  );
  const dispatch: any = useDispatch();
  return (
    <div className="max-w-xl mx-auto mt-4">
      <h1 className="mb-2 font-semibold text-lg">Tạo Endpoint</h1>
      <Upload
        accept=".txt"
        multiple={false}
        onRemove={() => {
          setEndpointCreateLst([]);
        }}
        beforeUpload={(file) => {
          setEndpointCreateLst([]);
          const reader = new FileReader();
          reader.onload = (e) => {
            let lst: ENDPOINT_DTO[] = [];
            if (e.target?.result) {
              e.target.result
                .toString()
                .split("\r\n")
                .forEach((epItem, indexEp) => {
                  let splitLst = epItem.split("\t");
                  if (splitLst.length === 4) {
                    let newEp: ENDPOINT_DTO = {
                      path: splitLst[3],
                      group: splitLst[1],
                      method: splitLst[2],
                      description: splitLst[0],
                    };
                    lst.push(newEp);
                  }
                });
            }
            setEndpointCreateLst(lst);
          };
          reader.readAsText(file);
          return false;
        }}
      >
        <Button size="large" icon={<UploadOutlined />}>
          Tạo theo tệp danh sách
        </Button>
      </Upload>
      {endpointCreateLst.length > 0 ? (
        <Table
          className="mt-4"
          columns={columns}
          dataSource={endpointCreateLst}
          rowKey={"description"}
        />
      ) : (
        <Form className="mt-4">
          <Input
            size="large"
            className="mb-2"
            placeholder="Đường dẫn"
            value={endpointDetail.path}
            onChange={(event) => {
              setEndpointDetail({
                ...endpointDetail,
                path: event.target.value,
              });
            }}
          />
          <Select
            value={endpointDetail.method}
            className="w-full text-left mb-2"
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
          <Select
            className="w-full text-left mb-2"
            value={endpointDetail.group}
            onChange={(value) => {
              setEndpointDetail({ ...endpointDetail, group: value });
            }}
            options={endpointConfig.endpointLst}
          />
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
        </Form>
      )}
      <Button
        className="w-1/3 mx-2 my-2 text-black"
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
          if (endpointCreateLst.length > 0) {
            endpointCreateLst.forEach((ep) => {
              dispatch(createEndpointApi(ep));
            });
          } else {
            dispatch(createEndpointApi(endpointDetail));
          }
          props.setOpen(false);
        }}
      >
        Tạo
      </Button>
    </div>
  );
};

export default CreateEndpoint;
