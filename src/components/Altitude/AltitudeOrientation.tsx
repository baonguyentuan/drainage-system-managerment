import React, { useState } from "react";
import { Button, Input, Popover, Space, Switch } from "antd";
import { useDispatch } from "react-redux";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AltitudeOrientationModel } from "../../models/altitude.models";
import {
  deleteOrientationAltitudeApi,
  updateOrientationAltitudeApi,
} from "../../redux/altitude.slice";
type Props = {
  altId: string;
  orient: AltitudeOrientationModel;
  index: number;
};

const AltitudeOrientation = (props: Props) => {
  const dispatch: any = useDispatch();
  const [currentId, setCurrentId] = useState<string>("");
  const [orientEdit, setOrientEdit] = useState<AltitudeOrientationModel>(
    props.orient
  );

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.orient._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      key={props.orient._id}
      className="grid grid-cols-6"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {currentId !== "" ? (
        <div className="col-span-6 grid grid-cols-6 items-center gap-2 mb-2">
          <Input
            className="col-span-6"
            value={orientEdit.note}
            onChange={(e) => {
              setOrientEdit({ ...orientEdit, note: e.target.value });
            }}
          />
          <div className="col-span-2">
            <span>MS</span>
            <Switch
              className="mx-2"
              checked={orientEdit.isStart}
              onChange={(value) => {
                setOrientEdit({ ...orientEdit, isStart: value });
              }}
            />
            <span>MT</span>
          </div>
          <Button
            size="large"
            className="col-span-2"
            onClick={() => {
              setCurrentId("");
            }}
          >
            <CloseOutlined />
          </Button>
          <Button
            size="large"
            className="col-span-2 bg-green-200"
            onClick={() => {
              dispatch(
                updateOrientationAltitudeApi({
                  orientId: props.orient._id,
                  orientDto: {
                    placemarkId: orientEdit.placemarkId,
                    note: orientEdit.note,
                    topNumber: orientEdit.topNumber,
                    bottomNumber: orientEdit.bottomNumber,
                    centerNumber: orientEdit.centerNumber,
                    isStart: orientEdit.isStart,
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
                    deleteOrientationAltitudeApi({
                      altitudeId: props.altId,
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
            {props.orient.isStart === true ? (
              <hr className="col-span-6 border-2 border-gray-400" />
            ) : (
              ""
            )}
            <p className="col-span-1 py-1 text-left">
              {props.orient.topNumber}
            </p>
            <p className="col-span-1 py-1 text-left">
              {props.orient.centerNumber}
            </p>
            <p className="col-span-1 py-1 text-left">
              {props.orient.bottomNumber}
            </p>
            <p className="col-span-1 py-1">
              {(
                (props.orient.topNumber - props.orient.bottomNumber) /
                10
              ).toFixed(1)}
            </p>
            <p className="col-span-2 py-1 text-left">{props.orient.note}</p>
          </div>
        </Popover>
      )}
    </div>
  );
};

export default AltitudeOrientation;
