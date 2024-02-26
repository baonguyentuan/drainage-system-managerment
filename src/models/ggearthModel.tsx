import {
  LayerCad,
  TextStyleCad,
} from "../untils/operate/sections/tablesSection";
import { PointModel, StyleObjectModel } from "./cadModel";
export interface PlacemarkKmlModel {
  id: string;
  nameStyle: string;
  point: PointModel;
  textValue: string;
  layerName: string;
  textRotation: number;
}
export interface PathKmlModel {
  id: string;
  pathName: string;
  nameStyle: string;
  layerName: string;
  vertex: PointModel[];
}
export interface PolygonKmlModel {
  id: string;
  polygonName: string;
  nameStyle: string;
  layerName: string;
  vertex: PointModel[];
}
export interface BlockKmlModel {
  id: string;
  path: PathKmlModel[];
  polygon: PolygonKmlModel[];
  placemark: PlacemarkKmlModel[];
}
export interface KmlObjectModel {
  layer: LayerCad[];
  style: StyleObjectModel;
  textStyle: TextStyleCad[];
  path: PathKmlModel[];
  polygon: PolygonKmlModel[];
  placemark: PlacemarkKmlModel[];
  block: BlockKmlModel[];
}
export interface PlacemarkModel {
  id: string;
  name: string;
  orX: number;
  orY: number;
  orZ: number;
  icon: string;
  imgSrc: string[];
}
