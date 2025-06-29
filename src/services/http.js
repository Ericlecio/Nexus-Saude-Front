import axios from "axios";

// Função que adiciona o token de autenticação em todas as requisições
const attachToken = (api) => {
  api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

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

attachToken(medicoApi);
attachToken(pacienteApi);
attachToken(diasAtendimentoApi);
attachToken(AgendamentoApi);
attachToken(adminApi);

export { medicoApi, pacienteApi, diasAtendimentoApi, AgendamentoApi, adminApi };
