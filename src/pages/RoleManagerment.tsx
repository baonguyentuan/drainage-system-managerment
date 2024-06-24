import { Button, Col, Input, Row, Space, Table, TableProps } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRole } from "../redux/role.slice";
import { RootState } from "../redux/configStore";
import CreateRole from "../components/Role/CreateRole";
import { ROLE_DETAIL } from "../models/role.model";

type Props = {};

const RoleManagerment = (props: Props) => {
  const { roleLst } = useSelector((state: RootState) => state.roleSlice);
  console.log(roleLst);

  const dispatch: any = useDispatch();
  const columns: TableProps<ROLE_DETAIL>["columns"] = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Chức năng",
      key: "endpointIds",
      dataIndex: "endpointIds",
      render: (item) => <p>{item.length}</p>,
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
    dispatch(getAllRole());
  }, []);
  return (
    <div className="m-4">
      <h1 className="mb-4">Quản lý Role</h1>
      <Input
        placeholder="Tìm kiếm"
        size="large"
        allowClear
        className="mb-4 w-full"
      />
      <CreateRole />
      <Table columns={columns} dataSource={roleLst} rowKey={"_id"} />
    </div>
  );
};

export default RoleManagerment;
