import { Button, Col, Input, Row, Space, Table, TableProps, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import React from "react";

type Props = {};
interface DataType {
  _id: string;
  name: string;
  mail: number;
  phoneNumber: string;
  role: string;
}
const columns: TableProps<DataType>["columns"] = [
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
    dataIndex: "address",
    key: "address",
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
    title: "Action",
    key: "action",
    render: () => (
      <Space size="middle">
        <Button>
          <EditOutlined />
        </Button>
        <Button>
          <DeleteOutlined />
        </Button>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    _id: "1",
    name: "John Brown",
    mail: 32,
    phoneNumber: "New York No. 1 Lake Park",
    role: "nice",
  },
  {
    _id: "2",
    name: "Jim Green",
    mail: 42,
    phoneNumber: "London No. 1 Lake Park",
    role: "loser",
  },
  {
    _id: "3",
    name: "Joe Black",
    mail: 32,
    phoneNumber: "Sydney No. 1 Lake Park",
    role: "cool",
  },
];
const RoleManagerment = (props: Props) => {
  return (
    <div className="m-4">
      <h1 className="mb-4">Quản lý Role</h1>
      <Row>
        <Col span={12}>
          <Button>Tạo Role</Button>
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
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default RoleManagerment;
