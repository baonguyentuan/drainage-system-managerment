import {
  Button,
  Checkbox,
  Col,
  Input,
  InputNumber,
  Popover,
  Radio,
  Row,
  Space,
} from "antd";
import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MeasurementStationInfoModel } from "../../models/measurement.model";
import {
  autocompleteList,
  autocompleteString,
} from "../../untils/operate/autocomplete";
import { saveAs } from "file-saver";
import {
  CheckOutlined,
  UnorderedListOutlined,
  CloseOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  createOrientationApi,
  updateNameMeasurementApi,
} from "../../redux/measurement.slice";
import { RootState } from "../../redux/configStore";
type Props = {};
const prismDefault = 130;
const MeasurementControl = (props: Props) => {
  const { measurmentBook } = useSelector(
    (state: RootState) => state.measurementBookSlice
  );
  const dispatch: any = useDispatch();
  let [note, setNote] = useState<string>("");
  let [editNameStatus, setEditNameStatus] = useState<boolean>(false);
  const [nameEdit, setNameEdit] = useState<string>("");
  let [prism, setPrism] = useState<number>(130);
  let [stationInfo, setStationInfo] =
    useState<MeasurementStationInfoModel | null>(null);
  const checkDisableBtnAdd = () => {
    if (note === "" || measurmentBook?.nameStructure === "") {
      return true;
    }
    return false;
  };
  return (
    <div className="fixed top-0 left-0 w-full p-2 bg-slate-200">
      {measurmentBook ? (
        <Fragment>
          <div className="flex items-center mb-2">
            <Popover
              placement="topLeft"
              title={"Autocomplete"}
              content={
                <div style={{ maxHeight: 250 }} className="overflow-y-scroll">
                  {autocompleteList.map((auto, index) => {
                    return (
                      <p className="p-2 border-b-2" key={index}>
                        {auto.label} : {auto.value}
                      </p>
                    );
                  })}
                </div>
              }
            >
              <Button className="px-2" type="link" size="large">
                <UnorderedListOutlined />
              </Button>
            </Popover>
            {editNameStatus === false ? (
              <h1
                className="flex-1 text-center text-lg font-bold"
                onClick={() => {
                  setNameEdit(measurmentBook.nameStructure);
                  setEditNameStatus(true);
                }}
              >
                Sổ đo: {measurmentBook.nameStructure}
              </h1>
            ) : (
              <Input
                placeholder="Tên Công trình"
                suffix={
                  <Space>
                    <Button
                      onClick={() => {
                        setEditNameStatus(false);
                      }}
                    >
                      <CloseOutlined />
                    </Button>
                    <Button
                      onClick={async () => {
                        await dispatch(
                          updateNameMeasurementApi({
                            measurementId: measurmentBook._id,
                            name: nameEdit,
                          })
                        );
                        await setEditNameStatus(false);
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
            <Button
              size="large"
              disabled={
                measurmentBook.orientationLst.length >= 10 ? false : true
              }
              onClick={async () => {
                let contentRender = ``;
                measurmentBook.orientationLst.forEach((orient, index) => {
                  contentRender += `${
                    index + measurmentBook.startIndex
                  }\t${orient.note.toUpperCase()}\t${orient.prismHeight}`;
                  if (orient.stationInfo !== null) {
                    contentRender += `\t${orient.stationInfo.start.toUpperCase()}\t${orient.stationInfo.end.toUpperCase()}\t${
                      orient.stationInfo.machineHeight
                    }\n`;
                  } else {
                    contentRender += `\n`;
                  }
                });
                const fileText = new Blob([contentRender], {
                  type: "text/plain",
                });
                await saveAs(fileText, `${measurmentBook.nameStructure}.txt`);
              }}
            >
              <DownloadOutlined />
            </Button>
          </div>
          <div>
            <Input
              size="large"
              className="mb-2"
              placeholder="Ghi chú"
              prefix={`${
                measurmentBook.startIndex + measurmentBook.orientationLst.length
              } - `}
              value={note}
              onChange={(e) => {
                if (e.target.value[e.target.value.length - 1] === " ") {
                  let arrValue = e.target.value.split(" ");
                  if (arrValue.length > 1) {
                    let tempStr = autocompleteString(
                      arrValue[arrValue.length - 2]
                    );
                    if (tempStr === ".") {
                      tempStr =
                        measurmentBook.orientationLst[
                          measurmentBook.orientationLst.length - 1
                        ].note;
                    }
                    arrValue[arrValue.length - 2] = tempStr;
                    setNote(autocompleteString(arrValue.join(" ")));
                  }
                } else {
                  setNote(e.target.value);
                }
              }}
            />

            <div className="grid gap-2 grid-cols-6">
              <InputNumber
                className="col-span-2 w-full"
                size="large"
                value={prism}
                onChange={(value) => {
                  if (typeof value === "number") {
                    setPrism(Number(value));
                  }
                }}
              />
              <Radio.Group
                className="col-span-4"
                options={[
                  { label: "130", value: 130 },
                  { label: "136", value: 136 },
                  { label: "215", value: 215 },
                  { label: "0", value: 0 },
                ]}
                value={prism}
                size="large"
                optionType="button"
                buttonStyle="solid"
                onChange={(e) => {
                  setPrism(e.target.value);
                }}
              />
              {stationInfo !== null ? (
                <Fragment>
                  <Input
                    className="col-span-2"
                    size="large"
                    prefix="S : "
                    value={stationInfo?.start}
                    onChange={(e) => {
                      if (stationInfo !== null) {
                        setStationInfo({
                          ...stationInfo,
                          start: e.target.value,
                        });
                      }
                    }}
                  />
                  <Input
                    className="col-span-2"
                    size="large"
                    prefix="M0 : "
                    value={stationInfo.end}
                    onChange={(e) => {
                      if (stationInfo !== null) {
                        setStationInfo({
                          ...stationInfo,
                          end: e.target.value,
                        });
                      }
                    }}
                  />
                  <InputNumber
                    size="large"
                    prefix="H : "
                    className="w-full col-span-2"
                    value={stationInfo?.machineHeight}
                    onChange={(value) => {
                      if (stationInfo !== null) {
                        setStationInfo({
                          ...stationInfo,
                          machineHeight:
                            typeof value === "number" ? Number(value) : 0,
                        });
                      }
                    }}
                  />
                </Fragment>
              ) : (
                ""
              )}
              <Checkbox
                className="items-center justify-center col-span-2 bg-blue-200 rounded-xl text-center"
                checked={stationInfo !== null ? true : false}
                onChange={(event) => {
                  if (event.target.checked) {
                    setStationInfo({
                      start: "",
                      end: "",
                      machineHeight: prismDefault,
                    });
                  } else {
                    setStationInfo(null);
                  }
                }}
              >
                Trạm máy
              </Checkbox>
              <Button
                className="col-span-4 bg-green-300"
                size="large"
                disabled={checkDisableBtnAdd()}
                onClick={async () => {
                  const response = await dispatch(
                    createOrientationApi({
                      measurementId: measurmentBook._id,
                      orientDto: [{ note, prismHeight: prism, stationInfo }],
                    })
                  );
                  if (response.meta.requestStatus === "fulfilled") {
                    await setNote("");
                    await setStationInfo(null);
                  }
                }}
              >
                Thêm điểm
              </Button>
            </div>
          </div>
        </Fragment>
      ) : (
        ""
      )}
    </div>
  );
};

export default MeasurementControl;
