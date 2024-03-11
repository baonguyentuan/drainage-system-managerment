import { Button, Form, Input, InputNumber, Radio, Space } from "antd";
import { useState } from "react";
import {
  MeasurementStationInfoModel,
  MeasurementStationModel,
} from "../models/bookModels";
type Props = {};
let count: number = 0;
const MeasurementBook = (props: Props) => {
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
  const checkDisableBtnAdd = () => {
    if (!isStation || note === "") {
      return true;
    }

    return false;
  };
  return (
    <div className="h-screen w-screen p-4">
      <h1>Sổ đo mặt bằng</h1>
      <div>
        <Form>
          <Form.Item label="Tên công trình">
            <Input
              value={nameStructure}
              onChange={(e) => setNameStructure(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Ghi chú">
            <Input
              prefix={`${count + 1} - `}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Cao gương">
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
                }}
              >
                Thêm điểm
              </Button>
              {isStation ? (
                <Button
                  onClick={() => {
                    setIsStation(false);
                  }}
                >
                  Kết thúc
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setIsStation(true);
                  }}
                >
                  Trạm máy
                </Button>
              )}
            </Space>
          </Form.Item>
        </Form>
      </div>
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
                        <p className="col-span-4">{orient.note}</p>
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
