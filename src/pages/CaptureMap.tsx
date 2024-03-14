import { LatLng, LatLngTuple } from "leaflet";
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Rectangle,
  TileLayer,
  useMap,
} from "react-leaflet";
import { saveAs } from "file-saver";
import domtoimage from "dom-to-image";
import {
  Button,
  Col,
  Form,
  Modal,
  Radio,
  Row,
  Select,
  Slider,
  Space,
} from "antd";
import { convertWgs84ToVn2000 } from "../untils/operate/vn2000andWgs84/wgs84toVn2000";
import { DxfWriter, Units, point2d, point3d } from "@tarikjabiri/dxf";
import { CheckCircleOutlined } from "@ant-design/icons";
type Props = {};
interface ImgRegionItem {
  name: string;
  pointCenter: LatLngTuple;
}
let snapStatus: boolean = false;
const CaptureMap = (props: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  let [mapType, setMapType] = useState<number>(1);
  let [position, setPosition] = useState<LatLngTuple>([21.029098, 105.842385]);
  let [region, setRegion] = useState<string>("XNTK");
  let [zoomMap, setZoomMap] = useState<number>(16);
  let [regionCapture, setRegionCapture] = useState<LatLngTuple[]>([]);
  let [imgRegion, setImgRegion] = useState<ImgRegionItem[]>([]);
  let [bound, setBound] = useState<LatLngTuple[]>([
    [0, 0],
    [0, 0],
  ]);
  let [sizeMap, setSizeMap] = useState<number[]>([0, 0]);
  let dx = Math.abs(bound[0][0] - bound[1][0]);
  let dy = Math.abs(bound[0][1] - bound[1][1]);
  const handleMapView = async () => {
    if (position[1] <= regionCapture[1][1] - dy * 0.1) {
      setPosition([position[0], position[1] + dy * 0.95]);
      const mapCanvas = document.getElementById("mapMain");
      if (mapCanvas) {
        const blob = await domtoimage.toBlob(mapCanvas, {
          width: mapCanvas.clientWidth,
          height: mapCanvas.clientHeight,
        });
        await saveAs(blob, `${region}-${imgRegion.length + 1}.png`);
        let newLst = imgRegion;
        newLst.push({
          name: `${region}-${imgRegion.length + 1}`,
          pointCenter: position,
        });
        await setImgRegion(newLst);
      }
    } else {
      setPosition([position[0] - dx * 0.95, regionCapture[0][1]]);
      const mapCanvas = document.getElementById("mapMain");
      if (mapCanvas) {
        const blob = await domtoimage.toBlob(mapCanvas, {
          width: mapCanvas.clientWidth,
          height: mapCanvas.clientHeight,
        });
        await saveAs(blob, `${region}-${imgRegion.length + 1}.png`);
        let newLst = imgRegion;
        newLst.push({
          name: `${region}-${imgRegion.length + 1}`,
          pointCenter: position,
        });
        await setImgRegion(newLst);
      }
    }
    if (position[0] <= regionCapture[1][0] + dx * 0.1) {
      snapStatus = false;
      alert("Hoàn thành");
    }
    if (snapStatus) {
      let btnSnap = document.getElementById("btnSnapshot");
      btnSnap?.click();
    } else {
      await setIsModalOpen(true);
    }
  };
  console.log(sizeMap);

  function CaptureView({ pos, zoom }: { pos: LatLngTuple; zoom: number }) {
    const map = useMap();
    map.addEventListener("click", async (e) => {
      await setSizeMap([map.getSize().x, map.getSize().y]);
      if (regionCapture.length === 0) {
        await setRegionCapture([[e.latlng.lat, e.latlng.lng]]);
      } else if (regionCapture.length === 1) {
        let newRegion = regionCapture;
        newRegion.push([e.latlng.lat, e.latlng.lng]);
        await setRegionCapture(newRegion);
        let newBound = map.getBounds();
        await setBound([
          [newBound.getSouthWest().lat, newBound.getSouthWest().lng],
          [newBound.getNorthEast().lat, newBound.getNorthEast().lng],
        ]);

        await setPosition([
          regionCapture[0][0] - dx * 0.4,
          regionCapture[0][1],
        ]);
        await setIsModalOpen(true);
      }
    });

    useEffect(() => {
      map.setZoom(zoom);
      map.setView(pos);
    }, [map, pos, zoom]);
    return null;
  }
  return (
    <div>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={async () => {
          snapStatus = true;
          handleMapView();
        }}
        okType="danger"
        okText={"Chụp"}
      >
        <Form>
          <Form.Item>
            <Radio.Group
              options={[
                { label: "Phố", value: 0 },
                { label: "Vệ tinh", value: 1 },
              ]}
              value={mapType}
              onChange={(e) => {
                setMapType(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item label="Độ phóng">
            <Row className="items-center">
              <Col span={20}>
                <Slider
                  className="w-4/5"
                  max={18}
                  min={14}
                  value={zoomMap}
                  onChange={(value) => {
                    setZoomMap(value);
                  }}
                />
              </Col>
              <Col span={4}>
                <p>{zoomMap}</p>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                disabled={regionCapture.length === 2 ? false : true}
                onClick={async () => {
                  console.log(imgRegion);
                  const dxf = new DxfWriter();

                  dxf.setUnits(Units.Meters);
                  imgRegion.forEach((img, index) => {
                    let ordinateBotLeft = convertWgs84ToVn2000([
                      img.pointCenter[0] - dx / 2,
                      img.pointCenter[1] - dy / 2,
                      0,
                    ]);
                    let ordinateTopRight = convertWgs84ToVn2000([
                      img.pointCenter[0] + dx / 2,
                      img.pointCenter[1] + dy / 2,
                      0,
                    ]);
                    dxf.addImage(
                      "..\\" + img.name + ".png",
                      img.name,
                      point3d(ordinateBotLeft[1], ordinateBotLeft[0]),
                      sizeMap[0],
                      sizeMap[1],
                      Math.abs(ordinateBotLeft[1] - ordinateTopRight[1]),
                      0
                    );
                  });
                  const dxfString = dxf.stringify();
                  console.log(dxfString);
                  let newBlob = new Blob([dxfString], {
                    type: "text/plain;charset=utf-8",
                  });
                  await saveAs(newBlob, `${region}.dxf`);
                }}
              >
                Lưu tệp
              </Button>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                Chọn vùng chụp
              </Button>
            </Space>
            <div>
              {regionCapture.map((corner, index) => {
                return (
                  <p key={index}>
                    {corner[0]} | {corner[1]}
                  </p>
                );
              })}
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <MapContainer
        id="mapMain"
        className={"w-full h-screen col-span-3"}
        zoomControl={false}
        center={[position[0], position[1]]}
        zoom={16}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution="Xí nghiệp khảo sát thiết kế"
          url={
            mapType === 1
              ? "http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
              : "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          }
          // maxZoom={20}
          subdomains={["mt1", "mt2", "mt3"]}
        />
        <CaptureView pos={position} zoom={zoomMap} />
        {regionCapture.map((point, index) => {
          return <Marker key={index} position={point} />;
        })}
      </MapContainer>
      <button
        className="opacity-0 fixed"
        id="btnSnapshot"
        onClick={() => {
          setTimeout(() => {
            handleMapView();
          }, 3000);
        }}
      ></button>
    </div>
  );
};

export default CaptureMap;
