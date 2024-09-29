import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/configStore";
import { Button, Input, Popconfirm, Space, Table, TableProps } from "antd";
import { MeasurementBookModel } from "../models/measurement.model";
import { DeleteOutlined } from "@ant-design/icons";
import {
  deleteMeasurementApi,
  editMeasurementOption,
  getAllMeasurementByOrderApi,
} from "../redux/measurement.slice";

type Props = {};

const MeasurementManagerment = (props: Props) => {
  const { measurementLst, measurementOption } = useSelector(
    (state: RootState) => state.measurementBookSlice
  );
  const dispatch: any = useDispatch();
  const columns: TableProps<MeasurementBookModel>["columns"] = [
    {
      title: "Tên",
      dataIndex: "nameStructure",
      key: "nameStructure",
    },
    {
      title: "Bắt đầu",
      dataIndex: "startIndex",
      key: "startIndex",
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
              dispatch(deleteMeasurementApi(item._id));
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
    dispatch(getAllMeasurementByOrderApi(measurementOption));
  }, [measurementOption]);
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
              editMeasurementOption({
                option: { ...measurementOption, value: event.target.value },
              })
            );
          }}
        />
        <Table columns={columns} dataSource={measurementLst} rowKey={"_id"} />
        <p className="text-left -mt-11">
          Tổng: <b>{measurementLst.length}</b>
        </p>
      </div>
    </div>
  );
};

export default MeasurementManagerment;
