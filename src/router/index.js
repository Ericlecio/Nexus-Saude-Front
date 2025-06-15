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
import LoginPaciente from "../views/LoginPaciente.vue";
import LoginMedico from "../views/LoginMedico.vue";
import DashboardAdmin from "../views/Admin/DashboardAdmin.vue";
import LoginAdmin from "@/views/LoginAdmin.vue";
import CadastroPaciente from "@/views/CadastroPaciente.vue";
import MedicoAdmin from "@/views/Admin/MedicoAdmin.vue";
import EdicaoMedicoView from "@/views/EdicaoMedicoView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/loginAdmin",
      name: "loginAdmin",
      component: LoginAdmin,
    },
    {
      path: "/dashboardAdmin",
      name: "DashboardAdmin",
      component: DashboardAdmin,
    },
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/loginPaciente",
      name: "loginPaciente",
      component: LoginPaciente,
    },
    {
      path: "/loginMedico",
      name: "loginMedico",
      component: LoginMedico,
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
      path: "/medico/editar/:id",
      name: "editDoctor",
      component: EdicaoMedicoView,
      props: true,
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
  ],
});

export default router;
