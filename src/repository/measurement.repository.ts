import {
  MeasurementDtoModel,
  MeasurementOrientationDtoModel,
} from "../models/measurement.model";
import { OrderOptionDetail } from "../models/order.model";
import { API_URL, privateRequest } from "../untils/config/repository.config";

export default {
  getMeasurementByOrder(orderOption: OrderOptionDetail) {
    return privateRequest.get(API_URL.bookMeasurement.getBookByOrder, {
      params: orderOption,
    });
  },
  getMeasurementById(measurementId: string) {
    return privateRequest.get(
      `${API_URL.bookMeasurement.getBookById}/${measurementId}`
    );
  },
  createMeasurement(measurementDto: MeasurementDtoModel) {
    return privateRequest.post(
      API_URL.bookMeasurement.createBook,
      measurementDto
    );
  },
  updateNameMeasurement(measurementId: string, name: string) {
    return privateRequest.patch(
      `${API_URL.bookMeasurement.updateNameBook}/${measurementId}`,
      { name }
    );
  },
  swapOrientation(
    measurementId: string,
    orientationId1: string,
    orientationId2: string
  ) {
    return privateRequest.patch(
      `${API_URL.bookMeasurement.swapOrientation}/${measurementId}`,
      { orientationId1, orientationId2 }
    );
  },
  deleteMeasurement(measurementId: string) {
    return privateRequest.delete(
      `${API_URL.bookMeasurement.deleteBook}/${measurementId}`
    );
  },
  createOrientation(
    measurementId: string,
    orientationDto: MeasurementOrientationDtoModel
  ) {
    return privateRequest.post(
      `${API_URL.bookMeasurement.createOrientation}/${measurementId}`,
      orientationDto
    );
  },
  updateOrientation(
    orientationId: string,
    orientationDto: MeasurementOrientationDtoModel
  ) {
    return privateRequest.post(
      `${API_URL.bookMeasurement.updateOrientation}/${orientationId}`,
      orientationDto
    );
  },
  deleteOrientation(measurementId: string, orientationId: string) {
    return privateRequest.delete(
      `${API_URL.bookMeasurement.deleteOrientation}/${orientationId}`,
      { params: { measurementId } }
    );
  },
};
