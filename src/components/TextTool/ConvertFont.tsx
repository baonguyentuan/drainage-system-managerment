import { Button, Col, Radio, Row, Select } from "antd";
import React, { useState } from "react";
import { Input } from "antd";
import {
  convertFont,
  tcvn3TextArr,
  unicodeTextArr,
  vietTextArr,
  vniTextArr,
} from "../../untils/operate/font";

const { TextArea } = Input;
type Props = {};

const ConvertFont = (props: Props) => {
  const [inputDoc, setInputDoc] = useState("");
  const [inputFont, setInputFont] = useState("viet");
  const [outputFont, setOutputFont] = useState("tcvn3");
  const [outputDoc, setOutputDoc] = useState("");
  const [docType, setDocType] = useState("lower");
  const configFont = (fontGroup: string) => {
    if (fontGroup === "vni") {
      return vniTextArr;
    } else if (fontGroup === "tcvn3") {
      return tcvn3TextArr;
    } else if (fontGroup === "unicode") {
      return unicodeTextArr;
    } else {
      return vietTextArr;
    }
  };
  return (
    <div>
      <Row gutter={16} className="mb-4 items-center">
        <Col span={6}>
          <Select
            className="w-full"
            value={inputFont}
            options={[
              { value: "unicode", label: "Unicode" },
              { value: "tcvn3", label: "TCVN3" },
              { value: "vni", label: "VNI" },
              { value: "viet", label: "Tiếng Việt" },
            ]}
            onChange={(value) => {
              setInputFont(value);
            }}
          />
        </Col>
        <Col span={12}>
          <Radio.Group
            value={docType}
            onChange={(e) => {
              setDocType(e.target.value);
            }}
          >
            <Radio value={"lower"}>Chữ thường</Radio>
            <Radio value={"upper"}>Chữ hoa</Radio>
          </Radio.Group>
          <Button
            className="bg-blue-600 text-white hover:bg-white"
            size="large"
            onClick={() => {
              let newDoc = convertFont(
                configFont(inputFont),
                configFont(outputFont),
                inputDoc
              );
              if (docType === "upper") {
                newDoc = newDoc.toLocaleUpperCase();
              } else if (docType === "upper") {
                newDoc = newDoc.toLocaleLowerCase();
              }
              setOutputDoc(newDoc);
            }}
          >
            Chuyển đổi
          </Button>
        </Col>
        <Col span={6}>
          <Select
            className="w-full"
            value={outputFont}
            onChange={(value) => {
              setOutputFont(value);
            }}
            options={[
              { value: "unicode", label: "Unicode" },
              { value: "tcvn3", label: "TCVN3" },
              { value: "vni", label: "VNI" },
              { value: "viet", label: "Tiếng Việt" },
            ]}
          />
        </Col>
      </Row>
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
          <TextArea
            autoSize
            value={outputDoc}
            onChange={(e) => {
              setOutputDoc(e.target.value);
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ConvertFont;
