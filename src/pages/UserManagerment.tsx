import {
  Button,
  Col,
  Input,
  Row,
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
import { deleteUser, getAllUser } from "../redux/user.slice";
import { USER_DETAIL } from "../models/user.model";

type Props = {};

const UserManagerment = (props: Props) => {
  const { userLst } = useSelector((state: RootState) => state.userSlice);
  console.log(userLst);

  const [isCreateStatus, setIsCreateStatus] = useState<boolean>(false);
  const dispatch: any = useDispatch();
  const columns: TableProps<USER_DETAIL>["columns"] = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
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
        <Tag color={"blue"} key={text}>
          {text.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      key: "isActive",
      dataIndex: "isActive",
      render: (item) => (
        <div className="flex items-center">
          <Switch checked={item} />
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
          <Button>
            <EditOutlined />
          </Button>
          <Button
            onClick={() => {
              dispatch(deleteUser(item._id));
            }}
          >
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    dispatch(getAllUser());
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
              />
            </Col>
          </Row>
          <Table columns={columns} dataSource={userLst} rowKey={"_id"} />
        </div>
      )}
    </div>
  );
};

export default UserManagerment;
