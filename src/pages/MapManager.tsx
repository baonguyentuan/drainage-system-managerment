import { LatLngTuple } from "leaflet";
import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import { Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { KmlPlacemarkModel, StyleKmlModel } from "../models/ggearthModel";
import {
  FolderKmlParse,
  PlacemarkKmlParser,
  StyleKmlParser,
} from "../untils/operate/kml/kmlParser";
type Props = {};
const defaultPalcemarkValue: KmlPlacemarkModel = {
  id: "",
  name: "",
  description: "",
  sub: [],
  ordinate: [[0, 0, 0]],
  type: 0,
  icon: "",
  imgSrc: [],
};
let snapStatus: boolean = false;
const MapManager = (props: Props) => {
  let lstPlacemark: KmlPlacemarkModel[] = [];
  let lstStyle: StyleKmlModel[] = [];
  return (
    <div>
      {/* <MapContainer
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
      </MapContainer> */}
      <Upload
        className=""
        accept=".kml"
        showUploadList={false}
        beforeUpload={async (file) => {
          let subName: string[] = [];
          const reader = new FileReader();
          reader.onload = (e) => {
            let lineArr: string =
              typeof e?.target?.result === "string" ? e?.target?.result : "";
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(lineArr, "text/xml");
            const styleElementCollection = xmlDoc.getElementsByTagName("Style");
            lstStyle = StyleKmlParser(styleElementCollection);
            const fileElementCollection = xmlDoc.getElementsByTagName("Folder");
            if (fileElementCollection[0]) {
              fileElementCollection[0].childNodes.forEach((item, index) => {
                if (item.nodeName === "name" && item.textContent) {
                  subName.push(item.textContent);
                }
                if (item.nodeName === "Placemark") {
                  let newPlacemark: KmlPlacemarkModel = PlacemarkKmlParser(
                    item,
                    subName
                  );
                  lstPlacemark.push(newPlacemark);
                }
                if (item.nodeName === "Folder") {
                  item.childNodes.forEach((folderChild) => {
                    if (item.nodeName === "name" && item.textContent) {
                      subName.push(item.textContent);
                    }
                    if (folderChild.nodeName === "Placemark") {
                      let newPlacemark: KmlPlacemarkModel = PlacemarkKmlParser(
                        folderChild,
                        subName
                      );
                      lstPlacemark.push(newPlacemark);
                    }
                    if (folderChild.nodeName === "Folder") {
                      FolderKmlParse(folderChild, lstPlacemark, subName);
                    }
                  });
                }
              });
            }
            console.log("placemark", lstPlacemark);
            console.log("style", lstStyle);
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
