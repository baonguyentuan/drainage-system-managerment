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
  editCalculationAltitude,
  getAltitudeDetailApi,
  swapOrientationAltitudeApi,
  updateNameAltitudeApi,
} from "../redux/altitude.slice";
import { Button, Input, InputNumber, Popover, Switch } from "antd";
import {
  CheckOutlined,
  ToolOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { SortableContext } from "@dnd-kit/sortable";
import AltitudeOrientation from "../components/Altitude/AltitudeOrientation";
import { formatText } from "../untils/operate/opetate";
import { saveAs } from "file-saver";
import {
  AltitudeOrientationDtoModel,
  AltitudePointModel,
} from "../models/altitude.models";
import { openNotificationWithIcon } from "../untils/operate/notify";
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
  const { altitudeBook, altitudeOption, calculationAltitude } = useSelector(
    (state: RootState) => state.altitudeSlice
  );
  const dispatch: any = useDispatch();
  let [altitudeDto, setAltitudeDto] = useState<AltitudeOrientationDtoModel>({
    placemarkId: null,
    note: "",
    isStart: false,
    topNumber: 0,
    centerNumber: 0,
    bottomNumber: 0,
  });
  let [baseAltitudeValue, setBaseAltitudeValue] = useState<number>(0);
  const [currentId, setCurrentId] = useState<string>("");
  const [nameEdit, setNameEdit] = useState<string>(
    altitudeBook?.nameStructure ? altitudeBook.nameStructure : ""
  );
  const areaHtml = document.getElementById("dataArea");
  let calculateAccuracy = (
    topNumber: number,
    centerNumber: number,
    bottomNumber: number
  ) => (topNumber + bottomNumber) / 2 - centerNumber;
  let calculateDistance = (topNumber: number, bottomNumber: number) =>
    (topNumber - bottomNumber) / 10;
  let calculateCumulativeDistance = () => {
    let startValue: number = 0;
    if (altitudeBook) {
      altitudeBook.orientationLst.forEach((ori, index) => {
        if (ori.isStart === true) {
          if (index > 1) {
            startValue +=
              calculateDistance(ori.topNumber, ori.bottomNumber) -
              calculateDistance(
                altitudeBook.orientationLst[index - 1].topNumber,
                altitudeBook.orientationLst[index - 1].bottomNumber
              );
          } else {
            startValue += calculateDistance(ori.topNumber, ori.bottomNumber);
          }
        }
      });
    }
    return startValue.toFixed(1);
  };
  const checkDisableBtnAdd = () => {
    if (
      altitudeDto.note === "" ||
      altitudeBook?.nameStructure === "" ||
      altitudeDto.centerNumber === 0
    ) {
      return true;
    }
    return false;
  };
  useEffect(() => {
    dispatch(getAltitudeDetailApi(altiId));
  }, [altitudeOption]);
  return (
    <div id="dataArea" className="w-screen h-screen overflow-y-scroll">
      {altitudeBook !== null ? (
        <div>
          <div className="fixed bottom-0 right-0 w-14 m-2 ">
            <Button
              size="large"
              className="border-2 border-blue-300 bg-blue-200"
              onClick={() => {
                areaHtml?.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: "smooth",
                });
              }}
            >
              <ArrowUpOutlined />
            </Button>
            <Button
              size="large"
              className="border-2 border-blue-300 bg-blue-200 mt-2"
              onClick={() => {
                areaHtml?.scrollTo({
                  top: areaHtml.scrollHeight,
                  left: 0,
                  behavior: "smooth",
                });
              }}
            >
              <ArrowDownOutlined />
            </Button>
          </div>
          <div className="fixed top-0 left-0 w-full bg-slate-300 px-2">
            <div className="flex p-2">
              <Popover
                content={
                  <div className="w-full">
                    <InputNumber
                      className="w-full"
                      size="large"
                      prefix="DC gốc: "
                      value={baseAltitudeValue}
                      onChange={(value) => {
                        if (typeof value === "number") {
                          setBaseAltitudeValue(value);
                        } else {
                          setBaseAltitudeValue(0);
                        }
                      }}
                    />
                    <Button
                      size="large"
                      className="w-full my-2"
                      onClick={() => {
                        let calLst: AltitudePointModel[] = [];
                        let currentCenterNumber: number = 0;
                        let startAltitude: AltitudePointModel = {
                          id: altitudeBook.orientationLst[0]._id,
                          altitude: baseAltitudeValue,
                          point: altitudeBook.orientationLst[0].note,
                        };
                        altitudeBook.orientationLst.forEach((ori, index) => {
                          if (ori.isStart === true) {
                            if (index === 0) {
                              currentCenterNumber = ori.centerNumber;
                              calLst.push(startAltitude);
                            } else {
                              let findIndexCalculation = calLst.findIndex(
                                (cal) => cal.point === ori.note
                              );
                              if (findIndexCalculation !== -1) {
                                currentCenterNumber = ori.centerNumber;
                                startAltitude = calLst[findIndexCalculation];
                              } else {
                                openNotificationWithIcon(
                                  "error",
                                  `${ori.note} chưa có cao độ`,
                                  ""
                                );
                              }
                            }
                          } else {
                            calLst.push({
                              id: ori._id,
                              point: ori.note,
                              altitude:
                                startAltitude.altitude +
                                currentCenterNumber -
                                ori.centerNumber,
                            });
                          }
                        });
                        dispatch(editCalculationAltitude({ pointLst: calLst }));
                      }}
                    >
                      Tính toán
                    </Button>
                    {calculationAltitude.map((cal) => {
                      return (
                        <div key={cal.id} className="grid grid-cols-2">
                          <p>{cal.point}</p>
                          <p>{cal.altitude}</p>
                        </div>
                      );
                    })}
                    <Button
                      className="w-full"
                      size="large"
                      onClick={() => {
                        let renderText = ``;
                        altitudeBook.orientationLst.forEach((ori, oriIndex) => {
                          if (ori.isStart === true) {
                            renderText += `${formatText(
                              String(oriIndex + 1),
                              5
                            )}\t${formatText(
                              String(ori.topNumber),
                              5
                            )}\t${formatText(
                              String(ori.centerNumber),
                              5
                            )}\t${formatText(String(ori.bottomNumber), 5)}\t${
                              ori.note
                            }\n`;
                          } else {
                            renderText += `${formatText(
                              String(" "),
                              5
                            )}\t${formatText(
                              String(ori.topNumber),
                              5
                            )}\t${formatText(
                              String(ori.centerNumber),
                              5
                            )}\t${formatText(String(ori.bottomNumber), 5)}\t${
                              ori.note
                            }\n`;
                          }
                        });
                        console.log(renderText);
                        const fileText = new Blob([renderText], {
                          type: "text/plain",
                        });
                        saveAs(fileText, `${altitudeBook.nameStructure}.sldc`);
                      }}
                    >
                      Lưu
                    </Button>
                  </div>
                }
              >
                <Button>
                  <ToolOutlined />
                </Button>
              </Popover>
              {currentId === "" ? (
                <h1
                  className="flex-1 text-center text-lg font-bold mb-4"
                  onClick={() => {
                    setNameEdit(altitudeBook.nameStructure);
                    setCurrentId(altitudeBook._id);
                  }}
                >
                  Sổ đo: {altitudeBook.nameStructure}
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
            <div className="grid grid-cols-3 gap-2 pb-2">
              <InputNumber
                className="col-span-1"
                addonBefore="T"
                size="large"
                value={altitudeDto.topNumber}
                onChange={(value) => {
                  if (typeof value === "number") {
                    setAltitudeDto({ ...altitudeDto, topNumber: value });
                  } else {
                    setAltitudeDto({ ...altitudeDto, topNumber: 0 });
                  }
                }}
              />
              <InputNumber
                className="col-span-1"
                addonBefore="G"
                size="large"
                value={altitudeDto.centerNumber}
                onChange={(value) => {
                  if (typeof value === "number") {
                    setAltitudeDto({ ...altitudeDto, centerNumber: value });
                  } else {
                    setAltitudeDto({ ...altitudeDto, centerNumber: 0 });
                  }
                }}
              />
              <InputNumber
                className="col-span-1"
                addonBefore="D"
                size="large"
                value={altitudeDto.bottomNumber}
                onChange={(value) => {
                  if (typeof value === "number") {
                    setAltitudeDto({ ...altitudeDto, bottomNumber: value });
                  } else {
                    setAltitudeDto({ ...altitudeDto, bottomNumber: 0 });
                  }
                }}
              />
              <Input
                className="mb-2 col-span-3"
                placeholder="Ghi chú"
                value={altitudeDto.note}
                onChange={(e) =>
                  setAltitudeDto({ ...altitudeDto, note: e.target.value })
                }
              />
              <p
                className={
                  Math.abs(
                    calculateAccuracy(
                      altitudeDto.topNumber,
                      altitudeDto.centerNumber,
                      altitudeDto.bottomNumber
                    )
                  ) > 1.5
                    ? "text-red-400 "
                    : ""
                }
              >
                <span>SS: </span>
                <span>
                  {calculateAccuracy(
                    altitudeDto.topNumber,
                    altitudeDto.centerNumber,
                    altitudeDto.bottomNumber
                  )}
                </span>
              </p>
              <p>
                <span>KC: </span>
                <span>
                  {calculateDistance(
                    altitudeDto.topNumber,
                    altitudeDto.bottomNumber
                  )}
                  m
                </span>
              </p>
              <p>
                <span>KCCD: </span>
                <span>{calculateCumulativeDistance()}m</span>
              </p>
              <div>
                <span>MS</span>
                <Switch
                  className="mx-2"
                  checked={altitudeDto.isStart}
                  onChange={(value) => {
                    setAltitudeDto({ ...altitudeDto, isStart: value });
                  }}
                />
                <span>MT</span>
              </div>
              <Button
                size="large"
                disabled={checkDisableBtnAdd()}
                onClick={async () => {
                  const response = await dispatch(
                    createOrientationApi({
                      altitudeId: param.id ? param.id : "",
                      orientDtoLst: [altitudeDto],
                    })
                  );
                  if (response.meta.requestStatus === "fulfilled") {
                    setAltitudeDto({
                      placemarkId: null,
                      note: "",
                      isStart: false,
                      topNumber: 0,
                      centerNumber: 0,
                      bottomNumber: 0,
                    });
                    areaHtml?.scrollTo({
                      top: areaHtml.scrollHeight,
                      left: 0,
                      behavior: "smooth",
                    });
                  }
                }}
              >
                Thêm
              </Button>
            </div>
          </div>
          <div className="px-2">
            <div className="grid grid-cols-6 border-b-2 font-bold mt-60">
              <p className="col-span-1">Trên</p>
              <p className="col-span-1">Giữa</p>
              <p className="col-span-1">Dưới</p>
              <p className="col-span-1">KC</p>
              <p className="col-span-2">Ghi chú</p>
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
