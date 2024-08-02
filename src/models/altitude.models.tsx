export interface AltitudeBookModel {
  _id: string;
  nameStructure: string;
  orientationLst: AltitudeOrientationModel[];
}
export interface AltitudeDtoModel {
  nameStructure: string;
  orientationLst: AltitudeOrientationModel[];
}
export interface AltitudeOrientationModel {
  _id: string;
  note: string;
  isStart: boolean;
  upNumber: number;
  centerNumber: number;
  downNumber: number;
}
export interface AltitudeOrientationDtoModel {
  note: string;
  isStart: boolean;
  upNumber: number;
  centerNumber: number;
  downNumber: number;
}
