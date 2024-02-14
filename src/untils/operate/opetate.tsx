import {
  OrientationCalculateStatsModel,
  StationItemModel,
} from "../../models/bookModels";
import { PointModel } from "../../models/cadModel";
import { BOUNDARY_ORDINATE } from "../config/configCad";

export const convertBookToCalculate = (book: StationItemModel[]) => {
  let newBook: any[] = [];
  book.forEach((station, stationIndex) => {
    let newStation: OrientationCalculateStatsModel[] = [];
    station.stationStat.forEach((orientation, orientationIndex) => {
      const { idOrientation, upNumber, centerNumber, downNumber, note } =
        orientation;
      let distanceCalculate: number;
      if (upNumber === 0 && downNumber !== 0) {
        distanceCalculate = (downNumber + centerNumber) * 0.5;
      } else if (downNumber === 0 && upNumber !== 0) {
        distanceCalculate = (upNumber - centerNumber) * 0.5;
      } else if (upNumber !== 0 && downNumber !== 0) {
        distanceCalculate = (upNumber - downNumber) / 100;
      } else {
        distanceCalculate = 0;
      }
      let newOrientation: OrientationCalculateStatsModel = {
        idOrientation: idOrientation,
        upNumber: upNumber,
        downNumber: downNumber,
        centerNumber: centerNumber,
        note: note,
        distance: distanceCalculate,
        elevation: 0,
      };
      newStation.push(newOrientation);
    });
    newBook.push({
      idStation: station.idStation,
      stationStat: newStation,
    });
  });
  return newBook;
};
export const formatText = (string: string, length: number) => {
  if (string.length >= length) {
    return string;
  } else {
    let newString: string = ``;
    for (let i = 0; i < 5 - string.length; i++) {
      newString += " ";
    }
    newString += string;
    return newString;
  }
};
export const checkCoOrdinate = (ordinate: PointModel) => {
  if (
    ordinate.pX < BOUNDARY_ORDINATE[1][1] &&
    ordinate.pX > BOUNDARY_ORDINATE[2][1] &&
    ordinate.pY < BOUNDARY_ORDINATE[1][2] &&
    ordinate.pY < BOUNDARY_ORDINATE[2][2]
  ) {
    return true;
  } else {
    return false;
  }
};
