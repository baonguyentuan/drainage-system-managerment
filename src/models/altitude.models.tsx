export interface AltitudeBookModel {
  _id: string;
  nameStructure: string;
  orientationLst: AltitudeOrientationModel[];
}
export interface AltitudeDtoModel {
  nameStructure: string;
  orientationLst: AltitudeOrientationModel[];
}
export interface AltitudeUploadDtoModel {
  nameStructure: string;
  orientationLst: AltitudeOrientationDtoModel[];
}
export interface AltitudeOrientationModel {
  _id: string;
  placemarkId: string | null;
  note: string;
  isStart: boolean;
  topNumber: number;
  centerNumber: number;
  bottomNumber: number;
}
export interface AltitudeOrientationDtoModel {
  placemarkId: string | null;
  note: string;
  isStart: boolean;
  topNumber: number;
  centerNumber: number;
  bottomNumber: number;
}
export interface AltitudePointModel {
  id: string;
  point: string;
  altitude: number;
}
