import { Button, Col, Input, Row } from "antd";
import React, { useState } from "react";
import { openNotificationWithIcon } from "../../untils/operate/notify";
const { TextArea } = Input;
type Props = {};
interface DataModel {
  topNumber: number;
  centerNumber: number;
  bottomNumber: number;
  distance: number;
}
const EqualBook = (props: Props) => {
  const [inputDoc, setInputDoc] = useState<string>("");
  const [outputDoc, setOutputDoc] = useState<DataModel[]>([]);
  let totalDistance: number = 0;
  let totalAltitude: number = 0;
  return (
    <div>
      <h1>In sổ</h1>
      <Row gutter={16}>
        <Col span={12}>
          <TextArea
            autoSize
            value={inputDoc}
            onChange={(e) => {
              setInputDoc(e.target.value);
            }}
          />
        </Col>
        <Col span={12}>
          <Button
            onClick={() => {
              let tempOutput: DataModel[] = [];
              const arrInput: string[] = inputDoc.split("\n");

              if (arrInput.length % 2 === 0) {
                for (let item = 0; item < arrInput.length; item += 2) {
                  let str1 = arrInput[item].split("\t");
                  let str2 = arrInput[item + 1].split("\t");
                  let distance: number =
                    (Number(str1[0]) - Number(str1[2])) / 10 +
                    (Number(str2[0]) - Number(str2[2])) / 10;
                  let randomNumber = Math.random() * 5 - 2.5;
                  let preDis = distance / 2 + randomNumber;
                  let sufDis = distance - preDis;
                  tempOutput.push(
                    {
                      topNumber: Number(
                        (Number(str1[1]) + preDis * 5).toFixed(0)
                      ),
                      centerNumber: Number(str1[1]),
                      bottomNumber: Number(
                        (Number(str1[1]) - preDis * 5).toFixed(0)
                      ),
                      distance: preDis,
                    },
                    {
                      topNumber: Number(
                        (Number(str2[1]) + sufDis * 5).toFixed(0)
                      ),
                      centerNumber: Number(str2[1]),
                      bottomNumber: Number(
                        (Number(str2[1]) + sufDis * 5).toFixed(0)
                      ),
                      distance: sufDis,
                    }
                  );
                  totalDistance += preDis + sufDis;
                  totalAltitude += preDis - sufDis;
                  setOutputDoc(tempOutput);
                }
              } else {
                openNotificationWithIcon(
                  "error",
                  "Số điểm không chẵn",
                  arrInput.length.toString()
                );
              }
            }}
          >
            Chuyển
          </Button>
          <div>
            {outputDoc.map((outItem, index) => {
              return (
                <div className="grid grid-cols-4">
                  <p>{outItem.topNumber}</p>
                  <p>{outItem.centerNumber}</p>
                  <p>{outItem.bottomNumber}</p>
                  <p>{outItem.distance.toFixed(1)}</p>
                </div>
              );
            })}
            <p>Tổng KC: {totalDistance}</p>
            <p>Tổng chênh KC: {totalAltitude}</p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default EqualBook;
