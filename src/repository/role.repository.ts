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
};
