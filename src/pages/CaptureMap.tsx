import { LatLngTuple } from "leaflet";
import React, { useState } from "react";
import {
  MapContainer,
  Rectangle,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { saveAs } from "file-saver";
import domtoimage from "dom-to-image";
type Props = {};

const CaptureMap = (props: Props) => {
  let [bound, setBound] = useState<LatLngTuple[]>([
    [21.019098, 105.841385],
    [21.029098, 105.851385],
  ]);
  function CaptureRectangle() {
    const [position, setPosition] = useState({
      _northEast: { lat: 21.02877092386811, lng: 105.85608243942262 },
      _southWest: { lat: 21.00942204192809, lng: 105.82666397094728 },
    });
    let dx = position._northEast.lat - position._southWest.lat;
    let dy = position._northEast.lng + position._southWest.lng;
    const map = useMapEvents({
      click() {
        // let bondary = map.getBounds();
        // console.log(bondary);

        setInterval(() => {
          map.flyTo(
            [
              (position._northEast.lat + position._southWest.lat) / 2,
              (position._northEast.lng + position._southWest.lng) / 2,
            ],
            16
          );
          setPosition({
            _northEast: {
              lat: position._northEast.lat,
              lng: position._northEast.lng + dy,
            },
            _southWest: {
              lat: position._southWest.lat,
              lng: position._southWest.lng + dy,
            },
          });
        }, 3000);

        // const mapCanvas = document.getElementById("mapMain");
        // if (mapCanvas) {
        //   const exportImage = async () => {
        //     await map.flyTo(
        //       [
        //         (position._northEast.lat + position._southWest.lat) / 2,
        //         (position._northEast.lng + position._southWest.lng) / 2,
        //       ],
        //       map.getZoom()
        //     );
        //     const blob = await domtoimage.toBlob(mapCanvas, {
        //       width: window.innerWidth,
        //       height: window.innerHeight,
        //     });
        //     await saveAs(blob, "map.png");
        //     await setPosition({
        //       _northEast: {
        //         lat: position._northEast.lat + dx,
        //         lng: position._northEast.lng,
        //       },
        //       _southWest: {
        //         lat: position._southWest.lat + dx,
        //         lng: position._southWest.lng,
        //       },
        //     });
        //   };
        //   exportImage();
        // }
      },
    });
    return null;
  }
  return (
    <div>
      <MapContainer
        id="mapMain"
        className={"w-full h-screen"}
        zoomControl={false}
        center={[21.019098, 105.841385]}
        zoom={16}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
          maxZoom={20}
          subdomains={["mt1", "mt2", "mt3"]}
        />
        <CaptureRectangle />
      </MapContainer>
    </div>
  );
};

export default CaptureMap;
