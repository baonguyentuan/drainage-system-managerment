import { Button, Input, Space, Table, TableProps } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRoleByOrderApi, getRoleDetailApi } from "../redux/role.slice";
import { RootState } from "../redux/configStore";
import CreateRole from "../components/Role/CreateRole";
import { ROLE_DETAIL } from "../models/role.model";
import UpdateRole from "../components/Role/UpdateRole";

type Props = {};

const RoleManagerment = (props: Props) => {
  const { roleLst, currentRole } = useSelector(
    (state: RootState) => state.roleSlice
  );
  const [isUpdateStatus, setIsUpdateStatus] = useState<boolean>(false);

  const dispatch: any = useDispatch();
  const columns: TableProps<ROLE_DETAIL>["columns"] = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
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
      render: (item) => (
        <Space size="middle">
          <Button
            onClick={async () => {
              const result = await dispatch(getRoleDetailApi(item._id));
              if (result.meta.requestStatus === "fulfilled") {
                await setIsUpdateStatus(true);
              }
            }}
          >
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
    dispatch(
      getAllRoleByOrderApi({
        value: "",
        sort: 1,
        page: 1,
      })
    );
  }, []);
  return (
    <div className="m-4">
      {currentRole !== null ? (
        <UpdateRole />
      ) : (
        <div>
          <h1 className="mb-4">Quản lý Role</h1>
          <Input
            placeholder="Tìm kiếm"
            size="large"
            allowClear
            className="mb-4 w-full"
            onChange={(event) => {
              dispatch(
                getAllRoleByOrderApi({
                  value: event.target.value,
                  sort: 1,
                  page: 1,
                })
              );
            }}
          />
          <CreateRole />
          <Table columns={columns} dataSource={roleLst} rowKey={"_id"} />
        </div>
      )}
    </div>
  );
};

export default RoleManagerment;
