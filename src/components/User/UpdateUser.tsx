import { Button, Col, Form, Row, Select, Space, Switch } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/configStore";
import { resetCurrentUserAdmin } from "../../redux/user.slice";

type Props = {};

const UpdateUser = (props: Props) => {
  const { currentUserAdmin } = useSelector(
    (state: RootState) => state.userSlice
  );
  const { roleLst } = useSelector((state: RootState) => state.roleSlice);
  const dispatch: any = useDispatch();
  const roleSelector = roleLst.map((role) => {
    return { label: role.name, value: role._id };
  });
  return (
    <div className="border-2 rounded-xl p-2 max-w-lg mx-auto">
      <h1 className="text-xl">Cập nhật người dùng</h1>
      <p className="font-semibold">
        Tên: <span>{currentUserAdmin?.name}</span>
      </p>
      <Form>
        <Row>
          <Col span={12}>
            <Form.Item label="Loại">
              <Select
                className="mb-4"
                style={{ width: 120 }}
                options={roleSelector}
                value={currentUserAdmin?.role}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Trạng thái">
              <Switch checked={currentUserAdmin?.isActive} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Space>
            <Button
              onClick={() => {
                dispatch(resetCurrentUserAdmin());
              }}
            >
              Đóng
            </Button>
            <Button>Đặt lại mẩu khẩu</Button>
            <Button>Cập nhật</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateUser;
