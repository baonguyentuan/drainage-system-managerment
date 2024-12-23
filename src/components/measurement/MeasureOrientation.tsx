import React, { useState } from "react";
import {
  MeasurementOrientationModel,
  MeasurementStationInfoModel,
} from "../../models/measurement.model";
import {
  Button,
  Input,
  InputNumber,
  Popconfirm,
  Popover,
  Radio,
  Space,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  deleteOrientationMeasurementApi,
  swapOrientationMeasurementApi,
  updateOrientationMeasurementApi,
} from "../../redux/measurement.slice";
import { RootState } from "../../redux/configStore";
type Props = {
  meaId: string;
  orient: MeasurementOrientationModel;
  index: number;
};

const MeasureOrientation = (props: Props) => {
  const dispatch: any = useDispatch();
  const { measurmentBook } = useSelector(
    (state: RootState) => state.measurementBookSlice
  );
  const [currentId, setCurrentId] = useState<string>("");
  const [orientEdit, setOrientEdit] = useState<MeasurementOrientationModel>(
    props.orient
  );
  const renderStationInfo = (stationInfo: MeasurementStationInfoModel) => {
    if (currentId === "") {
      return (
        <div
          className="col-span-6 grid grid-cols-3 font-semibold gap-2"
          id={props.orient._id}
        >
          <p className="">{stationInfo.start}</p>
          <p className="">{stationInfo.end}</p>
          <p className="">{stationInfo.machineHeight}</p>
        </div>
      );
    } else {
      return (
        <div className="col-span-6 grid grid-cols-3 font-semibold gap-2 mb-2">
          <Input
            value={orientEdit.stationInfo?.start}
            onChange={(event) => {
              if (orientEdit.stationInfo !== null) {
                let newStationInfo = { ...orientEdit.stationInfo };
                newStationInfo.start = event.target.value;
                setOrientEdit({ ...orientEdit, stationInfo: newStationInfo });
              }
            }}
          />
          <Input
            value={orientEdit.stationInfo?.end}
            onChange={(event) => {
              if (orientEdit.stationInfo !== null) {
                let newStationInfo = { ...orientEdit.stationInfo };
                newStationInfo.end = event.target.value;
                setOrientEdit({ ...orientEdit, stationInfo: newStationInfo });
              }
            }}
          />
          <InputNumber
            className="mx-auto w-full"
            value={orientEdit.stationInfo?.machineHeight}
            onChange={(value) => {
              if (typeof value === "number") {
                if (orientEdit.stationInfo !== null) {
                  let newStationInfo = { ...orientEdit.stationInfo };
                  newStationInfo.machineHeight = value;
                  setOrientEdit({ ...orientEdit, stationInfo: newStationInfo });
                }
              } else {
                if (orientEdit.stationInfo !== null) {
                  let newStationInfo = { ...orientEdit.stationInfo };
                  newStationInfo.machineHeight = 0;
                  setOrientEdit({ ...orientEdit, stationInfo: newStationInfo });
                }
              }
            }}
          />
        </div>
      );
    }
  };
  return (
    <div key={props.orient._id} className="grid grid-cols-6 border-b-2">
      {currentId !== "" ? (
        <div className="col-span-6 grid grid-cols-6 items-center gap-2 mb-2 px-2">
          <p className="col-span-1">{props.index}</p>
          <Input
            size="large"
            className="col-span-5"
            value={orientEdit.note}
            onChange={(e) => {
              setOrientEdit({ ...orientEdit, note: e.target.value });
            }}
          />
          <InputNumber
            size="large"
            className="col-span-2 mx-auto w-full"
            value={orientEdit.prismHeight}
            onChange={(value) => {
              if (value !== null) {
                setOrientEdit({ ...orientEdit, prismHeight: value });
              } else {
                setOrientEdit({ ...orientEdit, prismHeight: 0 });
              }
            }}
          />
          <Radio.Group
            className="col-span-4 w-full text-right"
            options={[
              { label: "130", value: 130 },
              { label: "136", value: 136 },
              { label: "215", value: 215 },
              { label: "0", value: 0 },
            ]}
            value={orientEdit.prismHeight}
            size="large"
            optionType="button"
            buttonStyle="solid"
            onChange={(e) => {
              setOrientEdit({ ...orientEdit, prismHeight: e.target.value });
            }}
          />
          <Button
            size="large"
            className="col-span-3 "
            onClick={() => {
              setCurrentId("");
            }}
          >
            <CloseOutlined />
          </Button>
          <Button
            size="large"
            className="col-span-3 bg-green-200"
            onClick={() => {
              dispatch(
                updateOrientationMeasurementApi({
                  measurementId: props.meaId,
                  orientId: props.orient._id,
                  orientDto: {
                    note: orientEdit.note,
                    prismHeight: orientEdit.prismHeight,
                    stationInfo: orientEdit.stationInfo,
                  },
                })
              );
              setCurrentId("");
            }}
          >
            <CheckOutlined />
          </Button>
        </div>
      ) : (
        <div className="col-span-6 grid grid-cols-6 hover:bg-green-100">
          <p className="col-span-1 py-1">{props.index}</p>
          <p className="col-span-4 py-1 text-left">{props.orient.note}</p>
          <Popover
            placement="topRight"
            content={
              <Space>
                {measurmentBook ? (
                  <Button
                    size="large"
                    disabled={
                      props.index ===
                        measurmentBook.orientationLst.length +
                          measurmentBook.startIndex -
                          1 || props.index === measurmentBook.startIndex
                        ? true
                        : false
                    }
                    onClick={() => {
                      dispatch(
                        swapOrientationMeasurementApi({
                          measurementId: props.meaId,
                          orientationId: props.orient._id,
                          status: false,
                        })
                      );
                    }}
                  >
                    <ArrowUpOutlined />
                  </Button>
                ) : (
                  ""
                )}
                {measurmentBook ? (
                  <Button
                    size="large"
                    disabled={
                      props.index ===
                        measurmentBook.orientationLst.length +
                          measurmentBook.startIndex -
                          1 || props.index === measurmentBook.startIndex
                        ? true
                        : false
                    }
                    onClick={() => {
                      dispatch(
                        swapOrientationMeasurementApi({
                          measurementId: props.meaId,
                          orientationId: props.orient._id,
                          status: true,
                        })
                      );
                    }}
                  >
                    <ArrowDownOutlined />
                  </Button>
                ) : (
                  ""
                )}

                <Button
                  size="large"
                  onClick={() => {
                    setCurrentId(props.orient._id);
                  }}
                >
                  <EditOutlined />
                </Button>
                <Popconfirm
                  placement="topRight"
                  title={"Xóa điểm đo"}
                  okType="dashed"
                  okText="YES"
                  cancelText="NO"
                  onConfirm={() => {
                    dispatch(
                      deleteOrientationMeasurementApi({
                        measurementId: props.meaId,
                        orientationId: props.orient._id,
                      })
                    );
                  }}
                >
                  <Button danger size="large">
                    <DeleteOutlined />
                  </Button>
                </Popconfirm>
              </Space>
            }
            title="Hành động"
            trigger="click"
          >
            <p className="col-span-1 py-1">{props.orient.prismHeight}</p>
          </Popover>
        </div>
      )}
      {props.orient.stationInfo !== null
        ? renderStationInfo(props.orient.stationInfo)
        : ""}
    </div>
  );
};

export default MeasureOrientation;
