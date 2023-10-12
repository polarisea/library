import axios from "axios";

export const apiService = axios.create({
  baseURL: `https://localhost:3000/api/`,
  headers: {
    common: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  },
});
