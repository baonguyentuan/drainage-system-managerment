import React from "react";
import {
  FeatureGroup,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

type Props = {};
const MapCreate = (props: Props) => {
  // const position = [21.005, 105.89];
  return (
    <div className="">
      <MapContainer
        className="w-screen h-screen"
        center={[21.019098, 105.841385]}
        zoom={15}
        maxZoom={30}
        minZoom={5}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
          subdomains={["mt1", "mt2", "mt3"]}
        />
        <Marker position={[21.019098, 105.841383]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <Polyline
          pathOptions={{ color: "lime", weight: 5, }}
          positions={[
            [21.019098, 105.841385],
            [21.019096, 105.841387],
            [21.019100, 105.841389],
          ]}
        />
        <FeatureGroup>
          <EditControl
            position="topright"
            draw={{
              
            }}
          />
        </FeatureGroup>
      </MapContainer>
    </div>
  );
};

export default MapCreate;
