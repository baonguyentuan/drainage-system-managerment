import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";

type Props = {};
const MapCreate = (props: Props) => {
  return (
    <div>
      <MapContainer
        className="w-screen h-screen"
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
      </MapContainer>
    </div>
  );
};

export default MapCreate;
