import axios from "axios";
import authRepository from "../../repository/auth.repository";
import { log } from "console";
export const HTTP_STATUS_CODE = {
  succeeded: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
};
export const API_URL = {
  auth: {
    refreshToken: "auth/refresh",
    login: "auth/login",
    logout: "auth/logout",
  },
  user: {
    createUser: "user",
    updateUser: "user",
    updateUserPassword: "user/password",
    resetPassword: "user/reset/password",
    updateUserAdmin: "user/admin",
    getAllUser: "user",
    getUserById: "user",
    getUserDetail: "user/detail",
    deleteUser: "user",
  },
  role: {
    createRole: "role",
    getAllRole: "role",
    getRoleById: "role",
    deleteRole: "role",
    updateRole: "role",
  },
  endpoint: {
    createEnpoint: "endpoint",
    getAllEnpoint: "endpoint",
    getEndpointById: "endpoint",
    deleteEndpoint: "endpoint",
    updateEndpoint: "endpoint",
  },
  bookMeasurement: {
    createBook: "measurement",
    getBookByOrder: "measurement",
    getBookById: "measurement",
    deleteBook: "measurement",
    updateNameBook: "measurement/name",
    swapOrientation: "measurement/swap",
    createOrientation: "measurement",
    deleteOrientation: "measurement/orientation",
    updateOrientation: "measurement/orientation",
  },
  bookAltitude: {
    createBook: "altitude",
    getBookByOrder: "altitude",
    getBookById: "altitude",
    deleteBook: "altitude",
    updateNameBook: "altitude/name",
    swapOrientation: "altitude/swap",
    createOrientation: "altitude",
    deleteOrientation: "altitude/orientation",
    updateOrientation: "altitude/orientation",
  },
};

export const publicRequest = axios.create({
  baseURL: process.env.REACT_APP_BASE_DOMAIN,
});
export const privateRequest = axios.create({
  baseURL: process.env.REACT_APP_BASE_DOMAIN,
  headers: {
    Authorization: `Bearer ${
      localStorage.getItem("accessToken")
        ? localStorage.getItem("accessToken")
        : ""
    }`,
  },
});
privateRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);
privateRequest.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    const originRequest = error.config;
    if (error.response.status === 403) {
      const resRefresh = await authRepository.refreshToken();
      if (resRefresh.status === 201) {
        localStorage.setItem("accessToken", resRefresh.data.data);
        return privateRequest(originRequest);
      } else {
        return Promise.reject(resRefresh.data);
      }
    }
    return Promise.reject(error);
  }
);
