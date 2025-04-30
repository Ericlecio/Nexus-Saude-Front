import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/Medico",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
