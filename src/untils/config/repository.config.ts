import axios from "axios";

const BASE_DOMAIN = "localhost:8080";
export const API_URL = {
  auth: {
    refreshToken: "refreshToken",
  },
  user: {
    login: "login",
  },
  role: {
    createRole: "role/create",
    getAllRole: "role",
    getRoleById: "role/:id",
  },
  endpoint: {
    createEnpoint: "role/create",
    getAllEnpoint: "role",
    getEndpointById: "role/:id",
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
});
