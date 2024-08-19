import {
  Button,
  Col,
  Dropdown,
  Input,
  Row,
  Select,
  Space,
  Table,
  TableProps,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/configStore";
import {
  deleteEndpointApi,
  getAllEndpointByOrderApi,
  getEndpointDetailApi,
  setEndpoitOption,
} from "../redux/endpoint.slice";
import CreateEndpoint from "../components/Endpoint/CreateEndpoint";
import { ENDPOINT_DETAIL } from "../models/endpoint.model";
import UpdateEndpoint from "../components/Endpoint/UpdateEndpoint";

type Props = {};

const EndpointManagerment = (props: Props) => {
  const { endpointLst, endPointOption, currentEndpoint } = useSelector(
    (state: RootState) => state.endpointSlice
  );
  const [isCreateStatus, setIsCreateStatus] = useState<boolean>(false);
  console.log(currentEndpoint);

  const dispatch: any = useDispatch();
  const columns: TableProps<ENDPOINT_DETAIL>["columns"] = [
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
      title: (
        <div className="flex justify-between cursor-pointer items-center text-base">
          <span>Nhóm</span>
          <Select
            value={endPointOption.value}
            style={{ width: 120 }}
            onChange={(value) => {
              dispatch(
                setEndpoitOption({ option: { ...endPointOption, value } })
              );
            }}
            options={[
              { label: "Tất cả", value: "all" },
              { label: "auth", value: "auth" },
              { label: "user", value: "user" },
              { label: "role", value: "role" },
              { label: "endpoint", value: "endpoint" },
            ]}
          />
        </div>
      ),
      dataIndex: "group",
      key: "group",
    },
    {
      title: "Mô tả",
      key: "description",
      dataIndex: "description",
    },
    {
      title: "Action",
      key: "action",
      render: (item) => (
        <Space size="middle">
          <Button
            onClick={() => {
              console.log(item._id);

              dispatch(getEndpointDetailApi(item._id));
            }}
          >
            <EditOutlined />
          </Button>
          <Button
            danger
            onClick={() => {
              dispatch(deleteEndpointApi(item._id));
            }}
          >
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    dispatch(getAllEndpointByOrderApi(endPointOption));
  }, [endPointOption]);
  return (
    <div className="m-4">
      <h1 className="mb-4">Quản lý Endpoint</h1>
      {isCreateStatus ? (
        <CreateEndpoint setOpen={setIsCreateStatus} />
      ) : (
        <div>
          <Button
            className="mb-4"
            onClick={() => {
              setIsCreateStatus(true);
            }}
          >
            Tạo Endpoint
          </Button>
          <Row gutter={16}>
            <Col span={currentEndpoint !== null ? 18 : 24}>
              <Table
                size="middle"
                bordered
                columns={columns}
                dataSource={endpointLst}
                rowKey={"_id"}
              />
              <p className="text-left -mt-11">
                Tổng: <b>{endpointLst.length}</b>
              </p>
            </Col>
            {currentEndpoint !== null ? (
              <Col span={currentEndpoint !== null ? 6 : 0}>
                <UpdateEndpoint />
              </Col>
            ) : null}
          </Row>
        </div>
      )}
    </div>
  );
};

export default EndpointManagerment;
