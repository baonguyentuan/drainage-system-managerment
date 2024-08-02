import axios from "axios";

const BASE_DOMAIN = "http://localhost:8080";
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
  baseURL: BASE_DOMAIN,
});
export const privateRequest = axios.create({
  baseURL: BASE_DOMAIN,
  headers: {
    Authorization: `Bearer ${
      localStorage.getItem("accessToken")
        ? localStorage.getItem("accessToken")
        : ""
    }`,
  },
});
