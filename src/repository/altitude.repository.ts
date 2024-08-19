import {
  AltitudeDtoModel,
  AltitudeOrientationDtoModel,
} from "../models/altitude.models";
import { OrderOptionDetail } from "../models/order.model";
import { API_URL, privateRequest } from "../untils/config/repository.config";

export default {
  getAltitudeByOrder(orderOption: OrderOptionDetail) {
    return privateRequest.get(API_URL.bookAltitude.getBookByOrder, {
      params: orderOption,
    });
  },
  getAltitudeById(altitudeId: string) {
    return privateRequest.get(
      `${API_URL.bookAltitude.getBookById}/${altitudeId}`
    );
  },
  createAltitude(altitudeDto: AltitudeDtoModel) {
    return privateRequest.post(API_URL.bookAltitude.createBook, altitudeDto);
  },
  updateNameAltitude(altitudeId: string, name: string) {
    return privateRequest.patch(
      `${API_URL.bookAltitude.updateNameBook}/${altitudeId}`,
      { name }
    );
  },
  swapOrientation(
    altitudeId: string,
    orientationId1: string,
    orientationId2: string
  ) {
    return privateRequest.patch(
      `${API_URL.bookAltitude.swapOrientation}/${altitudeId}`,
      { orientationId1, orientationId2 }
    );
  },
  deleteAltitude(altitudeId: string) {
    return privateRequest.delete(
      `${API_URL.bookAltitude.deleteBook}/${altitudeId}`
    );
  },
  createOrientation(
    altitudeId: string,
    orientationLst: AltitudeOrientationDtoModel[]
  ) {
    return privateRequest.post(
      `${API_URL.bookAltitude.createOrientation}/${altitudeId}`,
      orientationLst
    );
  },
  updateOrientation(
    orientationId: string,
    orientationDto: AltitudeOrientationDtoModel
  ) {
    return privateRequest.patch(
      `${API_URL.bookAltitude.updateOrientation}/${orientationId}`,
      orientationDto
    );
  },
  deleteOrientation(altitudeId: string, orientationId: string) {
    return privateRequest.delete(
      `${API_URL.bookAltitude.deleteOrientation}/${orientationId}`,
      { params: { altitudeId } }
    );
  },
};
