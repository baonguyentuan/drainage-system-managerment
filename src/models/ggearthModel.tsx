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
export interface KmlPlacemarkModel {
  id: string;
  name: string;
  type: number;
  description: string;
  sub: string[];
  ordinate: number[][];
  icon: string;
  colorLabel: string;
  scaleIcon: number;
  colorIcon: string;
  scaleLabel: number;
  colorLine: string;
  scaleLine: number;
  colorPoly: string;
  outlinePoly: number;
  fillPoly: number;
  imgSrc: string[];
  isShow: boolean;
}
export interface FolderDetailModel {
  id: string;
  name: string;
  description: string;
  sub: string[];
  lstPlacemark: KmlPlacemarkModel[];
}
export interface StyleKmlModel {
  id: string;
  name: string;
  colorLabel: string;
  scaleIcon: number;
  colorIcon: string;
  scaleLabel: number;
  colorLine: string;
  scaleLine: number;
  colorPoly: string;
  outlinePoly: number;
  fillPoly: number;
  description: string;
  icon: string;
}
export interface StyleMapKmlModel {
  id: string;
  name: string;
  normal: string;
  highlight: string;
}
export interface MapOtionModel {
  mapType: number;
  mapOpacity: number;
}
