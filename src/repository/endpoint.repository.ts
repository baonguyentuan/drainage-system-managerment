import { ENDPOINT_DTO } from "../models/endpoint.model";
import { API_URL, privateRequest } from "../untils/config/repository.config";

export default {
  getAll() {
    return privateRequest.get(API_URL.endpoint.getAllEnpoint);
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
