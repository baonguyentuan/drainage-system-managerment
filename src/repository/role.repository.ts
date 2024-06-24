import { ROLE_DTO } from "../models/role.model";
import { API_URL, privateRequest } from "../untils/config/repository.config";

export default {
  getAll() {
    return privateRequest.get(API_URL.role.getAllRole);
  },
  getRoleById(roleId: string) {
    return privateRequest.get(`${API_URL.role.getRoleById}/${roleId}`);
  },
  createRole(roleDto: ROLE_DTO) {
    return privateRequest.post(API_URL.role.createRole, roleDto);
  },
  updateRole(roleId: string, roleDto: ROLE_DTO) {
    return privateRequest.put(`${API_URL.role.updateRole}/${roleId}`, roleDto);
  },
  deleteRole(roleId: string) {
    return privateRequest.delete(`${API_URL.role.getRoleById}/${roleId}`);
  },
};
