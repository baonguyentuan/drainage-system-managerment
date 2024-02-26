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
import pinPoint from "../assets/img/icon-1.png";
const { TextArea } = Input;
type ImgSelected = {
  namePoint: string;
  lstImg: string[];
};
type Props = {};
const MapPoint = (props: Props) => {
  let [lstPoint, setLstPoint] = useState<PlacemarkModel[]>([]);
  let [lstImg, setLstImg] = useState<UploadFile[]>([]);
  let [curInput, setCurInput] = useState<string>("");
  let [typeOrdinate, setTypeOrdinate] = useState<string>("vn2000-3deg");
  let [isInputLst, setIsInputLst] = useState<boolean>(false);
  let [isInsertImg, setIsInsertImg] = useState<boolean>(false);
  let [lstImgSelected, setLstImgSelected] = useState<ImgSelected>({
    namePoint: "",
    lstImg: [],
  });
  let [directoryPath, setDirectoryPath] = useState<string>("");
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
        // map.locate();
        map.flyTo([position[0], position[1]], map.getZoom());
      },
      // locationfound(e: any) {
      //   setPosition([e.latlng.lat, e.latlng.lng]);
      //   map.flyTo(e.latlng, map.getZoom());
      // },
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
            // value={pointname}
            onChange={(e) => {
              pointname = e.target.value;
            }}
          />
          <Button
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
                setDirectoryPath(e.target.value);
              }}
            />
            <div className="flex justify-around items-center">
              <Radio.Group
                className="py-2"
                defaultValue={typeOrdinate}
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
                  className="inline-block"
                  width={25}
                  height={25}
                  src={pinPoint}
                />
                <Select
                  defaultValue="pin"
                  style={{ width: 120 }}
                  // onChange={handleChange}
                  options={[
                    { value: "pin", label: "Điểm ghim" },
                    { value: "coOrdinate", label: "Mốc tọa độ" },
                    { value: "altitude", label: "Mốc độ cao" },
                    { value: "feature", label: "Điểm đặc trưng" },
                  ]}
                />
              </div>
            </div>
            <div className={`${isInputLst ? "block" : "hidden"}`}>
              <TextArea
                placeholder="Tọa độ điểm"
                rows={5}
                onChange={(e) => {
                  setCurInput(e.target.value);
                }}
              />
              <Button
                className="my-2"
                onClick={() => {
                  let flag: boolean = false;
                  let arrInput: PlacemarkModel[] = curInput
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
                      <Col span={4}>
                        <p>{point.name}</p>
                      </Col>
                      <Col span={5}>
                        <p>{point.orX}</p>
                      </Col>
                      <Col span={5}>
                        <p>{point.orY}</p>
                      </Col>
                      <Col span={7}>
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
                let bgcolor: string;
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
                if (findIndex !== -1) {
                  bgcolor = "green-100";
                } else {
                  bgcolor = "white";
                }
                return (
                  <Col
                    span={6}
                    key={index}
                    className={`flex justify-between flex-col items-center p-2 cursor-pointer bg-${bgcolor} ${
                      checkExistImg ? "hidden" : "block"
                    }`}
                    onClick={() => {
                      let newlst = { ...lstImgSelected };
                      if (findIndex !== -1) {
                        newlst.lstImg = newlst.lstImg.splice(findIndex, 1);
                        setLstImgSelected(newlst);
                      } else {
                        newlst.lstImg = newlst.lstImg.concat(img.name);
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
