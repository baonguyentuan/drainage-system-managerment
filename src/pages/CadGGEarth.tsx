import {
  Button,
  Col,
  ColorPicker,
  Row,
  Select,
  SelectProps,
  Slider,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
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
import {
  MapContainer,
  Marker,
  Polygon,
  Polyline,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
  useMapEvents,
} from "react-leaflet";
import { BlockKmlModel, KmlObjectModel } from "../models/ggearthModel";
import { divIcon } from "leaflet";
import {
  convertObjDxf2Kml,
  // lstStyle,
} from "../untils/operate/convertObject/dxf2kml";
import { colorRGB } from "../untils/operate/color";
type Props = {};
const formatter = (value: any) => `${value}`;
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
  const [position, setPosition] = useState(null);
  const getSize = () => {
    let newPositionTop = document.getElementById("layerEdit")?.offsetTop;
    if (newPositionTop) {
      return window.innerHeight - newPositionTop - 16;
    }
    return 300;
  };
  const [layHeight, setLayerHeight] = useState<number>(getSize());
  window.addEventListener("resize", () => {
    setLayerHeight(getSize());
  });
  const renderBlock = (kmlBlock: BlockKmlModel[]) => {
    return kmlBlock.map((bl, index) => {
      let blockPath = bl.path.map((bp, indexBl) => {
        return (
          <Polyline
            key={`${bp.id}-${index}`}
            pathOptions={{
              color: `rgb(255,255,255)`,
              weight: 2,
            }}
            positions={bp.vertex.map((vt, index) => {
              return [vt.pY, vt.pX];
            })}
          />
        );
      });
      let blockPolygon = bl.polygon.map((bp, indexBl) => {
        return (
          <Polygon
            key={`${bp.id}-${index}`}
            pathOptions={{
              color: `rgb(255,255,255)`,
            }}
            positions={bp.vertex.map((vt, index) => {
              return [vt.pY, vt.pX];
            })}
          />
        );
      });
      return blockPath.concat(blockPolygon);
    });
  };
  const findMax = (cur: number, com: number) => {
    if (com === 0 || cur > com) {
      return cur;
    }
    return com;
  };
  const findMin = (cur: number, com: number) => {
    if (com === 0 || cur < com) {
      return cur;
    }
    return com;
  };
  function LocationMarker() {
    const map = useMapEvents({
      click() {
        map.locate();
      },
      locationfound(e) {
        const pos = fly2Obj(kmlOject);
        map.flyTo([pos[1], pos[0]], 15);
      },
    });
    return null;
  }
  const fly2Obj = (kml: KmlObjectModel) => {
    let topLeftPostion: number[] = [0, 0];
    let bottomRightPostion: number[] = [0, 0];
    kml.path.forEach((p) => {
      p.vertex.forEach((pv) => {
        topLeftPostion[0] = findMax(pv.pX, topLeftPostion[0]);
        topLeftPostion[1] = findMin(pv.pY, topLeftPostion[1]);
        bottomRightPostion[0] = findMin(pv.pX, bottomRightPostion[0]);
        bottomRightPostion[1] = findMax(pv.pY, bottomRightPostion[1]);
      });
    });
    // kml.polygon.forEach((p) => {
    //   p.vertex.forEach((pv) => {
    //     console.log("polygon", pv);

    //     topLeftPostion[0] = findMax(pv.pX, topLeftPostion[0]);
    //     topLeftPostion[1] = findMin(pv.pY, topLeftPostion[1]);
    //     bottomRightPostion[0] = findMin(pv.pX, bottomRightPostion[0]);
    //     bottomRightPostion[1] = findMax(pv.pY, bottomRightPostion[1]);
    //   });
    // });
    kml.placemark.forEach((p) => {
      topLeftPostion[0] = findMax(p.point.pX, topLeftPostion[0]);
      topLeftPostion[1] = findMin(p.point.pY, topLeftPostion[1]);
      bottomRightPostion[0] = findMin(p.point.pX, bottomRightPostion[0]);
      bottomRightPostion[1] = findMax(p.point.pY, bottomRightPostion[1]);
    });
    return [
      (topLeftPostion[0] + bottomRightPostion[0]) / 2,
      (topLeftPostion[1] + bottomRightPostion[1]) / 2,
    ];
  };
  useEffect(() => {
    setLayerHeight(getSize());
  }, [fileInfo]);
  return (
    <div>
      <Row>
        <Col span={8}>
          <div className="m-4">
            <h1 className="font-bold text-xl mb-6">Chuyển đổi DXF - KML</h1>
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
                      fileInfo.extention === "dxf" ||
                      fileInfo.extention === "DXF"
                        ? "KML"
                        : "DXF"
                    }`}
                  </span>
                </p>
                <label>Đặt toàn bộ chiều dày của đối tượng đường: </label>
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
                  let kmlObject = await convertObjDxf2Kml({
                    lstLayer,
                    lstArc,
                    lstCircle,
                    lstPath,
                    lstText,
                    lstTextStyle,
                    lstPolygon,
                    lstInsert,
                    lstBlock,
                    lstAttDef,
                    lstAttRib,
                  });
                  await setKmlObject(kmlObject);
                  fly2Obj(kmlObject);
                }}
              >
                Xem trước
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
            <div>
              <div className="flex justify-between items-center font-semibold">
                <p className="w-1/2 text-left">Tên lớp</p>
                <p className="w-1/4 text-left">Độ dày</p>
                <p className="w-1/4 text-left">Màu</p>
              </div>
              <div
                id="layerEdit"
                className="overflow-y-scroll"
                style={{ height: layHeight }}
              >
                {kmlOject.layer.map((lay, index) => {
                  return (
                    <div
                      key={lay.layerName}
                      className="flex justify-between items-center hover:bg-orange-100"
                    >
                      <p className="w-1/2 text-left">{lay.layerName}</p>
                      <div className="w-1/4 text-left">
                        <Slider max={10} min={0} tooltip={{ formatter }} />
                      </div>
                      <div className="w-1/4 text-left">
                        <ColorPicker defaultValue="#1677ff" format="rgb" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
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
            {kmlOject.path.map((pathObj, index) => {
              let styleIndex = kmlOject.style.lstPathStyle.findIndex(
                (st) => st.namePathStyle === pathObj.nameStyle
              );
              return (
                <Polyline
                  key={`${pathObj.id}-${index}`}
                  pathOptions={{
                    color: `rgb(${colorRGB[
                      kmlOject.style.lstPathStyle[styleIndex].color
                    ].join(",")})`,
                    weight: 2,
                  }}
                  positions={pathObj.vertex.map((vt, index) => {
                    return [vt.pY, vt.pX];
                  })}
                />
              );
            })}
            {kmlOject.polygon.map((polygonObj, index) => {
              let styleIndex = kmlOject.style.lstPolygonStyle.findIndex(
                (st) => st.namePolygonStyle === polygonObj.nameStyle
              );
              return (
                <Polygon
                  key={`${polygonObj.id}-${index}`}
                  pathOptions={{
                    color: `rgb(${colorRGB[
                      kmlOject.style.lstPolygonStyle[styleIndex].color
                    ].join(",")})`,
                  }}
                  positions={polygonObj.vertex.map((vt, index) => {
                    return [vt.pY, vt.pX];
                  })}
                />
              );
            })}
            {/* {kmlOject.placemark.map((markerObj, index) => {
              return (
                <Marker
                  key={`${markerObj.id}-${index}`}
                  position={[markerObj.point.pY, markerObj.point.pX]}
                  icon={divIcon({
                    html: `<p>${markerObj.textValue}</p>`,
                    iconSize: [markerObj.textValue.length * 5, 20],
                  })}
                ></Marker>
              );
            })} */}
            {renderBlock(kmlOject.block)}
            <LocationMarker />
          </MapContainer>
        </Col>
      </Row>
    </div>
  );
};

export default CadGGEarth;
