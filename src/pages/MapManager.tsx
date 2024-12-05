import { DivIcon } from "leaflet";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import { Drawer } from "antd";
import { KmlPlacemarkModel } from "../models/ggearthModel";
import MapControl from "../components/Map/MapControl";
import { RootState } from "../redux/configStore";
import { useDispatch, useSelector } from "react-redux";
type Props = {};
let svgPin = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#4CC9FE" height="32px" width="32px" version="1.1" id="Layer_1" viewBox="0 0 192.502 192.502" xml:space="preserve">
<g id="SVGRepo_bgCarrier" stroke-width="0"/>
<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
<g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M98,0C43.962,0,0,43.962,0,98c0,54.038,43.962,98,98,98s98-43.962,98-98C196,43.962,152.038,0,98,0z M98,189 c-50.177,0-91-40.823-91-91S47.823,7,98,7s91,40.823,91,91S148.177,189,98,189z"/> <path  d="M145.394,45.948L33.606,98.528c-1.03,0.485-1.694,1.509-1.89,2.632c-0.196,1.123,0.234,2.34,1.041,3.144 c0.656,0.656,1.547,1.025,2.474,1.025H90.67v55.439c0,0.928,0.504,1.953,1.16,2.61c0.661,0.663,1.555,1.025,2.475,1.025 c0.2,0,0.401-0.017,0.602-0.053c1.123-0.195,2.08-0.926,2.565-1.957l52.579-111.79c0.629-1.336,0.352-2.922-0.692-3.965 C148.314,45.599,146.733,45.324,145.394,45.948z M97.67,145.527V101.83c0-1.933-1.567-3.5-3.5-3.5H50.473l89.108-41.913 L97.67,145.527z"/> </g> </g> </g> </g>
</svg>`;
const MapManager = (props: Props) => {
  const { mapOption, kmlObject, position } = useSelector(
    (state: RootState) => state.mapmanagerSlice
  );
  let [curSelectedObject, setCurSelectedObject] =
    useState<KmlPlacemarkModel | null>(null);
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const foodIcon = new DivIcon({
    html: svgPin,
    iconSize: [32, 32],
    className: "bg-white rounded-full rotate-90",
  });
  function LocationMark() {
    let map = useMap();
    useEffect(() => {
      if (position.toString() !== "0,0") {
        map.flyTo(position);
      }
    }, [map]);

    return <Marker position={position} />;
  }
  return (
    <div>
      <Drawer
        title={curSelectedObject?.sub.join(" \\ ")}
        onClose={onClose}
        open={open}
        size="large"
      >
        <p>{curSelectedObject?.name}</p>
        <p>{curSelectedObject?.description}</p>
        {curSelectedObject?.imgSrc.map((img) => {
          return (
            <img
              key={img}
              src={`C:\\Users\nguye\\Documents\\${img}`}
              alt={img}
            />
          );
        })}
      </Drawer>
      <MapContainer
        id="mapMain"
        className={"w-full h-screen relative "}
        zoomControl={false}
        center={[21.019098, 105.841385]}
        zoom={16}
        minZoom={14}
        scrollWheelZoom={true}
      >
        <TileLayer
          opacity={mapOption.mapOpacity}
          attribution="Xí nghiệp khảo sát thiết kế"
          url={
            mapOption.mapType === 1
              ? "http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
              : "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          }
          subdomains={["mt1", "mt2", "mt3"]}
        />
        <LocationMark />
        {kmlObject.map((pl, index) => {
          if (pl.ordinate.length === 1 && pl.isShow) {
            return (
              <Marker
                title={pl.name}
                key={index}
                position={[pl.ordinate[0][1], pl.ordinate[0][0]]}
                icon={
                  new DivIcon({
                    html: `<p style="color:red;background-color:pink;transform:rotate(0deg);transform-origin: 50% 50%; border-radius:0.5rem;font-size:16px">${pl.name}</p>`,
                    iconSize: [pl.name.length * 10, 32],
                    className: " rounded-full ",
                  })
                }
                eventHandlers={{
                  click: () => {
                    setCurSelectedObject(pl);
                    showDrawer();
                  },
                }}
              />
            );
          } else if (pl.ordinate.length > 1 && pl.isShow) {
            return (
              <Polyline
                weight={5}
                pathOptions={{ color: `#${pl.colorLine}` }}
                key={index}
                positions={pl.ordinate.map((or) => {
                  return [or[1], or[0]];
                })}
                eventHandlers={{
                  click: () => {
                    setCurSelectedObject(pl);
                  },
                }}
              />
            );
          }
        })}
      </MapContainer>
      <MapControl />
    </div>
  );
};

export default MapManager;
