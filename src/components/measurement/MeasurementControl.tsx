import {
  Button,
  Checkbox,
  Col,
  Input,
  InputNumber,
  Popover,
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
          <div className="flex">
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
              <Button className="px-2" type="link">
                <UnorderedListOutlined />
              </Button>
            </Popover>
            {editNameStatus === false ? (
              <h1
                className="flex-1 text-center text-lg font-bold mb-4"
                onClick={() => {
                  setNameEdit(measurmentBook.nameStructure);
                  setEditNameStatus(true);
                }}
              >
                Sổ đo MB : {measurmentBook.nameStructure}
              </h1>
            ) : (
              <Input
                className="mb-2"
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
            {stationInfo !== null ? (
              <Row gutter={16} className="mb-2">
                <Col span={8}>
                  <Input
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
                </Col>
                <Col span={8}>
                  <Input
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
                </Col>
                <Col span={8}>
                  <InputNumber
                    prefix="H : "
                    className="w-full"
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
                </Col>
              </Row>
            ) : (
              ""
            )}
            <Space>
              <InputNumber
                className="ml-4"
                size="large"
                value={prism}
                onChange={(value) => {
                  if (typeof value === "number") {
                    setPrism(Number(value));
                  }
                }}
              />
              <Checkbox
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
                size="large"
                disabled={checkDisableBtnAdd()}
                onClick={async () => {
                  const areaHtml = document.getElementById("dataArea");
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
                Tải sổ đo
              </Button>
            </Space>
          </div>
        </Fragment>
      ) : (
        ""
      )}
    </div>
  );
};

export default MeasurementControl;
