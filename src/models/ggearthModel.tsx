import {
  LayerCad,
  TextStyleCad,
} from "../untils/operate/sections/tablesSection";
import { PointModel, StyleObjectModel } from "./cadModel";

export interface PlacemarkKmlModel {
  id: string;
  nameStyle: string;
  pB: number;
  pL: number;
  pH: number;
  textValue: string;
  layerName: string;
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
