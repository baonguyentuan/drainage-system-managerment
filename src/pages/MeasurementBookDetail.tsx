import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Popover,
  Row,
  Space,
} from "antd";
import { useEffect, useState } from "react";
import { MeasurementStationInfoModel } from "../models/measurement.model";
import {
  CheckOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ToolOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/configStore";
import {
  createOrientationApi,
  getMeasurementDetailApi,
  swapOrientationMeasurementApi,
  updateNameMeasurementApi,
} from "../redux/measurement.slice";
import { useParams } from "react-router-dom";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import MeasureOrientation from "../components/measurement/MeasureOrientation";
import { saveAs } from "file-saver";
import {
  autocompleteList,
  autocompleteString,
} from "../untils/operate/autocomplete";

type Props = {};
const MeasurementBookDetail = (props: Props) => {
  const param = useParams();
  const meaId = param.id === undefined ? "" : param.id;
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
  const { measurmentBook, measurementLst, measurementOption } = useSelector(
    (state: RootState) => state.measurementBookSlice
  );
  const dispatch: any = useDispatch();
  let [note, setNote] = useState<string>("");
  const [currentId, setCurrentId] = useState<string>("");
  const [nameEdit, setNameEdit] = useState<string>(
    measurmentBook?.nameStructure ? measurmentBook.nameStructure : ""
  );
  let [prismDefault, setPrismDefault] = useState<number>(130);
  let [prism, setPrism] = useState<number>(prismDefault);
  let [stationInfo, setStationInfo] =
    useState<MeasurementStationInfoModel | null>(null);
  const areaHtml = document.getElementById("dataArea");
  const checkDisableBtnAdd = () => {
    if (note === "" || measurmentBook?.nameStructure === "") {
      return true;
    }
    return false;
  };
  useEffect(() => {
    dispatch(getMeasurementDetailApi(meaId));
  }, [measurementOption]);
  return (
    <div id="dataArea" className="w-screen h-screen overflow-y-scroll">
      {measurmentBook !== null ? (
        <div>
          <div className="fixed top-0 left-0 w-full bg-slate-200">
            <div className="flex">
              <Popover
                placement="topLeft"
                title={"Autocomplete"}
                content={
                  <div style={{ maxHeight: 250 }} className="overflow-y-scroll">
                    {autocompleteList.map((auto, index) => {
                      return (
                        <p className="p-2 border-b-2">
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
              {currentId === "" ? (
                <h1
                  className="flex-1 text-center text-lg font-bold mb-4"
                  onClick={() => {
                    setNameEdit(measurmentBook.nameStructure);
                    setCurrentId(measurmentBook._id);
                  }}
                >
                  Sổ đo MB : {measurmentBook.nameStructure}
                </h1>
              ) : (
                <Input
                  className="mb-2"
                  placeholder="Tên Công trình"
                  suffix={
                    <Button
                      onClick={async () => {
                        await dispatch(
                          updateNameMeasurementApi({
                            measurementId: measurmentBook._id,
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
              <Input
                className="mb-2"
                placeholder="Ghi chú"
                prefix={`${
                  measurmentBook?.orientationLst?.length +
                  1 +
                  measurmentBook.startIndex
                } - `}
                value={note}
                onChange={(e) => {
                  if (e.target.value[e.target.value.length - 1] === " ") {
                    let arrValue = e.target.value.split(" ");
                    if (arrValue.length > 1) {
                      arrValue[arrValue.length - 2] = autocompleteString(
                        arrValue[arrValue.length - 2]
                      );
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
              <Space className="mb-2">
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
                  disabled={checkDisableBtnAdd()}
                  onClick={async () => {
                    const response = await dispatch(
                      createOrientationApi({
                        measurementId: param.id ? param.id : "",
                        orientDto: [{ note, prismHeight: prism, stationInfo }],
                      })
                    );
                    if (response.meta.requestStatus === "fulfilled") {
                      setNote("");
                      setStationInfo(null);
                    }
                  }}
                >
                  Thêm điểm
                </Button>
                <Button
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
                    await saveAs(
                      fileText,
                      `${measurmentBook.nameStructure}.txt`
                    );
                  }}
                >
                  Tải sổ đo
                </Button>
              </Space>
            </Form>
          </div>
          <div className="fixed bottom-0 right-0 w-14 m-2">
            <Button
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
            <Popover
              placement="topRight"
              trigger={"click"}
              content={
                <div style={{ maxHeight: 250 }} className="overflow-y-scroll">
                  {measurmentBook.orientationLst
                    .filter((ori) => ori.stationInfo !== null)
                    .map((ori) => {
                      return (
                        <p
                          key={ori._id}
                          className="border-b-2 p-2 hover:bg-green-200 cursor-pointer"
                          onClick={() => {
                            const selectHtml = document.getElementById(ori._id);
                            areaHtml?.scrollTo({
                              top: selectHtml?.offsetTop
                                ? selectHtml?.offsetTop - 150
                                : 100,
                              left: 0,
                              behavior: "smooth",
                            });
                          }}
                        >
                          {ori.stationInfo?.start} Mo {ori.stationInfo?.end}
                        </p>
                      );
                    })}
                </div>
              }
            >
              <Button className="border-2 border-blue-300 bg-blue-200 my-2">
                <ToolOutlined />
              </Button>
            </Popover>
            <Button
              className="border-2 border-blue-300 bg-blue-200"
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
          <div className="mt-40">
            <div className="grid grid-cols-6 border-b-2 font-bold">
              <p className="col-span-1">STT</p>
              <p className="col-span-4">Ghi chú</p>
              <p className="col-span-1">Gương</p>
            </div>
            <DndContext
              onDragEnd={(event) => {
                if (event.over?.id) {
                  if (event.active.id !== event.over.id) {
                    dispatch(
                      swapOrientationMeasurementApi({
                        measurementId: meaId,
                        orientationId1: event.active.id.toString(),
                        orientationId2: event.over.id.toString(),
                      })
                    );
                  }
                }
              }}
              sensors={sensors}
            >
              <SortableContext
                key={meaId}
                items={measurmentBook?.orientationLst.map((orient) =>
                  orient._id.toString()
                )}
              >
                {measurmentBook?.orientationLst.map((orient, index) => {
                  return (
                    <MeasureOrientation
                      key={orient._id}
                      meaId={meaId}
                      orient={orient}
                      index={index + measurmentBook.startIndex}
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
export default MeasurementBookDetail;
