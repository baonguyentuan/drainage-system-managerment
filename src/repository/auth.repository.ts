import { USER_LOGIN_DTO } from "../models/user.model";
import { API_URL, publicRequest } from "../untils/config/repository.config";

export default {
  login(userLogin: USER_LOGIN_DTO) {
    return publicRequest.post(API_URL.auth.login, userLogin);
  },
  refreshToken() {
    return publicRequest.get(API_URL.auth.refreshToken);
  },
};
