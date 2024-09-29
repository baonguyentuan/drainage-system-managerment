import { UserOrderOptionDetail } from "../models/order.model";
import { USER_ADMIN, USER_DTO } from "../models/user.model";
import {
  API_URL,
  privateRequest,
  publicRequest,
} from "../untils/config/repository.config";

export default {
  getAllByOrder(orderOption: UserOrderOptionDetail) {
    return privateRequest.get(API_URL.user.getAllUser, { params: orderOption });
  },
  getUserById(userId: string) {
    return privateRequest.get(`${API_URL.user.getUserById}/${userId}`);
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
  updateUserAdmin(userDto: USER_ADMIN) {
    return privateRequest.patch(
      `${API_URL.user.updateUserAdmin}/${userDto._id}`,
      { role: userDto.role, isActive: userDto.isActive }
    );
  },
};
