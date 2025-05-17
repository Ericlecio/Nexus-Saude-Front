// http.js
import axios from "axios";

const medicoApi = axios.create({
  baseURL: "http://localhost:8080/Medico",
  headers: {
    "Content-Type": "application/json",
  },
});

const pacienteApi = axios.create({
  baseURL: "http://localhost:8080/Paciente",
  headers: {
    "Content-Type": "application/json",
  },
});

const diasAtendimentoApi = axios.create({
  baseURL: "http://localhost:8080/DiasAtendimento", // <-- igual ao seu @RequestMapping
  headers: { "Content-Type": "application/json" },
});

const AgendamentoApi = axios.create({
  baseURL: "http://localhost:8080/agendamento",
  headers: {
    "Content-Type": "application/json",
  },
});

export { medicoApi, pacienteApi, diasAtendimentoApi, AgendamentoApi };
