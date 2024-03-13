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
  let [region, setRegion] = useState<string>("XNNT");
  let imgRegion: ImgRegionItem[] = [];
  let bound: LatLngTuple[] = [
    [21.019098, 105.841385],
    [21.029098, 105.851385],
  ];
  console.log(imgRegion);

  let dx = Math.abs(bound[0][0] - bound[1][0]);
  let dy = Math.abs(bound[0][1] - bound[1][1]);
  const handleMapView = async () => {
    console.log(dx, dy);
    await setIsModalOpen(false);
    await setPosition([position[0] + dx, position[1]]);
    const mapCanvas = document.getElementById("mapMain");
    if (mapCanvas) {
      const blob = await domtoimage.toBlob(mapCanvas, {
        width: mapCanvas.clientWidth,
        height: mapCanvas.clientHeight,
      });
      await saveAs(blob, `${region}-${imgRegion.length + 1}.png`);
      imgRegion.push({
        name: `${region}-${imgRegion.length + 1}`,
        northWest: bound[0],
        southEast: bound[1],
      });
    }
    if (position[0] < 21.05) {
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
        [newBound.getSouthWest().lat, newBound.getSouthWest().lng],
        [newBound.getNorthEast().lat, newBound.getNorthEast().lng],
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
                { value: "XNNT", label: "XNNT" },
                { value: "XN1", label: "XN1" },
                { value: "XN2", label: "XN2" },
                { value: "XN3", label: "XN3" },
                { value: "XN4", label: "XN4" },
                { value: "XN5", label: "XN5" },
                { value: "XN6", label: "XN6" },
                { value: "XN7", label: "XN7" },
                { value: "XN8", label: "XN8" },
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
          }, 2000);
        }}
      ></button>
    </div>
  );
};

export default CaptureMap;
