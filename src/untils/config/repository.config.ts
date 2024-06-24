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
    updateUserAdmin: "user/update/admin",
    getAllUser: "user",
    getUserById: "user/:id",
    getUserDetail: "user/detail",
    deleteUser: "user",
  },
  role: {
    createRole: "role",
    getAllRole: "role",
    getRoleById: "role/:id",
    deleteRole: "role/:id",
    updateRole: "role/:id",
  },
  endpoint: {
    createEnpoint: "endpoint",
    getAllEnpoint: "endpoint",
    getEndpointById: "endpoint/:id",
    deleteEndpoint: "endpoint/:id",
    updateEndpoint: "endpoint/:id",
  },
  bookElevation: {
    createBook: "book/elevation/create",
    getAllBook: "book/elevation",
    getBookById: "book/elevation/:id",
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
