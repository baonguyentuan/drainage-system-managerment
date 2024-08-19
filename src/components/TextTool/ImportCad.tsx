import React, { useState } from "react";
import { Button, Col, Form, Input, InputNumber, Row, Select } from "antd";
import { saveAs } from "file-saver";
import { DxfWriter, point3d } from "@tarikjabiri/dxf";
const { Option } = Select;
const { TextArea } = Input;
type Props = {};
const baseOrdinate = 1000;
const baseDistance = 50;
const ImportCad = (props: Props) => {
  let [doc, setDoc] = useState<string>("");
  return (
    <div>
      <Form>
        <Form.Item>
          <TextArea
            className="my-4"
            placeholder="nhập văn bản"
            rows={10}
            onChange={(event) => {
              setDoc(event.target.value);
            }}
          />
        </Form.Item>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label={"Khoảng cách text (m)"}>
              <InputNumber
                className="w-full"
                placeholder="Nhập khoảng cách text (m)"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={"Cỡ chữ"}>
              <InputNumber className="w-full" placeholder="Nhập cỡ chữ" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={"Font chữ"}>
              <Select placeholder="Chọn font chữ" defaultValue={"unicode"}>
                <Option value="unicode">UNICODE</Option>
                <Option value="tcvn3">TCVN3</Option>
                <Option value="vni">VNI</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Button
        onClick={async () => {
          const dxf = new DxfWriter();
          doc.split("\n").forEach((text, indexText) => {
            if (text !== "") {
              text.split("\t").forEach((textItem, indexTextItem) => {
                if (indexTextItem === 0) {
                  dxf.addText(
                    point3d(
                      baseOrdinate,
                      baseOrdinate - baseDistance * indexText
                    ),
                    1.6,
                    textItem.trim(),
                    { rotation: 0 }
                  );
                } else {
                  dxf.addText(
                    point3d(
                      baseOrdinate + 25.5 * indexTextItem,
                      baseOrdinate - baseDistance * indexText
                    ),
                    1.6,
                    textItem.trim(),
                    { rotation: 0 }
                  );
                }
              });
            }
          });
          const dxfString = dxf.stringify();
          let newBlob = new Blob([dxfString], {
            type: "text/plain;charset=utf-8",
          });
          await saveAs(newBlob, `export.dxf`);
        }}
      >
        Xuất sang file CAD
      </Button>
    </div>
  );
};

export default ImportCad;
