import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CadastroMedicoView from "@/views/CadastroMedicoView.vue";
import ContatoView from "@/views/ContatoView.vue";
import SobreView from "@/views/SobreView.vue";
import AgendamentoConsultasView from "@/views/AgendamentoConsultasView.vue";
import ConsultasPacienteView from "@/views/ConsultasPacienteView.vue";
import PerfilMedico from "@/views/PerfilMedico.vue";
import PerfilPaciente from "@/views/PerfilPaciente.vue";
import AgendaMedica from "@/views/AgendaMedica.vue";
import DashboardAdmin from "../views/Admin/DashboardAdmin.vue";
import CadastroPaciente from "@/views/CadastroPaciente.vue";
import MedicoAdmin from "@/views/Admin/MedicoAdmin.vue";
import LoginView from "../views/LoginView.vue";
import PacienteAdmin from "@/views/Admin/PacienteAdmin.vue";

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
    path: "/consultasAgendadas",
    name: "ConsultasPacienteView",
    component: ConsultasPacienteView,
  },
  {
    path: "/Agendamento",
    name: "Agendamento",
    props: true,
    component: AgendamentoConsultasView,
  },
  {
    path: "/perfilMedico",
    name: "perfilmedico",
    props: true,
    component: PerfilMedico,
  },
  {
    path: "/perfilPaciente",
    name: "perfil",
    props: true,
    component: PerfilPaciente,
  },
  {
    path: "/agendaMedica",
    name: "agenda",
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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem("authToken");
  const publicPaths = ["/", "/login", "/cadastroPaciente", "/cadastroMedico"];

  if (!token && !publicPaths.includes(to.path)) {
    return next("/login");
  }

  next();
});

export default router;
