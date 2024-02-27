import {
  Button,
  Col,
  Input,
  Radio,
  Row,
  Select,
  Upload,
  UploadFile,
} from "antd";
import React, { useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { PlacemarkModel } from "../models/ggearthModel";
import { openNotificationWithIcon } from "../untils/operate/notify";
import { PictureOutlined } from "@ant-design/icons";
import { convertVn2000ToWgs84 } from "../untils/operate/vn2000andWgs84/vn2000ToWgs84";
import pointPin from "../assets/img/msn_ylw-pushpin.png";
import pointOrdinate from "../assets/img/msn_placemark_square.png";
import pointAltitude from "../assets/img/msn_placemark_circle.png";
import pointFeature from "../assets/img/msn_arrow.png";

const { TextArea } = Input;
type ImgSelected = {
  namePoint: string;
  lstImg: string[];
};
type Props = {};
const MapPoint = (props: Props) => {
  let [lstPoint, setLstPoint] = useState<PlacemarkModel[]>([]);
  let [lstImg, setLstImg] = useState<UploadFile[]>([]);
  let [iconTheme, setIconTheme] = useState<string>("msn_ylw-pushpin");
  let [typeOrdinate, setTypeOrdinate] = useState<string>("vn2000-3deg");
  let [isInputLst, setIsInputLst] = useState<boolean>(false);
  let [isInsertImg, setIsInsertImg] = useState<boolean>(false);
  let [lstImgSelected, setLstImgSelected] = useState<ImgSelected>({
    namePoint: "",
    lstImg: [],
  });
  let pointInput: string = "";
  let directoryPath: string = "";
  let pointname: string = "";
  let getLastestPosition: number[];
  if (lstPoint.length === 0) {
    getLastestPosition = [21.019098, 105.841385];
  } else {
    getLastestPosition = [
      lstPoint[lstPoint.length - 1].orX,
      lstPoint[lstPoint.length - 1].orY,
    ];
  }
  function LocationMarker() {
    const [position, setPosition] = useState(getLastestPosition);
    const map = useMapEvents({
      click() {
        map.flyTo([position[0], position[1]], map.getZoom());
      },
    });
    const eventHandlers = useMemo(
      () => ({
        dragend(e: any) {
          setPosition([e.target._latlng.lat, e.target._latlng.lng]);
        },
      }),
      []
    );
    return position === null ? null : (
      <Marker
        position={[position[0], position[1]]}
        draggable
        eventHandlers={eventHandlers}
      >
        <Popup>
          <Input
            className="mb-2"
            onChange={(e) => {
              pointname = e.target.value;
            }}
          />
          <Button
            className=" w-full "
            onClick={() => {
              let pointCreate: PlacemarkModel;
              if (pointname !== "") {
                pointCreate = {
                  id: String(`${Date.now()}-0`),
                  name: pointname,
                  orX: position[0],
                  orY: position[1],
                  orZ: 0,
                  icon: "",
                  imgSrc: [],
                };
                setLstPoint(lstPoint.concat(pointCreate));
              }
            }}
          >
            Thêm
          </Button>
        </Popup>
      </Marker>
    );
  }
  const renderIconTheme = (iconValue: string) => {
    if (iconValue === "msn_placemark_square") {
      return pointOrdinate;
    } else if (iconValue === "msn_placemark_circle") {
      return pointAltitude;
    } else if (iconValue === "msn_arrow") {
      return pointFeature;
    }
    return pointPin;
  };
  return (
    <div>
      <Row>
        <Col span={12}>
          <div className="p-4 h-screen overflow-y-scroll">
            <div className="flex justify-around my-2">
              <Button
                onClick={() => {
                  setIsInputLst(!isInputLst);
                }}
              >
                Nhập tọa độ điểm
              </Button>
              <Button
                onClick={() => {
                  setTypeOrdinate("wgs84");
                  setIsInsertImg(false);
                }}
              >
                Chọn điểm trên bản đồ
              </Button>
            </div>
            <Input
              placeholder="Đường dẫn thư mục ảnh"
              value={directoryPath}
              onChange={(e) => {
                directoryPath = e.target.value;
              }}
            />
            <div className="flex justify-around items-center">
              <Radio.Group
                className="py-2"
                value={typeOrdinate}
                options={[
                  { label: "VN2000 - 3 độ", value: "vn2000-3deg" },
                  { label: "WGS84", value: "wgs84" },
                ]}
                onChange={(e) => {
                  setTypeOrdinate(e.target.value);
                }}
              />
              <div>
                <img
                  className="inline-block mr-2"
                  width={25}
                  height={25}
                  src={renderIconTheme(iconTheme)}
                  alt={iconTheme}
                />
                <Select
                  value={iconTheme}
                  style={{ width: 120 }}
                  onChange={(value) => {
                    setIconTheme(value);
                  }}
                  options={[
                    { value: "msn_ylw-pushpin", label: "Điểm ghim" },
                    { value: "msn_placemark_square", label: "Mốc tọa độ" },
                    { value: "msn_placemark_circle", label: "Mốc độ cao" },
                    { value: "msn_arrow", label: "Điểm đặc trưng" },
                  ]}
                />
              </div>
            </div>
            <div className={`${isInputLst ? "block" : "hidden"}`}>
              <TextArea
                placeholder="Tọa độ điểm"
                rows={5}
                onChange={(e) => {
                  pointInput = e.target.value;
                }}
              />
              <Button
                className="my-2"
                onClick={() => {
                  let flag: boolean = false;
                  let arrInput: PlacemarkModel[] = pointInput
                    .trim()
                    .split("\n")
                    .map((line, index) => {
                      let newArr = line.split(/\t|\s+/);
                      if (newArr.length === 4) {
                        return {
                          id: `${Date.now()}-${index}`,
                          name: newArr[0],
                          orX: Number(newArr[1]),
                          orY: Number(newArr[2]),
                          orZ: Number(newArr[3]),
                          icon: "",
                          imgSrc: [],
                        };
                      } else if (newArr.length === 3) {
                        return {
                          id: `${Date.now()}-${index}`,
                          name: newArr[0],
                          orX: Number(newArr[1]),
                          orY: Number(newArr[2]),
                          orZ: 0,
                          icon: "",
                          imgSrc: [],
                        };
                      } else {
                        flag = true;
                        return {
                          id: `null`,
                          name: "null",
                          orX: 0,
                          orY: 0,
                          orZ: 0,
                          icon: "",
                          imgSrc: [],
                        };
                      }
                    });
                  if (!flag) {
                    setLstPoint(arrInput);
                    setIsInputLst(false);
                  } else {
                    openNotificationWithIcon(
                      "error",
                      "Sai định dạng nhập vào",
                      "format: Tendiem  X Y Z"
                    );
                  }
                }}
              >
                Xác nhận
              </Button>
            </div>
            <div>
              {lstPoint.map((point, index) => {
                return (
                  <div
                    key={point.id}
                    className={`border-b-2 py-1 hover:bg-green-100 `}
                  >
                    <Row gutter={16} className="items-center">
                      <Col span={3}>
                        <img
                          className="inline-block mr-2"
                          width={25}
                          height={25}
                          src={renderIconTheme(iconTheme)}
                          alt={iconTheme}
                        />
                      </Col>
                      <Col span={4}>
                        <p className="font-bold">{point.name}</p>
                      </Col>
                      <Col span={4}>
                        <p>{point.orX}</p>
                      </Col>
                      <Col span={4}>
                        <p>{point.orY}</p>
                      </Col>
                      <Col span={6}>
                        <p>{point.imgSrc.join(" | ")}</p>
                      </Col>
                      <Col span={3}>
                        <Button
                          onClick={() => {
                            setIsInsertImg(true);
                            setLstImgSelected({
                              namePoint: point.name,
                              lstImg: [],
                            });
                          }}
                        >
                          <PictureOutlined />
                        </Button>
                      </Col>
                    </Row>
                  </div>
                );
              })}
            </div>
            <Button
              className="m-2"
              onClick={() => {
                let newLstPoint: PlacemarkModel[];
                if (typeOrdinate === "vn2000-3deg") {
                  newLstPoint = lstPoint.map((point) => {
                    let newCoOr = convertVn2000ToWgs84([
                      point.orX,
                      point.orY,
                      point.orZ,
                    ]);
                    let nameMatch: string = point.name.split("-")[1];
                    let newListImg: string[] = [];
                    lstImg.forEach((img) => {
                      if (nameMatch === img.name.split(/[.\s]+/)[0]) {
                        newListImg.push(img.name);
                      }
                    });
                    return {
                      id: point.id,
                      imgSrc: newListImg,
                      name: point.name,
                      orX: newCoOr[0],
                      orY: newCoOr[1],
                      orZ: newCoOr[2],
                      icon: "",
                    };
                  });
                  setLstPoint(newLstPoint);
                }
              }}
            >
              Ghép ảnh theo tên điểm
            </Button>
            <Button
              onClick={() => {
                if (directoryPath !== "") {
                  let kmlContent: string = `<?xml version="1.0" encoding="UTF-8"?>
                                <kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
                                <Document>`;
                  lstPoint.forEach((p) => {
                    let renderImgSrc: string = ``;
                    p.imgSrc.forEach((i) => {
                      renderImgSrc += `<img style="max-width:500px;" src="file:///${directoryPath}\\${i}">
                                    <br/>
                                    `;
                    });
                    kmlContent += `<Placemark>
                                  <name>${p.name}</name>
                                  <description><![CDATA[${renderImgSrc}]]></description>
                                  <styleUrl>#m_ylw-pushpin</styleUrl>
                                  <Point>
                                    <gx:drawOrder>1</gx:drawOrder>
                                    <coordinates>${p.orY},${p.orX},${p.orZ}</coordinates>
                                  </Point>
                                </Placemark>`;
                  });
                  kmlContent += `</Document>
                                </kml>`;
                  let getTitle = directoryPath.split("\\");
                  const link = document.createElement("a");
                  const file = new Blob([kmlContent], { type: "text/plain" });
                  link.href = URL.createObjectURL(file);
                  link.download = `${getTitle[getTitle.length - 1]}.kml`;
                  link.click();
                  URL.revokeObjectURL(link.href);
                } else {
                  openNotificationWithIcon(
                    "error",
                    "Bạn chưa nhập đường dẫn thư mục ảnh",
                    ""
                  );
                }
              }}
            >
              Xuất ra file
            </Button>
          </div>
        </Col>
        <Col span={12}>
          <div
            className={`${
              isInsertImg ? "w-full h-screen" : "w-0 h-0"
            } overflow-y-scroll relative`}
          >
            <Button
              size="large"
              className="fixed top-4 right-4 z-10 bg-white"
              onClick={() => {
                let newlst = [...lstPoint];
                let indexPoint = newlst.findIndex(
                  (p) => p.name === lstImgSelected.namePoint
                );
                if (indexPoint !== -1) {
                  newlst[indexPoint].imgSrc = newlst[indexPoint].imgSrc.concat(
                    lstImgSelected.lstImg
                  );
                  setLstPoint([...newlst]);
                  setLstImgSelected({
                    namePoint: "",
                    lstImg: [],
                  });
                }
              }}
            >
              Nhập ảnh
            </Button>
            <Upload
              accept=".img, .jpg, .png, .jpeg, .jpg"
              multiple
              showUploadList={{ showPreviewIcon: false }}
              itemRender={() => {
                return null;
              }}
              onChange={(file) => {
                setLstImg(file.fileList);
              }}
              beforeUpload={async () => {
                // Prevent upload
                return false;
              }}
            >
              <Button className="m-2">Chọn ảnh</Button>
            </Upload>
            <Row>
              {lstImg.map((img, index) => {
                const fileBlob: Blob | undefined = img.originFileObj;
                let findIndex = lstImgSelected.lstImg.findIndex(
                  (imgSelected) => imgSelected === img.name
                );
                let checkExistImg: boolean = false;
                lstPoint.forEach((i) => {
                  i.imgSrc.forEach((s) => {
                    if (s === img.name) {
                      checkExistImg = true;
                    }
                  });
                });
                return (
                  <Col
                    span={6}
                    key={index}
                    className={`flex justify-between flex-col items-center p-2 cursor-pointer ${
                      findIndex !== -1 ? "bg-green-100" : "bg-white"
                    } ${checkExistImg ? "hidden" : "block"}`}
                    onClick={() => {
                      let newlst = { ...lstImgSelected };
                      console.log(findIndex);
                      if (findIndex !== -1) {
                        console.log("before", newlst.lstImg);
                        newlst.lstImg.splice(findIndex, 1);
                        console.log("after", newlst.lstImg);

                        setLstImgSelected(newlst);
                      } else {
                        console.log("before", newlst.lstImg);
                        newlst.lstImg = newlst.lstImg.concat(img.name);
                        console.log("after", newlst.lstImg);
                        setLstImgSelected(newlst);
                      }
                    }}
                  >
                    {fileBlob ? (
                      <img
                        className="w-full "
                        src={URL.createObjectURL(fileBlob)}
                        alt={img.name}
                      />
                    ) : (
                      ""
                    )}
                    <p className="py-1">{img.name}</p>
                  </Col>
                );
              })}
            </Row>
          </div>
          <div className={`${isInsertImg ? "w-0 h-0" : "w-auto h-auto"}`}>
            <MapContainer
              className={"w-full h-screen"}
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
              <LocationMarker />
            </MapContainer>
          </div>
        </Col>
      </Row>
      <div></div>
    </div>
  );
};

export default MapPoint;
