import { LatLngTuple } from "leaflet";
import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import { Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
type Props = {};

let snapStatus: boolean = false;
const MapManager = (props: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  let [mapType, setMapType] = useState<number>(1);
  let [position, setPosition] = useState<LatLngTuple>([21.029098, 105.842385]);
  let [bound, setBound] = useState<LatLngTuple[]>([
    [0, 0],
    [0, 0],
  ]);
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
          subdomains={["mt1", "mt2", "mt3"]}
        />
      </MapContainer>
      <Upload
        className=""
        accept=".kml"
        showUploadList={false}
        beforeUpload={async (file) => {
          let lst: string[] = [];
          const reader = new FileReader();
          reader.onload = (e) => {
            let lineArr: string =
              typeof e?.target?.result === "string" ? e?.target?.result : "";
            // lineArr.split(/\n\s/).forEach((line, lineIndex) => {
            //   lst.push(line);
            // });
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(lineArr, "text/xml");
            console.log(xmlDoc.getElementsByTagName("Folder"));
          };
          reader.readAsText(file);
          return false;
        }}
      >
        <Button size="large">
          <UploadOutlined />
        </Button>
      </Upload>
      {/* <button
        className="opacity-0 fixed"
        id="btnSnapshot"
        onClick={() => {
          setTimeout(() => {
            handleMapView();
          }, 3000);
        }}
      ></button> */}
    </div>
  );
};

export default MapManager;
