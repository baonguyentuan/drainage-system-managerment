import { Button, Tabs, TabsProps, Upload, UploadFile } from "antd";
import React, { useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

type Props = {};

const ElevationPlacemark = (props: Props) => {
  const [imgUpload, setImgUpload] = useState<UploadFile[]>([]);
  function LocationMarker() {
    const [position, setPosition] = useState([21.019098, 105.841385]);
    const map = useMapEvents({
      click() {
        map.locate();
      },
      locationfound(e: any) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        map.flyTo(e.latlng, map.getZoom());
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
      ></Marker>
    );
  }
  const items: TabsProps["items"] = [
    {
      key: "pickMap",
      label: "Chọn điểm trên bản đồ",
      children: (
        <MapContainer
          className="w-screen"
          style={{ height: 300 }}
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
      ),
    },
    {
      key: "updoadImage",
      label: "Tải ảnh lên",
      children: (
        <div>
          <Upload
            accept=".img, .jpg, .png, .jpeg, .jpg"
            listType="picture-card"
            multiple
            showUploadList={{showPreviewIcon:false}}
            onChange={(file)=>{
              setImgUpload(file.fileList)
            }}
            beforeUpload={async () => {
              // Prevent upload
              return false;
            }}
          >
            <Button>Chọn file</Button>
          </Upload>
          <Button>Tải lên</Button>
        </div>
      ),
    },
  ];
  return (
    <div className="w-screen h-screen">
      <h1>Point name</h1>
      <Tabs defaultActiveKey="pickMap" items={items} />
    </div>
  );
};

export default ElevationPlacemark;
