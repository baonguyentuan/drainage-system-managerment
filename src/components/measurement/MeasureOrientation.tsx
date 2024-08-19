import React, { useState } from "react";
import {
  MeasurementOrientationModel,
  MeasurementStationInfoModel,
} from "../../models/measurement.model";
import { Button, Input, InputNumber, Popover, Space } from "antd";
import { useDispatch } from "react-redux";
import { EditOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import {
  deleteOrientationMeasurementApi,
  updateNameMeasurementApi,
  updateOrientationMeasurementApi,
} from "../../redux/measurement.slice";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
type Props = {
  meaId: string;
  orient: MeasurementOrientationModel;
  index: number;
};

const MeasureOrientation = (props: Props) => {
  const dispatch: any = useDispatch();
  const [currentId, setCurrentId] = useState<string>("");
  const [orientEdit, setOrientEdit] = useState<MeasurementOrientationModel>(
    props.orient
  );
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: props.orient._id,
    });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };
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
    <div
      key={props.orient._id}
      className="grid grid-cols-6 border-b-2"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {props.orient.stationInfo !== null
        ? renderStationInfo(props.orient.stationInfo)
        : ""}
      {currentId !== "" ? (
        <div className="col-span-6 grid grid-cols-6 items-center gap-2 mb-2">
          <p className="col-span-1">{props.index + 1}</p>
          <Input
            className="col-span-4"
            value={orientEdit.note}
            onChange={(e) => {
              setOrientEdit({ ...orientEdit, note: e.target.value });
            }}
          />
          <InputNumber
            className="col-span-1"
            value={orientEdit.prismHeight}
            onChange={(value) => {
              if (value !== null) {
                setOrientEdit({ ...orientEdit, prismHeight: value });
              } else {
                setOrientEdit({ ...orientEdit, prismHeight: 0 });
              }
            }}
          />
          <Button
            className="col-span-6 bg-green-200"
            onClick={() => {
              dispatch(
                updateOrientationMeasurementApi({
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
        <Popover
          content={
            <Space>
              <Button
                onClick={() => {
                  setCurrentId(props.orient._id);
                }}
              >
                <EditOutlined />
              </Button>
              <Button
                onClick={() => {
                  dispatch(
                    deleteOrientationMeasurementApi({
                      measurementId: props.meaId,
                      orientationId: props.orient._id,
                    })
                  );
                }}
              >
                <DeleteOutlined />
              </Button>
            </Space>
          }
          title="Hành động"
          trigger="click"
        >
          <div className="col-span-6 grid grid-cols-6 ">
            <p className="col-span-1 py-1">{props.index + 1}</p>
            <p className="col-span-4 py-1 text-left">{props.orient.note}</p>
            <p className="col-span-1 py-1">{props.orient.prismHeight}</p>
          </div>
        </Popover>
      )}
    </div>
  );
};

export default MeasureOrientation;
