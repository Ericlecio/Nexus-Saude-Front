<template>
  <div>
    <Navbar />
    <div class="container py-5 mt-5">
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div class="card shadow-lg border-0 rounded-4 p-5 bg-white">
            <div class="text-center mb-4">
              <img src="@/assets/img/NexusSaude_vertical.png" class="logo-small mb-3" />
              <h1 class="text-primary fw-bold">Agendar Consulta</h1>
            </div>

            <form @submit.prevent="submitForm">
              <div class="row g-4">
                <div class="col-md-4">
                  <label class="form-label">Especialidade</label>
                  <select v-model="form.especialidade" class="form-select" @change="filtrarMedicosPorEspecialidade"
                    required>
                    <option value="" disabled>Selecione</option>
                    <option v-for="esp in especialidades" :key="esp" :value="esp">{{ esp }}</option>
                  </select>
                </div>

                <div class="col-md-4">
                  <label class="form-label">Médico</label>
                  <select v-model="form.medicoId" class="form-select" @change="carregarDadosMedico" required>
                    <option value="" disabled>Selecione</option>
                    <option v-for="medico in medicosFiltrados" :key="medico.id" :value="medico.id">{{ medico.nome }}
                    </option>
                  </select>
                </div>

                <div class="col-md-4">
                  <label class="form-label">Horário Disponível</label>
                  <select v-model="form.data" class="form-select" required>
                    <option value="" disabled>Selecione</option>
                    <option v-for="horario in horariosDisponiveis" :key="horario" :value="horario">{{ horario }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="row g-4 mt-3">
                <div class="col-md-6">
                  <label class="form-label">Paciente</label>
                  <input type="text" class="form-control" :value="nomePaciente" readonly />
                </div>

                <div class="col-md-3">
                  <label class="form-label">Telefone do Consultório</label>
                  <input type="text" class="form-control" v-model="form.telefoneConsultorio" readonly />
                </div>

                <div class="col-md-3">
                  <label class="form-label">Valor da Consulta</label>
                  <input type="text" class="form-control" v-model="form.valorConsulta" readonly />
                </div>
              </div>

              <div class="text-end mt-4">
                <button type="submit" class="btn btn-success btn-lg px-5">Agendar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import { AgendamentoApi, medicoApi, diasAtendimentoApi } from "@/services/http";
import axios from "axios";

export default {
  components: { Navbar, Footer },
  data() {
    return {
      pacienteId: null,
      nomePaciente: "",
      medicos: [],
      medicosFiltrados: [],
      especialidades: [],
      horariosDisponiveis: [],
      form: {
        especialidade: "",
        medicoId: "",
        pacienteId: "",
        data: "",
        telefoneConsultorio: "",
        valorConsulta: "",
        local: "Clínica Nexus Saúde - Palmares",
        situacaoId: 1,
      },
    };
  },
  methods: {
    async carregarPacienteLogado() {
      try {
        const response = await axios.get("http://localhost:8080/usuarios/logado", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
        });
        const paciente = response.data;
        this.pacienteId = paciente.id;
        this.nomePaciente = paciente.nomeCompleto;
        this.form.pacienteId = paciente.id;
      } catch (error) {
        alert("Erro ao carregar paciente logado");
        console.error(error);
      }
    },
    async carregarMedicos() {
      try {
        const response = await medicoApi.get("/listar");
        this.medicos = response.data || [];
        this.especialidades = [...new Set(this.medicos.map(m => m.especialidade || ""))];
      } catch (error) {
        alert("Erro ao carregar médicos");
        console.error(error);
      }
    },
    filtrarMedicosPorEspecialidade() {
      this.medicosFiltrados = this.medicos.filter(m => m.especialidade === this.form.especialidade);
      this.form.medicoId = "";
      this.horariosDisponiveis = [];
    },
    async carregarDadosMedico() {
      const medico = this.medicos.find(m => m.id === this.form.medicoId);
      if (!medico) return;
      this.form.telefoneConsultorio = medico.telefoneConsultorio || "";
      this.form.valorConsulta = medico.valorConsulta || "";
      try {
        const responseDias = await diasAtendimentoApi.get(`/listar/${medico.id}`);
        const responseAgendamentos = await AgendamentoApi.get(`/medico/${medico.id}`);
        const todosHorarios = this.gerarHorarios(responseDias.data);
        this.horariosDisponiveis = todosHorarios.filter(h => !responseAgendamentos.data.some(a => a.data === h));
      } catch (error) {
        alert("Erro ao carregar horários");
        console.error(error);
      }
    },
    gerarHorarios(diasAtendimento) {
      const diasSemanaMap = {
        "DOMINGO": 0, "SEGUNDA": 1, "TERÇA": 2, "QUARTA": 3,
        "QUINTA": 4, "SEXTA": 5, "SÁBADO": 6
      };
      const hoje = new Date();
      const horarios = [];
      for (let i = 0; i < 14; i++) {
        const data = new Date();
        data.setDate(hoje.getDate() + i);
        const diaSemana = data.getDay();
        diasAtendimento.forEach(item => {
          if (diasSemanaMap[item.diaSemana?.toUpperCase()] === diaSemana) {
            const [h, m] = item.horario.split(":");
            const dataHora = new Date(data);
            dataHora.setHours(h, m, 0, 0);
            horarios.push(dataHora.toISOString().substring(0, 19));
          }
        });
      }
      return horarios;
    },
    async submitForm() {
      try {
        if (!this.form.especialidade || !this.form.medicoId || !this.form.pacienteId || !this.form.data) {
          alert("Preencha todos os campos obrigatórios.");
          return;
        }
        let valor = this.form.valorConsulta;
        if (typeof valor === "string") {
          valor = parseFloat(valor.replace(/[^\d.,-]/g, '').replace(',', '.'));
        }
        const payload = { ...this.form, valorConsulta: valor };
        await AgendamentoApi.post("/inserir", payload);
        alert("Consulta agendada com sucesso!");
        this.resetForm();
        await this.carregarDadosMedico();
      } catch (error) {
        if (error.response && error.response.status === 409) {
          alert("Horário já ocupado. Escolha outro.");
        } else {
          alert("Erro ao agendar");
        }
        console.error(error);
      }
    },
    resetForm() {
      this.form = {
        especialidade: "",
        medicoId: "",
        pacienteId: this.pacienteId,
        data: "",
        telefoneConsultorio: "",
        valorConsulta: "",
        local: "Clínica Nexus Saúde - Palmares",
        situacaoId: 1,
      };
      this.medicosFiltrados = [];
      this.horariosDisponiveis = [];
    },
  },
  async mounted() {
    await this.carregarPacienteLogado();
    await this.carregarMedicos();
  },
};
</script>

<style scoped>
.logo-small {
  max-width: 120px;
  display: block;
  margin: auto;
}
</style>
