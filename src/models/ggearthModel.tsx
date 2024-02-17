export interface PlacemarkKmlModel {
  id: string;
  nameStyle: string;
  pB: number;
  pL: number;
  pH: number;
  textValue:string;
  layerName:string;
}
export interface PathKmlModel {
  id: string;
  pathName: string;
  nameStyle: string;
  layerName: string;
}
export interface PolygonKmlModel {
  id: string;
  polygonName: string;
  nameStyle: string;
  layerName: string;
}
