import axios from "axios";
import authRepository from "../../repository/auth.repository";

// const BASE_DOMAIN = "https://draining-system-be.onrender.com";
export const API_URL = {
  auth: {
    refreshToken: "auth/refreshToken",
    login: "auth/login",
    logout: "auth/logout",
  },
  user: {
    createUser: "user",
    updateUser: "user",
    updateUserPassword: "user/update/password",
    resetPassword: "user/reset/password",
    updateUserAdmin: "user/update/admin",
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
  baseURL: process.env.BASE_DOMAIN,
});
export const privateRequest = axios.create({
  baseURL: process.env.BASE_DOMAIN,
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
    console.log(error);

    const originRequest = error.config;
    if (error.response.status === 500) {
      const resRefresh = await authRepository.refreshToken();
      if (resRefresh.status === 200 || resRefresh.status === 201) {
        localStorage.setItem("accessToken", resRefresh.data.accessToken);
        return privateRequest(originRequest);
      } else {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
