import { Button, Input, InputNumber, Popover, Space, Switch } from "antd";
import React, { Fragment, useState } from "react";
import {
  AltitudeOrientationDtoModel,
  AltitudePointModel,
} from "../../models/altitude.models";
import { openNotificationWithIcon } from "../../untils/operate/notify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/configStore";
import {
  createOrientationApi,
  editCalculationAltitude,
  updateNameAltitudeApi,
} from "../../redux/altitude.slice";
import { formatText } from "../../untils/operate/opetate";
import { saveAs } from "file-saver";
import { CheckOutlined, ToolOutlined, CloseOutlined } from "@ant-design/icons";
type Props = {};

const AltitudeControl = (props: Props) => {
  const { altitudeBook, calculationAltitude } = useSelector(
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
  const [isNameEdit, setIsNameEdit] = useState<boolean>(false);
  const [nameEdit, setNameEdit] = useState<string>(
    altitudeBook?.nameStructure ? altitudeBook.nameStructure : ""
  );
  let [baseAltitudeValue, setBaseAltitudeValue] = useState<number>(0);
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
        } else {
          if (index === altitudeBook.orientationLst.length - 1) {
            startValue -= calculateDistance(ori.topNumber, ori.bottomNumber);
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
  return (
    <div className="fixed top-0 left-0 w-full bg-slate-200 px-2">
      {altitudeBook ? (
        <Fragment>
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
                    className="w-full my-2 bg-green-200"
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
                  <div className="overflow-y-scroll h-52">
                    {calculationAltitude.map((cal) => {
                      return (
                        <div
                          key={cal.id}
                          className="grid grid-cols-3 border-b-2"
                        >
                          <p className="col-span-2">{cal.point}</p>
                          <p className="col-span-1">{cal.altitude}</p>
                        </div>
                      );
                    })}
                  </div>
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
              <Button className="border-blue-400 mr-2" type="link" size="large">
                <ToolOutlined className="text-blue-500" />
              </Button>
            </Popover>
            {!isNameEdit ? (
              <h1
                className="flex-1 text-center text-lg font-bold mb-4"
                onClick={() => {
                  setNameEdit(altitudeBook.nameStructure);
                  setIsNameEdit(true);
                }}
              >
                Sổ đo: {altitudeBook.nameStructure}
              </h1>
            ) : (
              <Input
                className="mb-2"
                placeholder="Tên Công trình"
                suffix={
                  <Space>
                    <Button
                      onClick={async () => {
                        await setIsNameEdit(false);
                      }}
                    >
                      <CloseOutlined />
                    </Button>
                    <Button
                      onClick={async () => {
                        await dispatch(
                          updateNameAltitudeApi({
                            altitudeId: altitudeBook._id,
                            name: nameEdit,
                          })
                        );
                        await setIsNameEdit(false);
                      }}
                    >
                      <CheckOutlined />
                    </Button>
                  </Space>
                }
                value={nameEdit}
                onChange={(e) => setNameEdit(e.target.value)}
              />
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 pb-2 items-center">
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
              size="large"
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
            <div className="">
              <Switch
                unCheckedChildren="Mia sau"
                checkedChildren="Mia trước"
                className=" w-full h-full bg-gray-400"
                checked={altitudeDto.isStart}
                onChange={(value) => {
                  setAltitudeDto({ ...altitudeDto, isStart: value });
                }}
              />
            </div>
            <Button
              className="bg-green-200 col-span-2"
              size="large"
              disabled={checkDisableBtnAdd()}
              onClick={async () => {
                const response = await dispatch(
                  createOrientationApi({
                    altitudeId: altitudeBook._id,
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
                }
              }}
            >
              Thêm
            </Button>
          </div>
        </Fragment>
      ) : (
        ""
      )}
    </div>
  );
};

export default AltitudeControl;
