// src/services/http.js
import axios from "axios";

const medicoApi = axios.create({
  baseURL: "http://localhost:8080/medico",
  headers: { "Content-Type": "application/json" },
});

const pacienteApi = axios.create({
  baseURL: "http://localhost:8080/paciente",
  headers: { "Content-Type": "application/json" },
});

const diasAtendimentoApi = axios.create({
  baseURL: "http://localhost:8080/DiasAtendimento",
  headers: { "Content-Type": "application/json" },
});

const AgendamentoApi = axios.create({
  baseURL: "http://localhost:8080/agendamento",
  headers: { "Content-Type": "application/json" },
});

const adminApi = axios.create({
  baseURL: "http://localhost:8080/admin",
  headers: { "Content-Type": "application/json" },
});

adminApi.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export { medicoApi, pacienteApi, diasAtendimentoApi, AgendamentoApi, adminApi };
