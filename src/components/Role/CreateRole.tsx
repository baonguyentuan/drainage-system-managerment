import { Button, Col, Input, Row } from "antd";
import React, { useState } from "react";
import { ROLE_DTO } from "../../models/role.model";
import { useDispatch } from "react-redux";
import { createRole } from "../../redux/role.slice";
type Props = {};
const CreateRole = (props: Props) => {
  const [roleDto, setRoleDto] = useState<ROLE_DTO>({
    name: "",
    description: "",
    endpointIds: [],
  });
  const dispatch: any = useDispatch();
  return (
    <div className="border-2 border-blue-200 px-2 pb-2 pt-5 relative rounded-lg">
      <h1 className="absolute top-0 left-0 -translate-y-1/2 translate-x-2 bg-blue-300 rounded-full px-2">
        Tạo Role
      </h1>
      <Row gutter={16}>
        <Col span={8}>
          <Input
            className="w-full"
            placeholder="Tên"
            value={roleDto.name}
            onChange={(event) => {
              setRoleDto({ ...roleDto, name: event.target.value });
            }}
          />
        </Col>
        <Col span={8}>
          <Input
            className="w-full"
            placeholder="Mô tả"
            value={roleDto.description}
            onChange={(event) => {
              setRoleDto({ ...roleDto, description: event.target.value });
            }}
          />
        </Col>
        <Col span={8}>
          <Button
            className="w-full"
            danger
            onClick={async () => {
              await dispatch(createRole(roleDto));
            }}
          >
            Tạo
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default CreateRole;
