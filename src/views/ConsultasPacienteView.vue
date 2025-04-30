<template>
  <Navbar />
  <div class="div-principal">
    <div class="container my-5">
      <BotaoVoltar />
      <h2 class="text-center text-primary fw-bold mb-4">Meus Agendamentos</h2>

      <div v-if="carregando" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
        <p class="mt-3 text-muted">Carregando seus agendamentos...</p>
      </div>

      <div v-else>
        <!-- Menu de Filtros -->
        <ul class="nav nav-pills justify-content-center mb-4">
          <li class="nav-item" v-for="opcao in opcoesFiltro" :key="opcao.valor">
            <a class="nav-link" :class="{ active: filtroSituacao === opcao.valor }"
              @click="filtroSituacao = opcao.valor">
              {{ opcao.label }}
            </a>
          </li>
        </ul>

        <div class="table-responsive">
          <table class="table table-striped table-hover shadow-sm">
            <thead class="table-primary">
              <tr>
                <th>Especialidade</th>
                <th>Profissional</th>
                <th>Local</th>
                <th>Data e Hora</th>
                <th>Telefone do Consultório</th>
                <th>Valor da Consulta</th>
                <th>Situação</th>
                <th class="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="agendamento in agendamentosFiltrados" :key="agendamento.id" :class="{
                'consulta-cancelada': agendamento.situacao
                  .toLowerCase()
                  .includes('cancelada'),
              }">
                <td>{{ agendamento.especialidade }}</td>
                <td>{{ agendamento.medicoNome }}</td>
                <td>{{ agendamento.local }}</td>
                <td>{{ agendamento.data }}</td>
                <td>{{ agendamento.telefoneConsultorio }}</td>
                <td>{{ agendamento.valorConsulta }}</td>
                <td>{{ agendamento.situacao }}</td>
                <td class="text-center">
                  <button v-if="agendamento.situacao === 'Confirmada'" class="btn btn-sm btn-warning"
                    @click="confirmarCancelamento(agendamento.id)">
                    <i class="fas fa-ban"></i> Cancelar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-if="!agendamentosFiltrados.length" class="text-center text-muted">
          Nenhum agendamento encontrado.
        </p>
      </div>
    </div>

    <!-- Modal de confirmação -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h4 class="text-center text-danger fw-bold">
          {{ modalMensagem.titulo }}
        </h4>
        <p class="text-center">{{ modalMensagem.texto }}</p>
        <div class="text-center mt-3">
          <button class="btn btn-danger me-3" @click="confirmarAcaoModal">
            Confirmar
          </button>
          <button class="btn btn-secondary" @click="showModal = false">
            Fechar
          </button>
        </div>
      </div>
    </div>
    <BotaoMarque />
    <Footer />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import BotaoVoltar from "@/components/BotaoVoltar.vue";
import BotaoMarque from "@/components/botaoMarque.vue";

export default {
  name: "MinhasConsultas",
  components: {
    Navbar,
    Footer,
    BotaoVoltar,
    BotaoMarque,
  },
  data() {
    return {
      agendamentos: [],
      carregando: true,
      showModal: false,
      agendamentoSelecionado: null,
      acaoSelecionada: null,
      modalMensagem: { titulo: "", texto: "" },
      filtroSituacao: "Confirmada",
      opcoesFiltro: [
        { label: "Confirmadas", valor: "Confirmada" },
        { label: "Canceladas pelo Paciente", valor: "Cancelada pelo paciente" },
        { label: "Canceladas pelo Médico", valor: "Cancelada pelo médico" },
        { label: "Presente", valor: "Presente" },
        { label: "Ausente", valor: "Ausente" },
      ],
    };
  },
  computed: {
    agendamentosFiltrados() {
      return this.agendamentos.filter(
        (agendamento) => agendamento.situacao === this.filtroSituacao
      );
    },
  },
  watch: {
    filtroSituacao: {
      handler() {
        this.carregarAgendamentos();
      },
      immediate: true,
    },
  },
  methods: {
    carregarAgendamentos() {
      // Simulação de carregamento de dados sem Firebase.
      // Substitua por sua lógica de obtenção de dados, por exemplo, de uma API.
      this.agendamentos = [
        // Exemplo de dados de agendamentos
        {
          id: 1,
          especialidade: "Dermatologia",
          medicoNome: "Dr. João Silva",
          local: "Clínica X",
          data: "2025-05-10 10:00",
          telefoneConsultorio: "(11) 1234-5678",
          valorConsulta: "R$ 150,00",
          situacao: "Confirmada",
        },
        {
          id: 2,
          especialidade: "Cardiologia",
          medicoNome: "Dr. Ana Oliveira",
          local: "Clínica Y",
          data: "2025-05-12 14:00",
          telefoneConsultorio: "(11) 2345-6789",
          valorConsulta: "R$ 200,00",
          situacao: "Cancelada pelo paciente",
        },
      ];
      this.carregando = false;
    },

    confirmarCancelamento(id) {
      this.agendamentoSelecionado = id;
      this.acaoSelecionada = "cancelar";
      this.modalMensagem = {
        titulo: "Confirmar Cancelamento",
        texto: "Tem certeza de que deseja cancelar esta consulta?",
      };
      this.showModal = true;
    },

    cancelarConsulta() {
      // Simulação de cancelamento de consulta
      const agendamentoIndex = this.agendamentos.findIndex(
        (agendamento) => agendamento.id === this.agendamentoSelecionado
      );

      if (agendamentoIndex !== -1) {
        const agendamento = this.agendamentos[agendamentoIndex];
        agendamento.situacao = "Cancelada pelo paciente";
        alert("Consulta cancelada com sucesso.");
        this.carregarAgendamentos();
      } else {
        alert("Consulta não encontrada.");
      }

      this.showModal = false;
    },

    confirmarAcaoModal() {
      if (this.acaoSelecionada === "cancelar") {
        this.cancelarConsulta();
      }
    },
  },
  mounted() {
    this.carregarAgendamentos();
  },
};
</script>

<style scoped>
.div-principal {
  margin-top: 5%;
}

.nav-pills {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.nav-pills .nav-item {
  flex-grow: 1;
  text-align: center;
}

.nav-pills .nav-link {
  color: #53ba83;
  cursor: pointer;
  font-size: 1rem;
  padding: 10px;
  white-space: nowrap;
}

.nav-pills .nav-link.active {
  background-color: #53ba83;
  color: white;
}

.table-responsive {
  overflow-x: auto;
}

.table {
  border: 1px solid #ddd;
  border-radius: 10px;
  white-space: nowrap;
}

@media (max-width: 991px) {

  .table th,
  .table td {
    font-size: 0.9rem;
    padding: 8px;
  }
}

@media (max-width: 767px) {

  .table th,
  .table td {
    font-size: 0.8rem;
    padding: 6px;
  }

  .table th:nth-child(4),
  .table td:nth-child(4),
  .table th:nth-child(5),
  .table td:nth-child(5) {
    display: none;
  }
}

@media (max-width: 575px) {
  .table {
    font-size: 0.75rem;
  }

  .table th,
  .table td {
    padding: 5px;
  }

  .table th:nth-child(6),
  .table td:nth-child(6) {
    display: none;
  }
}

.consulta-cancelada td {
  text-decoration: line-through;
  background: rgba(0, 0, 30, 0.1);
}

.btn {
  font-size: 0.9rem;
  padding: 6px 10px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  text-align: center;
}

@media (max-width: 480px) {
  .modal-content {
    width: 95%;
    padding: 15px;
  }
}
</style>