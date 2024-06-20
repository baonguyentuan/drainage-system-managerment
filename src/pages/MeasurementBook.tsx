import { Button, Drawer, Form, Input, InputNumber, Radio, Space } from "antd";
import { useEffect, useState } from "react";
import {
  MeasurementStationInfoModel,
  MeasurementStationModel,
} from "../models/bookModels";
import { BarsOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { closeDrawer, setPageTitle, showDrawer } from "../redux/drawer.slice";
import { RootState } from "../redux/configStore";
type Props = {};
let count: number = 0;
const MeasurementBook = (props: Props) => {
  const { isOpen, pageTitle } = useSelector(
    (state: RootState) => state.drawerSlice
  );
  const dispatch = useDispatch();
  let [book, setBook] = useState<MeasurementStationModel[]>([]);
  let [isStation, setIsStation] = useState<boolean>(false);
  let [nameStructure, setNameStructure] = useState<string>("");
  let [note, setNote] = useState<string>("");
  let [prismDefault, setPrismDefault] = useState<number>(130);
  let [prism, setPrism] = useState<number>(prismDefault);
  let [stationInfo, setStationInfo] = useState<MeasurementStationInfoModel>({
    start: "",
    end: "",
    machineHeight: 0,
  });
  let [hintLst, setHintLst] = useState<string[]>([]);
  const checkDisableBtnAdd = () => {
    if (!isStation || note === "") {
      return true;
    }
    return false;
  };
  useEffect(() => {
    dispatch(setPageTitle({ pageTitle: "Sổ đo mặt bằng" }));
  }, [book]);
  return (
    <div className="h-screen w-screen p-4">
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
          <div className="flex justify-between">
            <Button size="large">Mở sổ đo có sẵn</Button>
            <Button size="large">Tạo sổ đo mới</Button>
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
            {pageTitle}
          </h1>
        </div>
      </div>
      <Form>
        <Form.Item>
          <Input
            placeholder="Tên công trình"
            value={nameStructure}
            onChange={(e) => setNameStructure(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Input
            placeholder="Ghi chú"
            prefix={`${count + 1} - `}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            size="large"
            value={prismDefault}
            onChange={async (e) => {
              await setPrismDefault(e.target.value);
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
          <Space>
            <Button
              disabled={checkDisableBtnAdd()}
              onClick={() => {
                let newBook = [...book];
                newBook[newBook.length - 1].orientationLst.push({
                  id: count + 1,
                  note,
                  prismHeight: prism,
                  isBase: false,
                });
                count++;
                setBook([...newBook]);
                let findNoteIndex = hintLst.findIndex((str) => str === note);
                if (findNoteIndex !== -1) {
                  setHintLst(hintLst.concat(note));
                }
                setNote("");
              }}
            >
              Thêm điểm
            </Button>
            <Button onClick={() => {}}>Kết thúc</Button>
            <Button
              onClick={() => {
                setIsStation(true);
              }}
            >
              Trạm máy
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div>
        {!isStation ? (
          <Form>
            <Form.Item>
              <Input
                prefix="Đứng máy : "
                value={stationInfo.start}
                onChange={(e) => {
                  setStationInfo({ ...stationInfo, start: e.target.value });
                }}
              />
            </Form.Item>
            <Form.Item>
              <Input
                prefix="M0 : "
                value={stationInfo.end}
                onChange={(e) => {
                  setStationInfo({ ...stationInfo, end: e.target.value });
                }}
              />
            </Form.Item>
            <Form.Item>
              <InputNumber
                prefix="Cao máy : "
                className="w-full"
                value={stationInfo.machineHeight}
                onChange={(value) => {
                  setStationInfo({
                    ...stationInfo,
                    machineHeight:
                      typeof value === "number" ? Number(value) : 0,
                  });
                }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                onClick={() => {
                  if (book.length === 0) {
                    let newStation: MeasurementStationModel = {
                      id: Date.now(),
                      stationInfo: {
                        start: stationInfo.start,
                        end: stationInfo.end,
                        machineHeight: stationInfo.machineHeight,
                      },
                      orientationLst: [],
                    };
                    book.push(newStation);
                    setBook(book);
                  } else {
                  }
                  setIsStation(true);
                }}
              >
                Xác nhận
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <div>
            <div className="grid grid-cols-6 border-b-2">
              <p className="col-span-1">STT</p>
              <p className="col-span-4">Ghi chú</p>
              <p className="col-span-1">Gương</p>
            </div>
            {book.map((station, index) => {
              return (
                <div key={station.id} className="grid grid-cols-6 border-b-2">
                  <p className="col-span-2">{station.stationInfo.start}</p>
                  <p className="col-span-2">{station.stationInfo.end}</p>
                  <p className="col-span-2">
                    {station.stationInfo.machineHeight}
                  </p>
                  {station.orientationLst.map((orient, index) => {
                    return (
                      <div
                        key={orient.id}
                        className="col-span-6 grid grid-cols-6 border-b-2"
                      >
                        <p className="col-span-1">{orient.id}</p>
                        <p className="col-span-4 text-left">{orient.note}</p>
                        <p className="col-span-1">{orient.prismHeight}</p>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default MeasurementBook;
