import { Button, Input, Popconfirm, Space, Table, TableProps } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteRoleApi,
  getAllRoleByOrderApi,
  getRoleDetailApi,
  setRoleOption,
} from "../redux/role.slice";
import { RootState } from "../redux/configStore";
import CreateRole from "../components/Role/CreateRole";
import { ROLE_DETAIL } from "../models/role.model";
import UpdateRole from "../components/Role/UpdateRole";
type Props = {};

const RoleManagerment = (props: Props) => {
  const { roleLst, currentRole, roleOption } = useSelector(
    (state: RootState) => state.roleSlice
  );
  const [isUpdateStatus, setIsUpdateStatus] = useState<boolean>(false);

  const dispatch: any = useDispatch();
  const columns: TableProps<ROLE_DETAIL>["columns"] = [
    {
      title: (
        <div
          className="flex justify-between cursor-pointer items-center text-base"
          onClick={() => {
            let newOption = { ...roleOption, sort: roleOption.sort * -1 };
            dispatch(
              setRoleOption({
                option: newOption,
              })
            );
          }}
        >
          <p>Tên</p>
          {roleOption.sort === 1 ? (
            <p>
              <CaretUpOutlined />
            </p>
          ) : (
            <p>
              <CaretDownOutlined />
            </p>
          )}
        </div>
      ),
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
          <Popconfirm
            placement="topRight"
            title={"Xóa role"}
            okType="dashed"
            okText="YES"
            cancelText="NO"
            onConfirm={() => {
              dispatch(deleteRoleApi(item._id));
            }}
          >
            <Button danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    dispatch(getAllRoleByOrderApi(roleOption));
  }, [roleOption]);
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
                setRoleOption({
                  option: { ...roleOption, value: event.target.value },
                })
              );
            }}
          />
          <CreateRole />
          <Table columns={columns} dataSource={roleLst} rowKey={"_id"} />
          <p className="text-left -mt-11">
            Tổng: <b>{roleLst.length}</b>
          </p>
        </div>
      )}
    </div>
  );
};

export default RoleManagerment;
