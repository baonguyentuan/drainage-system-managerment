import { BlockCad } from "../untils/operate/sections/blocksSection";
import {
  ArcCad,
  AttdefCad,
  AttribCad,
  CircleCad,
  HatchCad,
  InsertBlockCad,
  PathCad,
  TextCad,
} from "../untils/operate/sections/entitiesSection";
import {
  LayerCad,
  TextStyleCad,
} from "../untils/operate/sections/tablesSection";

export interface BlockPropertiesModel {
  blockName: string;
  layerName: string;
  basePoint: PointModel;
  xrefPathName: string;
  blockDescripstion: string;
  blockStatus: number;
}
export interface PointModel {
  pX: number;
  pY: number;
  pZ: number;
}
export interface ElevationPointModel {
  epX: number;
  epY: number;
  epZ: number;
  status: boolean;
}
export interface ScaleFactorModel {
  sfX: number;
  sfY: number;
  sfZ: number;
}
export interface BlockPropertiesModel {
  blockName: string;
  layerName: string;
  basePoint: PointModel;
  xrefPathName: string;
  blockDescripstion: string;
  blockStatus: number;
}
export interface DxfObjectModel {
  lstText: TextCad[];
  lstPolygon: HatchCad[];
  lstPath: PathCad[];
  lstCircle: CircleCad[];
  lstArc: ArcCad[];
  lstTextStyle: TextStyleCad[];
  lstLayer: LayerCad[];
  lstBlock: BlockCad[];
  lstInsert: InsertBlockCad[];
  lstAttDef: AttdefCad[];
  lstAttRib: AttribCad[];
}
export interface PathStyleModel {
  namePathStyle: string;
  layerName: string;
  color: number;
  lineweight: number;
}
export interface PolygonStyleModel {
  namePolygonStyle: string;
  layerName: string;
  color: number;
  patternScale: number;
}
export interface PolygonStyleModel {
  namePolygonStyle: string;
  layerName: string;
  color: number;
  patternScale: number;
}
export interface PlacemarkStyleModel {
  namePlacemarkStyle: string;
  layerName: string;
  color: number;
  scale: number;
  icon: string;
}
export interface StyleObjectModel {
  lstPathStyle: PathStyleModel[];
  lstPolygonStyle: PolygonStyleModel[];
  lstPlacemarkStyle: PathStyleModel[];
}
export interface InsertBlockObjectModel{
  insertPoint:PointModel, 
  basePoint:PointModel, 
  scaleFactor:ScaleFactorModel, 
  rotationAngle:number
}