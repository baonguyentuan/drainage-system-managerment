import {
  Button,
  Col,
  Input,
  Popconfirm,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  Table,
  TableProps,
  Tag,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import CreateUser from "../components/User/CreateUser";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/configStore";
import {
  deleteUser,
  getAllUserByOrderApi,
  getUserByIdApi,
  setUserOption,
} from "../redux/user.slice";
import { USER_DETAIL } from "../models/user.model";
import { getAllRoleByOrderApi } from "../redux/role.slice";
import UpdateUser from "../components/User/UpdateUser";

type Props = {};

const UserManagerment = (props: Props) => {
  const { userLst, userOption, currentUserAdmin } = useSelector(
    (state: RootState) => state.userSlice
  );
  console.log(userOption);

  const { roleLst } = useSelector((state: RootState) => state.roleSlice);
  const [isCreateStatus, setIsCreateStatus] = useState<boolean>(false);
  const dispatch: any = useDispatch();
  const columns: TableProps<USER_DETAIL>["columns"] = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mail",
      dataIndex: "mail",
      key: "mail",
    },
    {
      title: "Điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Loại",
      key: "role",
      dataIndex: "role",
      render: (text) => (
        <Tag color={"blue"} key={text._id}>
          {text.name.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      key: "isActive",
      dataIndex: "isActive",
      render: (item) => (
        <div className="flex items-center">
          <span className={`ml-2 ${item ? "text-green-500" : "text-red-500"}`}>
            {item ? "Active" : "Block"}
          </span>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (item) => (
        <Space size="middle">
          <Button
            onClick={() => {
              dispatch(getUserByIdApi(item._id));
            }}
          >
            <EditOutlined />
          </Button>
          <Popconfirm
            placement="topRight"
            title={"Xóa user"}
            okType="dashed"
            okText="YES"
            cancelText="NO"
            onConfirm={() => {
              dispatch(deleteUser(item._id));
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
  const roleSelector = roleLst.map((role) => {
    return { label: role.name, value: role._id };
  });
  roleSelector.push({
    label: "Tất cả",
    value: "all",
  });

  useEffect(() => {
    dispatch(getAllUserByOrderApi(userOption));
  }, [userOption]);
  useEffect(() => {
    dispatch(getAllRoleByOrderApi({ value: "", sort: 1, page: 1 }));
  }, []);
  return (
    <div className="m-4">
      <h1 className="mb-4 font-bold text-2xl">Quản lý nhân sự</h1>

      {isCreateStatus ? (
        <CreateUser setOpen={setIsCreateStatus} />
      ) : (
        <div>
          <Row>
            <Col span={12}>
              <Button onClick={() => setIsCreateStatus(true)}>
                Tạo người dùng
              </Button>
            </Col>
            <Col span={12}>
              <Input
                placeholder="Tìm kiếm"
                size="large"
                allowClear
                className="mb-4"
                onChange={async (event) => {
                  await dispatch(
                    setUserOption({
                      option: {
                        ...userOption,
                        searchValue: event.target.value,
                      },
                    })
                  );
                }}
              />
            </Col>
            <Col>
              <span>Bộ lọc: </span>
              <span>Loại: </span>
              <Select
                className="mb-4 text-left"
                style={{ width: 200 }}
                options={roleSelector}
                value={userOption.role}
                onChange={(value) => {
                  dispatch(
                    setUserOption({
                      option: {
                        ...userOption,
                        role: value,
                      },
                    })
                  );
                }}
              />
              <span className="ml-2">Trạng thái: </span>
              <Radio.Group
                buttonStyle="solid"
                optionType="button"
                value={userOption.status}
                onChange={(event) => {
                  dispatch(
                    setUserOption({
                      option: {
                        ...userOption,
                        status: event.target.value,
                      },
                    })
                  );
                }}
              >
                <Radio value={0}>Tất cả</Radio>
                <Radio value={1}>Active</Radio>
                <Radio value={-1}>Block</Radio>
              </Radio.Group>
            </Col>
          </Row>
          {currentUserAdmin !== null ? <UpdateUser /> : ""}
          <Table columns={columns} dataSource={userLst} rowKey={"_id"} />
        </div>
      )}
    </div>
  );
};

export default UserManagerment;
