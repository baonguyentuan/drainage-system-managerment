import {
  Button,
  Checkbox,
  Col,
  Drawer,
  Form,
  Input,
  InputNumber,
  Popover,
  Radio,
  Row,
  Space,
} from "antd";
import { useEffect, useState } from "react";
import { MeasurementStationInfoModel } from "../models/measurement.model";
import { CheckOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { closeDrawer, showDrawer } from "../redux/drawer.slice";
import { RootState } from "../redux/configStore";
import {
  createMeasurementApi,
  createOrientationApi,
  deleteOrientationMeasurementApi,
  getMeasurementDetailApi,
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
    <div className="h-screen w-screen p-4">
      {measurmentBook !== null ? (
        <div>
          <div className="flex">
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
              placeholder="Ghi chú"
              prefix={`${measurmentBook?.orientationLst?.length + 1} - `}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            {stationInfo !== null ? (
              <Row gutter={16}>
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
                disabled={checkDisableBtnAdd()}
                onClick={async () => {
                  const response = await dispatch(
                    createOrientationApi({
                      measurementId: param.id ? param.id : "",
                      orientDto: { note, prismHeight: prism, stationInfo },
                    })
                  );
                  if (response.meta.requestStatus === "fulfilled") {
                    setNote("");
                  }
                }}
              >
                Thêm điểm
              </Button>
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
                console.log(event);
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
                      meaId={meaId}
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
export default MeasurementBookDetail;
