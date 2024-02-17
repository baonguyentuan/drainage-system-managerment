import { Button, Col, Row, Select, SelectProps, Upload } from "antd";
import  { useState } from "react";
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
import { MapContainer, TileLayer } from "react-leaflet";

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
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <h1 className="font-bold text-xl my-6">Chuyển đổi DXF - KML</h1>
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
          <div className="flex justify-around my-4">
            <Button
              disabled={fileInfo.name !== "" ? false : true}
              onClick={() => {
                writeKmlFile(
                  fileInfo.name,
                  {
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
                  },
                  weightObj
                );
              }}
            >
              Chuyển đổi
            </Button>
            <Button>Tải file</Button>
          </div>
        </Col>
        <Col span={16}>
          <MapContainer
            className="w-full h-screen"
            zoomControl={false}
            center={[21.019098, 105.841385]}
            zoom={15}
            scrollWheelZoom={true}
          >
            <TileLayer
              url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
              maxZoom={20}
              subdomains={["mt1", "mt2", "mt3"]}
            />
          </MapContainer>
        </Col>
      </Row>
    </div>
  );
};

export default CadGGEarth;
