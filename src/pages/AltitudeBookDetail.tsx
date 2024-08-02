import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, useParams } from "react-router-dom";
import { RootState } from "../redux/configStore";
import {
  createOrientationApi,
  getAltitudeDetailApi,
  swapOrientationAltitudeApi,
  updateNameAltitudeApi,
} from "../redux/altitude.slice";
import { Button, Input, InputNumber, Space } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { SortableContext } from "@dnd-kit/sortable";
import AltitudeOrientation from "../components/Altitude/AltitudeOrientation";
import { formatText } from "../untils/operate/opetate";
import { saveAs } from "file-saver";

type Props = {};

const AltitudeBookDetail = (props: Props) => {
  const param = useParams();
  const altiId = param.id === undefined ? "" : param.id;
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 10,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);
  const { isOpen } = useSelector((state: RootState) => state.drawerSlice);
  const { altitudeBook, altitudeOption, altitudeLst } = useSelector(
    (state: RootState) => state.altitudeSlice
  );
  const dispatch: any = useDispatch();
  let [note, setNote] = useState<string>("");
  let [upNumber, setUpNumber] = useState<number>(0);
  let [centerNumber, setCenterNumber] = useState<number>(0);
  let [downNumber, setDownNumber] = useState<number>(0);
  const [currentId, setCurrentId] = useState<string>("");
  const [nameEdit, setNameEdit] = useState<string>(
    altitudeBook?.nameStructure ? altitudeBook.nameStructure : ""
  );
  let calculateAccuracy = (
    upNumber: number,
    centerNumber: number,
    downNumber: number
  ) => (upNumber + downNumber) / 2 - centerNumber;
  let calculateDistance = (upNumber: number, downNumber: number) =>
    (upNumber - downNumber) / 10;
  let calculateCumulativeDistance = () => {
    let startValue: number = 0;
    if (altitudeBook) {
      altitudeBook.orientationLst.forEach((ori, index) => {
        if (ori.isStart === true) {
          if (index > 1) {
            startValue += calculateDistance(
              altitudeBook.orientationLst[index - 1].upNumber,
              altitudeBook.orientationLst[index - 1].downNumber
            );
            startValue += calculateDistance(ori.upNumber, ori.downNumber);
          } else {
            startValue += calculateDistance(ori.upNumber, ori.downNumber);
          }
        }
      });
    }
    return startValue;
  };
  const checkDisableBtnAdd = () => {
    if (note === "" || altitudeBook?.nameStructure === "") {
      return true;
    }
    return false;
  };
  useEffect(() => {
    dispatch(getAltitudeDetailApi(altiId));
  }, [altitudeOption]);
  return (
    <div className="h-screen w-screen p-4">
      {altitudeBook !== null ? (
        <div>
          <div className="flex">
            {currentId === "" ? (
              <h1
                className="flex-1 text-center text-lg font-bold mb-4"
                onClick={() => {
                  setNameEdit(altitudeBook.nameStructure);
                  setCurrentId(altitudeBook._id);
                }}
              >
                Sổ đo MB : {altitudeBook.nameStructure}
              </h1>
            ) : (
              <Input
                className="mb-2"
                placeholder="Tên Công trình"
                suffix={
                  <Button
                    onClick={async () => {
                      await dispatch(
                        updateNameAltitudeApi({
                          altitudeId: altitudeBook._id,
                          name: nameEdit,
                        })
                      );
                      await setCurrentId("");
                    }}
                  >
                    <CheckOutlined />
                  </Button>
                }
                value={nameEdit}
                onChange={(e) => setNameEdit(e.target.value)}
              />
            )}
          </div>
          <Form>
            <Space>
              <InputNumber
                addonBefore="T"
                className="ml-4"
                size="large"
                value={upNumber}
                onChange={(value) => {
                  if (typeof value === "number") {
                    setUpNumber(Number(value));
                  } else {
                    setUpNumber(0);
                  }
                }}
              />
              <InputNumber
                addonBefore="G"
                className="ml-4"
                size="large"
                value={centerNumber}
                onChange={(value) => {
                  if (typeof value === "number") {
                    setCenterNumber(Number(value));
                  } else {
                    setCenterNumber(0);
                  }
                }}
              />
              <InputNumber
                addonBefore="D"
                className="ml-4"
                size="large"
                value={downNumber}
                onChange={(value) => {
                  if (typeof value === "number") {
                    setDownNumber(Number(value));
                  } else {
                    setDownNumber(0);
                  }
                }}
              />
              <Input
                className="mb-2"
                placeholder="Ghi chú"
                prefix={`${altitudeBook?.orientationLst?.length + 1} - `}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <div className="grid grid-cols-3 mb-4">
                <p
                  className={
                    Math.abs(
                      calculateAccuracy(upNumber, centerNumber, downNumber)
                    ) > 1.5
                      ? "text-red-400"
                      : ""
                  }
                >
                  <span>Sai số: </span>
                  <span>
                    {calculateAccuracy(upNumber, centerNumber, downNumber)}
                  </span>
                </p>
                <p>
                  <span>KC: </span>
                  <span>{calculateDistance(upNumber, downNumber)}m</span>
                </p>
                <p>
                  <span>KCCD: </span>
                  <span>{calculateCumulativeDistance()}m</span>
                </p>
              </div>
              <Button
                disabled={checkDisableBtnAdd()}
                onClick={async () => {
                  const response = await dispatch(
                    createOrientationApi({
                      altitudeId: param.id ? param.id : "",
                      orientDto: {
                        note,
                        upNumber,
                        centerNumber,
                        downNumber,
                        isStart: true,
                      },
                    })
                  );
                  if (response.meta.requestStatus === "fulfilled") {
                    setNote("");
                    setUpNumber(0);
                    setCenterNumber(0);
                    setDownNumber(0);
                  }
                }}
              >
                Thêm mia trước
              </Button>
              <Button
                disabled={checkDisableBtnAdd()}
                onClick={async () => {
                  const response = await dispatch(
                    createOrientationApi({
                      altitudeId: param.id ? param.id : "",
                      orientDto: {
                        note,
                        upNumber,
                        centerNumber,
                        downNumber,
                        isStart: false,
                      },
                    })
                  );
                  if (response.meta.requestStatus === "fulfilled") {
                    setNote("");
                  }
                }}
              >
                Thêm mia sau
              </Button>
              <Button
                onClick={() => {
                  let renderText = ``;
                  altitudeBook.orientationLst.forEach((ori, oriIndex) => {
                    if (ori.isStart === true) {
                      renderText += `${formatText(
                        String(oriIndex + 1),
                        5
                      )}\t${formatText(String(ori.upNumber), 5)}\t${formatText(
                        String(ori.centerNumber),
                        5
                      )}\t${formatText(String(ori.downNumber), 5)}\t${
                        ori.note
                      }\n`;
                    } else {
                      renderText += `${formatText(
                        String(" "),
                        5
                      )}\t${formatText(String(ori.upNumber), 5)}\t${formatText(
                        String(ori.centerNumber),
                        5
                      )}\t${formatText(String(ori.downNumber), 5)}\t${
                        ori.note
                      }\n`;
                    }
                  });
                  saveAs(renderText, `${altitudeBook.nameStructure}.sldc`);
                }}
              >
                Lưu
              </Button>
              <Button>Tính toán</Button>
            </Space>
          </Form>
          <div>
            <div className="grid grid-cols-6 border-b-2 font-bold">
              <p className="col-span-1">STT</p>
              <p className="col-span-4">Ghi chú</p>
              <p className="col-span-1">Gương</p>
            </div>
            <DndContext
              onDragEnd={(event) => {
                if (event.over?.id) {
                  dispatch(
                    swapOrientationAltitudeApi({
                      altitudeId: altiId,
                      orientationId1: event.active.id.toString(),
                      orientationId2: event.over.id.toString(),
                    })
                  );
                }
              }}
              sensors={sensors}
            >
              <SortableContext
                key={altiId}
                items={altitudeBook?.orientationLst.map((orient) =>
                  orient._id.toString()
                )}
              >
                {altitudeBook?.orientationLst.map((orient, index) => {
                  return (
                    <AltitudeOrientation
                      key={orient._id}
                      altId={altiId}
                      orient={orient}
                      index={index}
                    />
                  );
                })}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default AltitudeBookDetail;
