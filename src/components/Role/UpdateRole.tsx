import { Button, Col, Form, Input, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/configStore";
import { getAllEndpointByOrderApi } from "../../redux/endpoint.slice";
import {
  editRole,
  resetCurrentRole,
  updateRoleApi,
} from "../../redux/role.slice";
import { endpointConfig } from "../../untils/config/configEndpoint";
type Props = {};
const UpdateRole = (props: Props) => {
  const { endpointLst } = useSelector(
    (state: RootState) => state.endpointSlice
  );

  const { currentRole } = useSelector((state: RootState) => state.roleSlice);
  const dispatch: any = useDispatch();
  const checkExistEnpoint = (endpointCheck: string) => {
    let findIndex = currentRole?.endpointIds.findIndex(
      (ep) => ep === endpointCheck
    );
    return findIndex;
  };
  const renderGroupEndpoint = (group: string) => {
    return (
      <Col span={24} className="mt-2">
        <h1 className="font-semibold text-left">{group.toUpperCase()}</h1>
        <Row gutter={8}>
          {endpointLst
            .filter((ep) => ep.group === group)
            .map((ep) => {
              return (
                <Col span={4} key={ep._id}>
                  <p
                    className={`my-1 border-2 rounded-lg text-left p-1 cursor-pointer ${
                      checkExistEnpoint(ep._id) === -1 ||
                      checkExistEnpoint(ep._id) === undefined
                        ? ""
                        : "bg-green-300"
                    }`}
                    onClick={() => {
                      if (currentRole !== null) {
                        let tempEp = [...currentRole.endpointIds];

                        let findIndex: number = checkExistEnpoint(ep._id) || -1;
                        console.log(findIndex);
                        if (findIndex !== -1) {
                          tempEp.splice(findIndex, 1);
                        } else {
                          tempEp.push(ep._id);
                        }
                        dispatch(
                          editRole({
                            roleDetail: {
                              ...currentRole,
                              endpointIds: tempEp,
                            },
                          })
                        );
                      }
                    }}
                  >
                    {ep.description}
                  </p>
                </Col>
              );
            })}
        </Row>
      </Col>
    );
  };
  useEffect(() => {
    dispatch(
      getAllEndpointByOrderApi({
        page: 1,
        sort: 1,
        value: "",
      })
    );
  }, []);
  return (
    <div>
      <Form>
        <Row gutter={16}>
          <Col span={12}>
            <Input
              className="w-full"
              placeholder="Tên"
              value={currentRole?.name}
              onChange={(event) => {
                if (currentRole !== null) {
                  dispatch(
                    editRole({
                      roleDetail: { ...currentRole, name: event.target.value },
                    })
                  );
                }
              }}
            />
          </Col>
          <Col span={12}>
            <Input
              className="w-full"
              placeholder="Mô tả"
              value={currentRole?.description}
              onChange={(event) => {
                if (currentRole !== null) {
                  dispatch(
                    editRole({
                      roleDetail: {
                        ...currentRole,
                        description: event.target.value,
                      },
                    })
                  );
                }
              }}
            />
          </Col>
          {endpointConfig.endpointLst.map((ep) => {
            return renderGroupEndpoint(ep.value);
          })}
          <Col span={12} className="mt-2">
            <Button
              className="w-full"
              onClick={async () => {
                dispatch(resetCurrentRole());
              }}
            >
              Đóng
            </Button>
          </Col>
          <Col span={12} className="mt-2">
            <Button
              className="w-full"
              danger
              onClick={async () => {
                if (currentRole !== null) {
                  await dispatch(updateRoleApi(currentRole));
                }
              }}
            >
              Cật nhật
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default UpdateRole;
