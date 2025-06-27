import { createRouter, createWebHistory } from "vue-router";

// Importando as views para as rotas
import HomeView from "../views/HomeView.vue";
import CadastroMedicoView from "@/views/CadastroMedicoView.vue";
import ContatoView from "@/views/ContatoView.vue";
import SobreView from "@/views/SobreView.vue";
import AgendamentoConsultasView from "@/views/AgendamentoConsultasView.vue";
import PerfilMedico from "@/views/PerfilMedico.vue";
import PerfilPaciente from "@/views/PerfilPaciente.vue";
import AgendaMedica from "@/views/AgendaMedica.vue";
import AgendaPaciente from "@/views/AgendaPaciente.vue";
import DashboardAdmin from "../views/Admin/DashboardAdmin.vue";
import CadastroPaciente from "@/views/CadastroPaciente.vue";
import MedicoAdmin from "@/views/Admin/MedicoAdmin.vue";
import LoginView from "../views/LoginView.vue";
import PacienteAdmin from "@/views/Admin/PacienteAdmin.vue";

// Definindo as rotas da aplicação
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/cadastroPaciente",
    name: "cadastroPaciente",
    component: CadastroPaciente,
  },
  {
    path: "/cadastroMedico",
    name: "CadastroMedicoView",
    component: CadastroMedicoView,
  },
  {
    path: "/dashboardAdmin",
    name: "DashboardAdmin",
    component: DashboardAdmin,
  },
  {
    path: "/contato",
    name: "contato",
    component: ContatoView,
  },
  {
    path: "/sobre",
    name: "sobre",
    component: SobreView,
  },
  {
    path: "/agendaPaciente",
    name: "agendaPaciente",
    component: AgendaPaciente,
  },
  {
    path: "/Agendamento",
    name: "Agendamento",
    props: true,
    component: AgendamentoConsultasView,
  },
  {
    path: "/perfilMedico",
    name: "perfilMedico",
    props: true,
    component: PerfilMedico,
  },
  {
    path: "/perfilPaciente",
    name: "perfilPaciente",
    props: true,
    component: PerfilPaciente,
  },
  {
    path: "/agendaMedica",
    name: "agendaMedica",
    props: true,
    component: AgendaMedica,
  },
  {
    path: "/medicoAdmin",
    name: "medicoAdmin",
    component: MedicoAdmin,
  },
  {
    path: "/pacienteAdmin",
    name: "pacienteAdmin",
    component: PacienteAdmin,
  },
];

// Criando o roteador
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Middleware para verificar o token de autenticação antes de permitir o acesso a rotas privadas
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem("authToken");
  const publicPaths = ["/", "/login", "/cadastroPaciente", "/cadastroMedico"]; // Rotas públicas

  // Se não houver token e a rota não for pública, redireciona para login
  if (!token && !publicPaths.includes(to.path)) {
    return next("/login");
  }

  // Se passar na verificação, continua a navegação
  next();
});

// Exportando o roteador
export default router;
