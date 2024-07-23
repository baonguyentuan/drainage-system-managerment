import {
  Button,
  Checkbox,
  Col,
  Drawer,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Space,
} from "antd";
import { useEffect, useState } from "react";
import { MeasurementStationInfoModel } from "../models/measurement.model";
import { BarsOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { closeDrawer, setPageTitle, showDrawer } from "../redux/drawer.slice";
import { RootState } from "../redux/configStore";
import {
  createMeasurementApi,
  getAllMeasurementByOrderApi,
  getMeasurementDetailApi,
  setMeasurementBook,
} from "../redux/measurement.slice";
import { useParams } from "react-router-dom";

type Props = {};
const MeasurementBookDetail = (props: Props) => {
  const param = useParams();
  const { isOpen } = useSelector((state: RootState) => state.drawerSlice);
  const { measurmentBook, measurementLst } = useSelector(
    (state: RootState) => state.measurementBookSlice
  );
  const dispatch: any = useDispatch();
  console.log(param);
  console.log(measurmentBook);

  let [note, setNote] = useState<string>("");
  let [prismDefault, setPrismDefault] = useState<number>(130);
  let [prism, setPrism] = useState<number>(prismDefault);
  let [stationInfo, setStationInfo] =
    useState<MeasurementStationInfoModel | null>(null);
  // let [hintLst, setHintLst] = useState<string[]>([]);
  const checkDisableBtnAdd = () => {
    if (note === "" || measurmentBook?.nameStructure === "") {
      return true;
    }
    return false;
  };
  useEffect(() => {
    const measurementId = param.id === undefined ? "" : param.id;
    dispatch(getMeasurementDetailApi(measurementId));
  }, []);
  return (
    <div className="h-screen w-screen p-4">
      {measurmentBook !== null ? (
        <div>
          <div>
            <Drawer
              title="Quản lý sổ đo"
              placement="left"
              onClose={() => {
                dispatch(closeDrawer());
              }}
              open={isOpen}
              key="left"
            >
              <div>
                <div className="flex justify-between">
                  {/* <Button size="large">Mở sổ đo có sẵn</Button> */}
                  <Button
                    size="large"
                    onClick={() => {
                      dispatch(
                        createMeasurementApi({
                          nameStructure: "",
                          orientationLst: [],
                        })
                      );
                    }}
                  >
                    Tạo sổ đo mới
                  </Button>
                </div>
                <div>
                  <h1 className="font-semibold my-2">Sổ đo gần đây</h1>
                  {measurementLst.map((measure) => {
                    return (
                      <p
                        key={measure._id}
                        className="border-b-2 flex justify-between cursor-pointer"
                      >
                        <span>{measure.nameStructure}</span>
                        <span>{measure.orientationLst.length} điểm</span>
                      </p>
                    );
                  })}
                </div>
              </div>
            </Drawer>
            <div className="flex">
              <Button
                onClick={() => {
                  dispatch(showDrawer({ drawerStatus: "menuBook" }));
                }}
              >
                <BarsOutlined />
              </Button>
              <h1 className="flex-1 text-center text-xl font-bold mb-4">
                Sổ đo mặt bằng : {measurmentBook.nameStructure}
              </h1>
            </div>
          </div>
          <Form>
            <Form.Item>
              {/* <Input
                placeholder="Tên công trình"
                value={measurmentBook?.nameStructure}
                onChange={(e) => {}}
              /> */}
            </Form.Item>
            <Form.Item>
              <Input
                placeholder="Ghi chú"
                prefix={`${measurmentBook?.orientationLst?.length + 1} - `}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Radio.Group
                optionType="button"
                buttonStyle="solid"
                size="large"
                value={prism}
                onChange={async (e) => {
                  // await setPrismDefault(e.target.value);
                  await setPrism(e.target.value);
                }}
                options={[
                  { label: 215, value: 215 },
                  { label: 130, value: 130 },
                  { label: 0, value: 0 },
                ]}
              />
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
            </Form.Item>
            <Form.Item>
              {stationInfo !== null ? (
                <Form>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item>
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
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item>
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
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item>
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
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              ) : (
                ""
              )}
              <Space>
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
                <Button disabled={checkDisableBtnAdd()} onClick={() => {}}>
                  Thêm điểm
                </Button>
              </Space>
            </Form.Item>
          </Form>

          <div>
            <div className="grid grid-cols-6 border-b-2 font-bold">
              <p className="col-span-1">STT</p>
              <p className="col-span-4">Ghi chú</p>
              <p className="col-span-1">Gương</p>
            </div>
            {measurmentBook?.orientationLst.map((orient, index) => {
              return (
                <div key={orient._id} className="grid grid-cols-6 border-b-2">
                  {orient.stationInfo !== null ? (
                    <div className="col-span-6 grid grid-cols-3 font-semibold">
                      <p className="">{orient.stationInfo.start}</p>
                      <p className="">{orient.stationInfo.end}</p>
                      <p className="">{orient.stationInfo.machineHeight}</p>
                    </div>
                  ) : (
                    ""
                  )}

                  <div
                    key={orient._id}
                    className="col-span-6 grid grid-cols-6 "
                  >
                    <p className="col-span-1">{orient._id}</p>
                    <p className="col-span-4 text-left">{orient.note}</p>
                    <p className="col-span-1">{orient.prismHeight}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
export default MeasurementBookDetail;
