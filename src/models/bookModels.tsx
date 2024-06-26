export interface BookSliceMdel {
  structureName: string;
  lstBookItem: StationItemModel[];
}
export interface StationItemModel {
  idStation: number;
  stationStat: OrientationStatsModel[];
}
export interface OrientationStatsModel {
  idOrientation: number;
  upNumber: number;
  centerNumber: number;
  downNumber: number;
  note: string;
}
export interface StationCalculationModel {
  idStation: number;
  stationStat: OrientationCalculateStatsModel[];
}
export interface OrientationCalculateStatsModel {
  idOrientation: number;
  upNumber: number;
  centerNumber: number;
  downNumber: number;
  distance: number;
  elevation: number;
  note: string;
}
export interface ElevationPointModel {
  name: string;
  elevation: number;
}
export interface OrientationPointModel {
  name: string;
  centerNumber: number;
  elevation: number;
}
export interface AdjustPathModel {
  startPoint: string;
  endPoint: string;
  elevation: number;
  distance: number;
}

export interface MeasurementStationModel {
  id: number;
  stationInfo: MeasurementStationInfoModel;
  orientationLst: MeasurementOrientationModel[];
}
export interface MeasurementOrientationModel {
  id: number;
  note: string;
  prismHeight: number;
  isBase: boolean;
}
export interface MeasurementStationInfoModel {
  start: string;
  end: string;
  machineHeight: number;
}
