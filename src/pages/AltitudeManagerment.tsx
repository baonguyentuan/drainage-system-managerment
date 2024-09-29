import React, { useEffect } from "react";
import { RootState } from "../redux/configStore";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Popconfirm, Space, Table, TableProps } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { AltitudeBookModel } from "../models/altitude.models";
import {
  deleteAltitudeApi,
  editAltitudeOption,
  getAllAltitudeByOrderApi,
} from "../redux/altitude.slice";
type Props = {};

const AltitudeManagerment = (props: Props) => {
  const { altitudeLst, altitudeOption } = useSelector(
    (state: RootState) => state.altitudeSlice
  );
  const dispatch: any = useDispatch();
  const columns: TableProps<AltitudeBookModel>["columns"] = [
    {
      title: "Tên",
      dataIndex: "nameStructure",
      key: "nameStructure",
    },
    {
      title: "Điểm đo",
      key: "orientationLst",
      dataIndex: "orientationLst",
      render: (item) => <p>{item.length}</p>,
    },
    {
      title: "Action",
      key: "action",
      render: (item) => (
        <Space size="middle">
          <Popconfirm
            placement="topRight"
            title={"Xóa sổ đo"}
            okType="dashed"
            okText="YES"
            cancelText="NO"
            onConfirm={() => {
              dispatch(deleteAltitudeApi(item._id));
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
    dispatch(getAllAltitudeByOrderApi(altitudeOption));
  }, [altitudeOption]);
  return (
    <div className="m-4">
      <div>
        <h1 className="mb-4">Quản lý sổ đo mặt bằng</h1>
        <Input
          placeholder="Tìm kiếm"
          size="large"
          allowClear
          className="mb-4 w-full"
          onChange={(event) => {
            dispatch(
              editAltitudeOption({
                option: { ...altitudeOption, value: event.target.value },
              })
            );
          }}
        />
        <Table columns={columns} dataSource={altitudeLst} rowKey={"_id"} />
        <p className="text-left -mt-11">
          Tổng: <b>{altitudeLst.length}</b>
        </p>
      </div>
    </div>
  );
};

export default AltitudeManagerment;
