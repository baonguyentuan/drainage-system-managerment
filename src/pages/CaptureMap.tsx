import { LatLngTuple } from "leaflet";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { saveAs } from "file-saver";
import domtoimage from "dom-to-image";
import { Form, Modal, Radio, Select } from "antd";
type Props = {};
interface ImgRegionItem {
  name: string;
  northWest: LatLngTuple;
  southEast: LatLngTuple;
}
const CaptureMap = (props: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  let [mapType, setMapType] = useState<number>(1);
  let [position, setPosition] = useState<LatLngTuple>([21.029098, 105.842385]);
  let [region, setRegion] = useState<number>(0);
  let [imgRegion, setImgRegion] = useState<ImgRegionItem[]>([]);
  let bound: LatLngTuple[] = [
    [21.019098, 105.841385],
    [21.029098, 105.851385],
  ];
  let dx = bound[0][0] - bound[1][0];
  let dy = bound[0][1] - bound[1][1];
  const handleMapView = async () => {
    await setIsModalOpen(false);
    await setPosition([position[0] + dx, position[1] + dy]);
    const mapCanvas = document.getElementById("mapMain");
    if (mapCanvas) {
      const blob = await domtoimage.toBlob(mapCanvas, {
        width: window.innerWidth,
        height: window.innerHeight,
      });
      await saveAs(blob, "map.png");
      let tempImgRegion = [...imgRegion];
      tempImgRegion.push({
        name: `${region}-${imgRegion.length + 1}`,
        northWest: bound[0],
        southEast: bound[1],
      });
      setImgRegion(tempImgRegion);
    }
    if (position[0] < 21.1) {
      let btnSnap = document.getElementById("btnSnapshot");
      btnSnap?.click();
    } else {
      await setIsModalOpen(true);
    }
  };

  function CaptureRectangle({ pos }: { pos: LatLngTuple }) {
    const map = useMap();
    useEffect(() => {
      map.setView(pos);
    }, pos);
    useEffect(() => {
      let newBound = map.getBounds();
      bound = [
        [newBound.getNorthWest().lat, newBound.getNorthWest().lng],
        [newBound.getSouthEast().lat, newBound.getSouthEast().lng],
      ];
    }, []);
    return null;
  }
  return (
    <div>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={() => {
          setTimeout(() => {
            handleMapView();
          }, 3000);
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
          <Form.Item label="Địa bàn">
            <Select
              className="w-full"
              options={[
                { value: 0, label: "XNNT" },
                { value: 1, label: "XN1" },
                { value: 2, label: "XN2" },
                { value: 3, label: "XN3" },
                { value: 4, label: "XN4" },
                { value: 5, label: "XN5" },
                { value: 6, label: "XN6" },
                { value: 7, label: "XN7" },
                { value: 7, label: "XN8" },
              ]}
              value={region}
              onChange={(value) => {
                setRegion(value);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>

      <MapContainer
        id="mapMain"
        className={"w-full h-screen col-span-3"}
        zoomControl={false}
        center={[position[0], position[1]]}
        zoom={16}
        scrollWheelZoom={true}
      >
        <TileLayer
          url={
            mapType === 1
              ? "http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
              : "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          }
          // maxZoom={20}
          subdomains={["mt1", "mt2", "mt3"]}
        />
        <CaptureRectangle pos={position} />
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
