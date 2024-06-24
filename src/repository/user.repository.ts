import { USER_DTO } from "../models/user.model";
import {
  API_URL,
  privateRequest,
  publicRequest,
} from "../untils/config/repository.config";

export default {
  getAll() {
    return privateRequest.get(API_URL.user.getAllUser);
  },
  getUserById(userId: string) {
    return privateRequest.get(API_URL.user.getUserById, {
      params: userId,
    });
  },
  getUserDetail() {
    return privateRequest.get(API_URL.user.getUserDetail);
  },
  createUser(userDto: USER_DTO) {
    return privateRequest.post(API_URL.user.createUser, userDto);
  },
  deleteUser(userId: string) {
    return privateRequest.delete(`${API_URL.user.deleteUser}/${userId}`);
  },
};
