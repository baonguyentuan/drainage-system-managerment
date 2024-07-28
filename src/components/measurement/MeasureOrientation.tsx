import React, { useState } from "react";
import {
  MeasurementOrientationModel,
  MeasurementStationInfoModel,
} from "../../models/measurement.model";
import { Button, Input, InputNumber, Popover } from "antd";
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
    useSortable({ id: props.meaId });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const renderStationInfo = (stationInfo: MeasurementStationInfoModel) => {
    if (currentId === "") {
      return (
        <div className="col-span-6 grid grid-cols-3 font-semibold gap-2">
          <p className="">{stationInfo.start}</p>
          <p className="">{stationInfo.end}</p>
          <p className="">{stationInfo.machineHeight}</p>
        </div>
      );
    } else {
      return (
        <div className="col-span-6 grid grid-cols-3 font-semibold gap-2 mb-2">
          <Input value={orientEdit.stationInfo?.start} />
          <Input value={orientEdit.stationInfo?.end} />
          <Input value={orientEdit.stationInfo?.machineHeight} />
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
      <Popover
        content={
          <div>
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
          </div>
        }
        title="Hành động"
        trigger="click"
      >
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
              }}
            >
              <CheckOutlined />
            </Button>
          </div>
        ) : (
          <div className="col-span-6 grid grid-cols-6 ">
            <p className="col-span-1">{props.index + 1}</p>
            <p className="col-span-4 text-left">{props.orient.note}</p>
            <p className="col-span-1">{props.orient.prismHeight}</p>
          </div>
        )}
      </Popover>
    </div>
  );
};

export default MeasureOrientation;
