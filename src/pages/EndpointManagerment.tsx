import { Button, Col, Input, Row, Space, Table, TableProps, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/configStore";
import { getAllEndpoint } from "../redux/endpoint.slice";
import CreateEndpoint from "../components/Endpoint/CreateEndpoint";
import { ENDPOINT_DETAIL } from "../models/endpoint.model";

type Props = {};

const EndpointManagerment = (props: Props) => {
  const { endpointLst } = useSelector(
    (state: RootState) => state.endpointSlice
  );
  const [isCreateStatus, setIsCreateStatus] = useState<boolean>(false);
  console.log(endpointLst);

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
      title: "Nhóm",
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
      render: () => (
        <Space size="middle">
          <Button>
            <EditOutlined />
          </Button>
          <Button danger>
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    dispatch(getAllEndpoint());
  }, []);
  return (
    <div className="m-4">
      <h1 className="mb-4">Quản lý Endpoint</h1>
      {isCreateStatus ? (
        <CreateEndpoint setOpen={setIsCreateStatus} />
      ) : (
        <div>
          <Row>
            <Col span={12}>
              <Button
                onClick={() => {
                  setIsCreateStatus(true);
                }}
              >
                Tạo Endpoint
              </Button>
            </Col>
            <Col span={12}>
              <Input
                placeholder="Tìm kiếm"
                size="large"
                allowClear
                className="mb-4"
              />
            </Col>
          </Row>
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
        </div>
      )}
    </div>
  );
};

export default EndpointManagerment;
