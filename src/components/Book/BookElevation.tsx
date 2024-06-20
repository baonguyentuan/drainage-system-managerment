import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
} from "antd";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { BarsOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import { saveAs } from "file-saver";
import React, { useState } from "react";
import {
  StationItemModel,
  OrientationStatsModel,
} from "../../models/bookModels";
import { RootState } from "../../redux/configStore";
import { setLstBookItem, setStructureName } from "../../redux/bookSlice";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import OrientationElevation from "./OrientationElevation";
import { closeDrawer, showDrawer } from "../../redux/drawer.slice";
import { openNotificationWithIcon } from "../../untils/operate/notify";
import { formatText } from "../../untils/operate/opetate";
import BookCaculation from "./BookCaculation";
type Props = {};

const defaultOrientationValue: OrientationStatsModel = {
  idOrientation: -1,
  upNumber: 0,
  centerNumber: 0,
  downNumber: 0,
  note: "",
};
const defaultStationValue: StationItemModel = {
  idStation: -1,
  stationStat: [],
};
function BookElevation({}: Props) {
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const { structureName, lstBookItem } = useSelector(
    (state: RootState) => state.bookSlice
  );
  const { isOpen } = useSelector((state: RootState) => state.drawerSlice);
  let dispatch = useDispatch();
  const formik = useFormik({
    initialValues: defaultOrientationValue,
    onSubmit: () => {},
  });
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
  const bookTag = document.getElementById("bookStation");
  const bookTagSize = window.innerHeight - 292 - 60;
  let accuracy =
    (formik.values.upNumber + formik.values.downNumber) / 2 -
    formik.values.centerNumber;
  let distance = (formik.values.upNumber - formik.values.downNumber) / 10;
  const sortStationBook = async (event: any) => {
    let activeId: number = event.active.id;
    let index: number = -1;
    lstBookItem.forEach((station, staIndex) => {
      let oriIndex = station.stationStat.findIndex(
        (orientation) => orientation.idOrientation === activeId
      );
      if (oriIndex !== -1) {
        index = staIndex;
      }
    });
    if (index !== -1) {
      let newBook = JSON.parse(JSON.stringify(lstBookItem));
      let activeIndex = lstBookItem[index].stationStat.findIndex(
        (orientation) => orientation.idOrientation === event.active.id
      );
      let overIndex = lstBookItem[index].stationStat.findIndex(
        (orientation) => orientation.idOrientation === event.over.id
      );
      newBook[index].stationStat = arrayMove(
        newBook[index].stationStat,
        activeIndex,
        overIndex
      );
      await dispatch(setLstBookItem({ lstBookItem: [...newBook] }));
    }
  };
  const renderStation = (station: StationItemModel[]) => {
    return station.map((stationItem, indexStation) => {
      return (
        <SortableContext
          key={stationItem.idStation}
          items={stationItem.stationStat.map((orient) => orient.idOrientation)}
        >
          {stationItem.stationStat.map((orientation, indexOrientation) => {
            return (
              <OrientationElevation
                key={orientation.idOrientation}
                orientation={orientation}
                index={[indexStation, indexOrientation]}
              />
            );
          })}
          {station.length > 1 ? <hr className="border-2 border-black" /> : ""}
        </SortableContext>
      );
    });
  };
  const showChildrenDrawer = () => {
    setChildrenDrawer(true);
  };

  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };
  return (
    <div className="p-4">
      <div>
        <Drawer
          size="large"
          title="Cài đặt và tính toán"
          placement="left"
          onClose={() => {
            dispatch(closeDrawer());
          }}
          open={isOpen}
          key="left"
        >
          <div>
            <Drawer
              title="Tính toán sổ đo"
              size="large"
              onClose={onChildrenDrawerClose}
              open={childrenDrawer}
            >
              <BookCaculation />
            </Drawer>
            <Button
              size="large"
              className="w-full  my-2"
              onClick={showChildrenDrawer}
            >
              Tính toán
            </Button>
            <Button
              size="large"
              className="w-full  my-2"
              onClick={async () => {
                let renderText = ``;
                lstBookItem.forEach((sta, staIndex) => {
                  sta.stationStat.forEach(
                    (ori: OrientationStatsModel, oriIndex: number) => {
                      if (oriIndex === 0) {
                        renderText += `${formatText(
                          String(staIndex + 1),
                          5
                        )}\t${formatText(
                          String(ori.upNumber),
                          5
                        )}\t${formatText(
                          String(ori.centerNumber),
                          5
                        )}\t${formatText(String(ori.downNumber), 5)}\t${
                          ori.note
                        }\n`;
                      } else {
                        renderText += `${formatText(
                          String(" "),
                          5
                        )}\t${formatText(
                          String(ori.upNumber),
                          5
                        )}\t${formatText(
                          String(ori.centerNumber),
                          5
                        )}\t${formatText(String(ori.downNumber), 5)}\t${
                          ori.note
                        }\n`;
                      }
                    }
                  );
                });
                const fileText = new Blob([renderText], { type: "text/plain" });
                await saveAs(fileText, `${structureName}.txt`);
              }}
            >
              Lưu sổ đo
            </Button>
          </div>
        </Drawer>
        <div className="flex items-center mb-4">
          <Button
            size="large"
            onClick={() => {
              dispatch(showDrawer({ drawerStatus: "menuBook" }));
            }}
          >
            <BarsOutlined />
          </Button>
          <h1 className="flex-1 text-center text-xl font-bold ">
            Số đo thủy chuẩn
          </h1>
        </div>
        <Form labelAlign="left">
          <Form.Item>
            <Input
              addonBefore="Tên công trình: "
              name="structureName"
              value={structureName}
              onChange={(event) => {
                dispatch(
                  setStructureName({ structureName: event.target.value })
                );
              }}
            />
          </Form.Item>

          <Row gutter={8}>
            <Col span={8}>
              <Form.Item>
                <InputNumber
                  className="w-full"
                  addonBefore="T: "
                  name="upNumber"
                  value={formik.values.upNumber.toString()}
                  onChange={(value) => {
                    if (value !== null) {
                      formik.setFieldValue("upNumber", value);
                    } else {
                      formik.setFieldValue("upNumber", 0);
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item>
                <InputNumber
                  className="w-full"
                  addonBefore="G:"
                  name="centerNumber"
                  value={formik.values.centerNumber}
                  onChange={(value) => {
                    if (value !== null) {
                      formik.setFieldValue("centerNumber", value);
                    } else {
                      formik.setFieldValue("centerNumber", 0);
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item>
                <InputNumber
                  className="w-full"
                  addonBefore="D:"
                  name="downNumber"
                  value={formik.values.downNumber}
                  onChange={(value) => {
                    if (value !== null) {
                      formik.setFieldValue("downNumber", value);
                    } else {
                      formik.setFieldValue("downNumber", 0);
                    }
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Input
              addonBefore="Ghi chú: "
              name="note"
              value={formik.values.note}
              onChange={(event) => {
                formik.setFieldValue("note", event.target.value);
              }}
            />
          </Form.Item>
        </Form>
        <div>
          <div className="grid grid-cols-3 mb-4">
            <p className={Math.abs(accuracy) > 1.5 ? "text-red-400" : ""}>
              <span>Sai số: </span>
              <span>{accuracy}</span>
            </p>
            <p>
              <span>KC: </span>
              <span>{distance}m</span>
            </p>
            <p>
              <span>KCCD: </span>
              <span>
                {lstBookItem
                  .reduce((acc, station) => {
                    return (
                      acc +
                      (station.stationStat[0].upNumber -
                        station.stationStat[0].downNumber) /
                        10 -
                      (station.stationStat[station.stationStat.length - 1]
                        .upNumber -
                        station.stationStat[station.stationStat.length - 1]
                          .downNumber) /
                        10
                    );
                  }, 0)
                  .toFixed(1)}
                m
              </span>
            </p>
          </div>
          <Space>
            <Button
              size="large"
              disabled={
                formik.values.centerNumber !== 0 &&
                formik.values.note.trim() !== ""
                  ? false
                  : true
              }
              onClick={async () => {
                if (formik.values.centerNumber !== 0) {
                  let orientationCurrent: OrientationStatsModel = {
                    idOrientation: Date.now(),
                    upNumber: formik.values.upNumber,
                    centerNumber: formik.values.centerNumber,
                    downNumber: formik.values.downNumber,
                    note: formik.values.note,
                  };
                  let stationUpdate: StationItemModel[] = JSON.parse(
                    JSON.stringify(lstBookItem)
                  );
                  stationUpdate[stationUpdate.length - 1].stationStat.push(
                    orientationCurrent
                  );
                  await dispatch(
                    setLstBookItem({ lstBookItem: stationUpdate })
                  );
                  await formik.resetForm();
                  bookTag?.scrollTo(0, bookTag.scrollHeight);
                }
              }}
            >
              Thêm mia sau
            </Button>
            <Button
              size="large"
              disabled={
                formik.values.centerNumber !== 0 &&
                formik.values.note.trim() !== ""
                  ? false
                  : true
              }
              onClick={async () => {
                if (
                  formik.values.centerNumber !== 0 &&
                  formik.values.note !== ""
                ) {
                  let lstUpdate = [...lstBookItem];
                  lstUpdate.push({
                    idStation: Date.now(),
                    stationStat: [
                      {
                        idOrientation: Date.now(),
                        upNumber: formik.values.upNumber,
                        centerNumber: formik.values.centerNumber,
                        downNumber: formik.values.downNumber,
                        note: formik.values.note,
                      },
                    ],
                  });
                  await dispatch(setLstBookItem({ lstBookItem: lstUpdate }));
                  await formik.resetForm();
                  bookTag?.scrollTo(0, bookTag.scrollHeight);
                } else {
                  openNotificationWithIcon(
                    "error",
                    "Bạn chưa nhập đủ ",
                    "Bạn phải nhập dây giữa hoặc ghi chú"
                  );
                }
              }}
            >
              Thêm mia trước
            </Button>
          </Space>
        </div>
      </div>

      <DndContext onDragEnd={sortStationBook} sensors={sensors}>
        <div
          id="bookStation"
          // ref={bookRef}
          style={{ height: bookTagSize }}
          className="my-2 overflow-y-scroll scroll-smooth"
        >
          {renderStation(lstBookItem)}
        </div>
      </DndContext>
    </div>
  );
}

export default BookElevation;
