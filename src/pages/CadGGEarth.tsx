import { Button, Col, Row, Select, SelectProps, Upload } from "antd";
import React, { useState } from "react";
import {
  lstArc,
  lstAttDef,
  lstAttRib,
  lstBlock,
  lstCircle,
  lstInsert,
  lstLayer,
  lstPath,
  lstPolygon,
  lstText,
  lstTextStyle,
  readDxfFile,
} from "../untils/operate/readFile/readDxf";
import { FileInfoModel } from "../models/fileModel";
import { writeKmlFile } from "../untils/operate/writeFile/writeKml";

type Props = {};
const weightOptions: SelectProps["options"] = [];
for (let i = 0; i <= 10; i++) {
  if (i === 0) {
    weightOptions.push({
      label: "Giữ nguyên",
      value: i,
    });
  } else {
    weightOptions.push({
      label: i,
      value: i,
    });
  }
}
const CadGGEarth = (props: Props) => {
  const [fileInfo, setFileInfo] = useState<FileInfoModel>({
    name: "",
    extention: "",
  });
  const [weightObj, setWeightObj] = useState<number>(0);
  return (
    <div className="p-6">
      <h1 className="font-bold text-xl mb-4">Chuyển đổi DXF - KML</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Upload
            accept=".dxf, .kml"
            multiple={false}
            maxCount={1}
            showUploadList={true}
            beforeUpload={async (file) => {
              let extFile = file.name.split(".");
              if (extFile.length >= 2) {
                setFileInfo({
                  name: extFile[0],
                  extention: extFile[1],
                });
              }
              await readDxfFile(file);
              // Prevent upload
              return false;
            }}
            onRemove={() => {
              setFileInfo({
                name: "",
                extention: "",
              });
            }}
          >
            <Button>Chọn file</Button>
          </Upload>
        </Col>
        <Col span={16}>
          {fileInfo.name !== "" ? (
            <div>
              <p>
                Loại file:{" "}
                <span className="font-semibold">
                  {`${fileInfo.extention.toLocaleUpperCase()} ==>> ${
                    fileInfo.extention === "dxf" || fileInfo.extention === "DXF"
                      ? "KML"
                      : "DXF"
                  }`}
                </span>
              </p>
              <label>Đặt toàn bộ chiều rộng của đối tượng đường: </label>
              <Select
                value={weightObj}
                style={{ width: 120 }}
                onChange={(value) => {
                  setWeightObj(value);
                }}
                options={weightOptions}
              />
            </div>
          ) : (
            ""
          )}
        </Col>
      </Row>
      <Button
        disabled={fileInfo.name !== "" ? false : true}
        onClick={() => {
          writeKmlFile(fileInfo.name, {
            lstText,
            lstTextStyle,
            lstLayer,
            lstPath,
            lstPolygon,
            lstArc,
            lstCircle,
            lstInsert,
            lstBlock,
            lstAttDef,
            lstAttRib,
          },weightObj);
        }}
      >
        Chuyển đổi
      </Button>
    </div>
  );
};

export default CadGGEarth;
