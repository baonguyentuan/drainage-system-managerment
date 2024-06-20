import { ROLE_DTO } from "../models/role.model";
import { API_URL, publicRequest } from "../untils/config/repository.config";

export default {
  getAll() {
    return publicRequest.get(API_URL.role.getAllRole);
  },
  getRoleById(roleId: string) {
    return publicRequest.get(API_URL.role.getRoleById, {
      params: roleId,
    });
  },
  createRole(roleDto: ROLE_DTO) {
    return publicRequest.post(API_URL.role.createRole, roleDto);
  },
  deleteRole(roleId: string) {
    return publicRequest.delete(API_URL.role.getRoleById, {
      params: roleId,
    });
  },
};
