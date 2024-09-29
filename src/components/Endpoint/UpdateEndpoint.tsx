import { Button, Form, Input, Select } from "antd";
import React from "react";
import { RootState } from "../../redux/configStore";
import { useDispatch, useSelector } from "react-redux";
import {
  editEndpointDetail,
  updateEndpointApi,
} from "../../redux/endpoint.slice";
import { endpointConfig } from "../../untils/config/configEndpoint";

type Props = {};

function UpdateEndpoint({}: Props) {
  const { currentEndpoint } = useSelector(
    (state: RootState) => state.endpointSlice
  );
  const dispatch: any = useDispatch();
  return (
    <div>
      <Form className="mt-4">
        <h1 className="text-xl font-semibold mb-2">Thông tin</h1>
        <Input
          size="large"
          className="mb-2"
          placeholder="Đường dẫn"
          value={currentEndpoint?.path}
          onChange={(event) => {
            if (currentEndpoint !== null) {
              dispatch(
                editEndpointDetail({
                  endpointDetail: {
                    ...currentEndpoint,
                    path: event.target.value,
                  },
                })
              );
            }
          }}
        />
        <Select
          value={currentEndpoint?.method}
          size="large"
          className="w-full text-left mb-2"
          onChange={(value) => {
            if (currentEndpoint !== null) {
              dispatch(
                editEndpointDetail({
                  endpointDetail: { ...currentEndpoint, method: value },
                })
              );
            }
          }}
          options={[
            { value: "POST", label: "POST" },
            { value: "GET", label: "GET" },
            { value: "PUT", label: "PUT" },
            { value: "PATCH", label: "PATCH" },
            { value: "DELETE", label: "DELETE" },
          ]}
        />
        <Select
          className="w-full text-left mb-2"
          size="large"
          value={currentEndpoint?.group}
          onChange={(value) => {
            if (currentEndpoint !== null) {
              dispatch(
                editEndpointDetail({
                  endpointDetail: { ...currentEndpoint, group: value },
                })
              );
            }
          }}
          options={endpointConfig.endpointLst}
        />
        <Input
          size="large"
          className="mb-2"
          placeholder="Mô tả"
          value={currentEndpoint?.description}
          onChange={(event) => {
            if (currentEndpoint !== null) {
              dispatch(
                editEndpointDetail({
                  endpointDetail: {
                    ...currentEndpoint,
                    description: event.target.value,
                  },
                })
              );
            }
          }}
        />
        <Button
          size="large"
          danger
          className="w-full my-1"
          onClick={() => {
            if (currentEndpoint !== null) {
              dispatch(updateEndpointApi(currentEndpoint));
            }
          }}
        >
          Cập nhật
        </Button>
        <Button
          size="large"
          className="w-full my-1"
          onClick={() => {
            dispatch(editEndpointDetail({ endpointDetail: null }));
          }}
        >
          Đóng
        </Button>
      </Form>
    </div>
  );
}

export default UpdateEndpoint;
