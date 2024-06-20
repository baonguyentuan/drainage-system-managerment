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
    <div>
      <Row>
        <Col>
          <Input
            placeholder="Tên"
            value={roleDto.name}
            onChange={(event) => {
              setRoleDto({ ...roleDto, name: event.target.value });
            }}
          />
          <Input
            placeholder="Mô tả"
            value={roleDto.description}
            onChange={(event) => {
              setRoleDto({ ...roleDto, description: event.target.value });
            }}
          />
        </Col>
        <Col>
          <Button
            danger
            onClick={async () => {
              console.log(roleDto);

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
