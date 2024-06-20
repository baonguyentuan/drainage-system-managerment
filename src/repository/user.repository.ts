import { USER_DTO } from "../models/user.model";
import { API_URL, publicRequest } from "../untils/config/repository.config";

export default {
  getAll() {
    return publicRequest.get(API_URL.user.getAllUser);
  },
  getUserById(userId: string) {
    return publicRequest.get(API_URL.user.getUserById, {
      params: userId,
    });
  },
  createUser(userDto: USER_DTO) {
    return publicRequest.post(API_URL.user.createUser, userDto);
  },
  deleteUser(userId: string) {
    return publicRequest.delete(`${API_URL.user.deleteUser}/${userId}`);
  },
};
