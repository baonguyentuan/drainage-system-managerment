import { ENDPOINT_DTO } from "../models/endpoint.model";
import { OrderOptionDetail } from "../models/order.model";
import { API_URL, privateRequest } from "../untils/config/repository.config";

export default {
  getAllEndpointByOrder(orderOption: OrderOptionDetail) {
    return privateRequest.get(API_URL.endpoint.getAllEnpoint, {
      params: orderOption,
    });
  },
  getEndpointById(endpointId: string) {
    return privateRequest.get(
      `${API_URL.endpoint.getEndpointById}/${endpointId}`
    );
  },
  createEndpoint(endpointDto: ENDPOINT_DTO) {
    return privateRequest.post(API_URL.endpoint.createEnpoint, endpointDto);
  },
  updateEndpoint(endpointId: string, endpointDto: ENDPOINT_DTO) {
    return privateRequest.put(
      `${API_URL.endpoint.updateEndpoint}/${endpointId}`,
      endpointDto
    );
  },
  deleteEndpoint(endpointId: string) {
    return privateRequest.delete(
      `${API_URL.endpoint.deleteEndpoint}/${endpointId}`
    );
  },
};
