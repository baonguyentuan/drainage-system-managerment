import { Button, Col, Form, Row, Select, Space, Switch } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/configStore";
import {
  editCurrentUserAdmin,
  resetCurrentUserAdmin,
  setUserOption,
  updateUserAdminApi,
} from "../../redux/user.slice";

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
      <Row gutter={16}>
        <Col span={16}>
          <p className="w-16 py-1 mb-2 bg-blue-200 rounded-xl">Role:</p>
          <Select
            className="mb-4 w-full text-left"
            options={roleSelector}
            value={currentUserAdmin?.role}
            onChange={(value) => {
              if (currentUserAdmin) {
                dispatch(
                  editCurrentUserAdmin({
                    detail: { ...currentUserAdmin, role: value },
                  })
                );
              }
            }}
          />
        </Col>
        <Col span={8}>
          <p className="w-20 py-1 mb-2 bg-blue-200 rounded-xl">Trạng thái:</p>
          <Switch
            className="bg-gray-400 w-full"
            checkedChildren="Active"
            unCheckedChildren="Block"
            checked={currentUserAdmin?.isActive}
            onChange={(value) => {
              if (currentUserAdmin) {
                dispatch(
                  editCurrentUserAdmin({
                    detail: { ...currentUserAdmin, isActive: value },
                  })
                );
              }
            }}
          />
        </Col>
        <Col span={24}>
          <Space>
            <Button
              onClick={() => {
                dispatch(resetCurrentUserAdmin());
              }}
            >
              Đóng
            </Button>
            <Button>Đặt lại mẩu khẩu</Button>
            <Button
              onClick={async () => {
                if (currentUserAdmin) {
                  const res = await dispatch(
                    updateUserAdminApi({
                      _id: currentUserAdmin._id,
                      isActive: currentUserAdmin.isActive,
                      role: currentUserAdmin.role,
                    })
                  );
                  if (res.meta.requestStatus === "fulfilled") {
                    dispatch(resetCurrentUserAdmin());
                    dispatch(
                      setUserOption({
                        option: {
                          role: "all",
                          status: 0,
                          searchValue: "",
                          sort: 1,
                          page: 1,
                        },
                      })
                    );
                  }
                }
              }}
            >
              Cập nhật
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default UpdateUser;
