import { PointModel } from "../../models/cadModel";
import { BOUNDARY_ORDINATE } from "../config/configCad";

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
    ordinate.pX > BOUNDARY_ORDINATE.hanoi.topLeft[1] &&
    ordinate.pX < BOUNDARY_ORDINATE.hanoi.bottomRight[1] &&
    ordinate.pY < BOUNDARY_ORDINATE.hanoi.topLeft[0] &&
    ordinate.pY > BOUNDARY_ORDINATE.hanoi.bottomRight[0]
  ) {
    return true;
  } else {
    return false;
  }
};
