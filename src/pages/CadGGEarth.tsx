import { Button, Col, Row, Select, SelectProps, Upload } from "antd";
import { useState } from "react";
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
import { MapContainer, Polyline, TileLayer } from "react-leaflet";
import { KmlObjectModel, PathKmlModel } from "../models/ggearthModel";
import {
  convertArcFromDxf,
  convertBlockFromDxf,
  convertCircleFromDxf,
  convertPathFromDxf,
  convertPolygonFromDxf,
  lstStyle,
} from "../untils/operate/convertObject/dxf2kml";
import { colorRGB } from "../untils/operate/color";

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
  const [kmlOject, setKmlObject] = useState<KmlObjectModel>({
    layer: [],
    style: {
      lstPathStyle: [],
      lstPolygonStyle: [],
      lstPlacemarkStyle: [],
    },
    textStyle: [],
    block: [],
    placemark: [],
    path: [],
    polygon: [],
  });
  const [kmlPath, setKmlPath] = useState<PathKmlModel[]>([]);
  return (
    <div>
      <Row>
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
              onClick={async () => {
                let KmlPath = await convertPathFromDxf(lstPath, lstLayer, null);
                let KmlArc = await convertArcFromDxf(lstArc, lstLayer, null);
                let KmlCircle = await convertCircleFromDxf(
                  lstCircle,
                  lstLayer,
                  null
                );
                let KmlPolygon = await convertPolygonFromDxf(
                  lstPolygon,
                  lstLayer,
                  null
                );
                let KmlBlock = await convertBlockFromDxf(
                  lstInsert,
                  lstBlock,
                  lstTextStyle,
                  lstLayer
                );
                await setKmlObject({
                  layer: lstLayer,
                  style: lstStyle,
                  textStyle: lstTextStyle,
                  block: KmlBlock,
                  placemark: [],
                  path: kmlPath.concat(KmlArc, KmlCircle),
                  polygon: KmlPolygon,
                });
              }}
            >
              Chuyển đổi
            </Button>
            <Button
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
              Tải file
            </Button>
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
            {kmlPath.map((pathObj, index) => {
              let styleIndex = lstStyle.lstPathStyle.findIndex(
                (st) => st.namePathStyle === pathObj.nameStyle
              );
              if (styleIndex !== -1) {
                return (
                  <Polyline
                    key={`${pathObj.id}-${index}`}
                    pathOptions={{
                      color: `rgb(${colorRGB[
                        lstStyle.lstPathStyle[styleIndex].color
                      ].join(",")})`,
                      weight: 2,
                    }}
                    positions={pathObj.vertex.map((vt, index) => {
                      return [vt.pY, vt.pX];
                    })}
                  />
                );
              }
            })}
          </MapContainer>
        </Col>
      </Row>
    </div>
  );
};

export default CadGGEarth;
