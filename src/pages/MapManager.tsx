import { LatLngTuple } from "leaflet";
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { saveAs } from "file-saver";
import domtoimage from "dom-to-image";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Slider,
  Space,
} from "antd";
import { convertWgs84ToVn2000 } from "../untils/operate/vn2000andWgs84/wgs84toVn2000";
import { DxfWriter, Units, point2d, point3d } from "@tarikjabiri/dxf";
import { openNotificationWithIcon } from "../untils/operate/notify";
type Props = {};
interface ImgRegionItem {
  name: string;
  pointCenter: LatLngTuple;
}
let snapStatus: boolean = false;
const MapManager = (props: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  let [mapType, setMapType] = useState<number>(1);
  let [position, setPosition] = useState<LatLngTuple>([21.029098, 105.842385]);
  let [region, setRegion] = useState<string>("XNKSTK");
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
  const handleMapView = async () => {};

  return (
    <div>
      <Button>Upload</Button>
      <MapContainer
        id="mapMain"
        className={"w-full h-screen col-span-3"}
        zoomControl={false}
        center={[position[0], position[1]]}
        zoom={16}
        scrollWheelZoom={true}
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

export default MapManager;
