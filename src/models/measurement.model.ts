export interface MeasurementBookModel {
  _id: string;
  nameStructure: string;
  orientationLst: MeasurementOrientationModel[];
}
export interface MeasurementDtoModel {
  nameStructure: string;
  orientationLst: MeasurementOrientationModel[];
}
export interface MeasurementOrientationModel {
  _id: string;
  note: string;
  prismHeight: number;
  stationInfo: MeasurementStationInfoModel | null;
}
export interface MeasurementOrientationDtoModel {
  note: string;
  prismHeight: number;
  stationInfo: MeasurementStationInfoModel | null;
}
export interface MeasurementStationInfoModel {
  start: string;
  end: string;
  machineHeight: number;
}
