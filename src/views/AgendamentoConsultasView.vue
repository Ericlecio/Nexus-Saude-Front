<template>
  <Navbar />
  <div class="container-fluid py-5 mt-5">
    <div class="row justify-content-center align-items-center">
      <div class="col-lg-10 col-md-12">
        <div class="card shadow-lg border-0 rounded-4 overflow-hidden position-relative">

          <div class="voltar-container">
            <BotaoVoltar />
          </div>

          <div class="row g-0">
            <div class="col-md-4 d-flex align-items-center justify-content-center bg-light">
              <img src="@/assets/img/NexusSaude_vertical.png" alt="Imagem Nexus Saúde" class="img-fluid logo" />
            </div>

            <div class="col-md-8 p-5 bg-white">
              <h1 class="text-center text-primary mb-3 font-weight-bold">
                Nexus Saúde
              </h1>
              <p class="text-center text-muted mb-4">
                Agende sua consulta com facilidade
              </p>
              <form @submit.prevent="submitForm">

                <div class="row g-4">
                  <div class="col-md-4 col-sm-12">
                    <label for="especialidade" class="form-label text-dark fw-bold">
                      <i class="fas fa-user-md"></i> Especialidade
                    </label>
                    <select v-model="form.especialidade" id="especialidade" class="form-select"
                      @change="filterMedicosByEspecialidade" required>
                      <option value="" disabled selected>Selecione</option>
                      <option v-for="especialidade in especialidades" :key="especialidade" :value="especialidade">
                        {{ especialidade }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-4 col-sm-12">
                    <label for="medicoNome" class="form-label text-dark fw-bold">
                      <i class="fas fa-stethoscope"></i> Médico
                    </label>
                    <select v-model="form.medicoId" id="medico" class="form-select" required @change="medicoChanged">
                      <option value="" disabled selected>Selecione</option>
                      <option v-for="medico in medicosFiltrados" :key="medico.id" :value="medico.id">
                        {{ medico.nomeCompleto }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-4 col-sm-12">
                    <label for="data" class="form-label text-dark fw-bold">
                      <i class="fas fa-clock"></i> Horários Disponíveis
                    </label>
                    <select v-model="form.data" id="data" class="form-select" required>
                      <option value="" disabled selected>Selecione</option>
                      <option v-for="horario in horariosDisponiveis" :key="horario.horario" :value="horario.horario">
                        {{ horario.horario }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="row g-4 mt-3">
                  <div class="col-md-4 col-sm-12">
                    <label for="pacienteNome" class="form-label text-dark fw-bold">
                      <i class="fas fa-user"></i> Paciente
                    </label>
                    <input type="text" id="pacienteNome" v-model="form.pacienteNome" class="form-control" readonly />
                  </div>
                  <div class="col-md-4 col-sm-12">
                    <label for="telefoneConsultorio" class="form-label text-dark fw-bold">
                      <i class="fas fa-phone-alt"></i> Telefone do Consultório
                    </label>
                    <input type="text" id="telefoneConsultorio" v-model="form.telefoneConsultorio" class="form-control"
                      readonly />
                  </div>
                  <div class="col-md-4 col-sm-12">
                    <label for="valorConsulta" class="form-label text-dark fw-bold">
                      <i class="fas fa-money-bill-wave"></i> Valor da Consulta
                    </label>
                    <input type="text" id="valorConsulta" v-model="form.valorConsulta" class="form-control" readonly />
                  </div>
                </div>

                <div class="row g-4 mt-3">
                  <div class="col-md-4 col-sm-12">
                    <label for="pacienteTelefone" class="form-label text-dark fw-bold">
                      <i class="fas fa-mobile-alt"></i> Telefone
                    </label>
                    <input type="text" id="pacienteTelefone" v-model="form.pacienteTelefone" class="form-control"
                      readonly />
                  </div>
                  <div class="col-md-4 col-sm-12">
                    <label for="local" class="form-label text-dark fw-bold">
                      <i class="fas fa-map-marker-alt"></i> Local
                    </label>
                    <input type="text" id="local" v-model="form.local" class="form-control" readonly />
                  </div>
                </div>

                <div class="text-center mt-4">
                  <button type="submit" class="btn btn-primary btn-lg btn-shadow">
                    <i class="fas fa-calendar-check"></i> Agendar Consulta
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import BotaoVoltar from "@/components/BotaoVoltar.vue";

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";


export default {
  name: "AgendamentoConsulta",
  components: {
    Navbar,
    Footer,
    BotaoVoltar,
  },

  data() {
    return {
      medicos: [],
      medicosFiltrados: [],
      especialidades: [],
      horariosDisponiveis: [],
      form: {
        especialidade: "",
        medicoId: "",
        medicoNome: "",
        telefoneConsultorio: "",
        valorConsulta: "",
        local: "Clínica Nexus Saúde - Palmares, PE",
        data: "",
        pacienteNome: "",
        pacienteTelefone: "",
      },
      pacienteLogado: null,
    };
  },

  methods: {
    async verificarPacienteLogado() {
      const auth = getAuth();
      const db = getFirestore();

      onAuthStateChanged(auth, async (firebaseUser) => {
        if (!firebaseUser) {
          alert("Apenas pacientes podem agendar consultas. Faça login.");
          this.$router.push("/login");
          return;
        }
        try {
          const pacienteRef = doc(db, "pacientes", firebaseUser.uid);
          const pacienteSnap = await getDoc(pacienteRef);

          if (pacienteSnap.exists()) {
            const pacienteData = pacienteSnap.data();

            this.pacienteLogado = {
              id: firebaseUser.uid,
              ...pacienteData
            };

            this.form.pacienteNome = pacienteData.nomeCompleto || "Nome não informado";
            this.form.pacienteTelefone = pacienteData.telefone || "Não informado";
          } else {
            alert("Paciente não cadastrado no sistema.");
            this.$router.push("/login");
          }
        } catch (error) {
          alert("Erro ao carregar dados do paciente.");
        }
      });
    },

    async fetchMedicos() {
      try {
        const db = getFirestore();
        const q = query(collection(db, "medicos"));
        const querySnapshot = await getDocs(q);

        this.medicos = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            telefoneConsultorio: data.telefoneConsultorio || "Não informado",
            valorConsulta: data.valorConsulta ? `${data.valorConsulta}` : "Não informado"
          };
        });

        this.especialidades = [...new Set(this.medicos.map((medico) => medico.especialidade))];

      } catch (error) {
        alert("Erro ao carregar médicos. Tente novamente.");
      }
    },

    filterMedicosByEspecialidade() {
      this.medicosFiltrados = this.medicos.filter(
        (medico) => medico.especialidade === this.form.especialidade
      );
      this.form.medicoId = "";
      this.form.medicoNome = "";
      this.horariosDisponiveis = [];
    },

    async medicoChanged() {
      const medicoSelecionado = this.medicos.find((m) => m.id === this.form.medicoId);

      if (medicoSelecionado) {
        this.form.medicoNome = medicoSelecionado.nomeCompleto || "Nome não informado";
        this.form.telefoneConsultorio = medicoSelecionado.telefoneConsultorio || "Não informado";
        this.form.valorConsulta = medicoSelecionado.valorConsulta ? `${medicoSelecionado.valorConsulta},00` : "Não informado";

        this.carregarHorarios(medicoSelecionado);
      } else {
        this.horariosDisponiveis = [];
        this.form.telefoneConsultorio = "Não informado";
        this.form.valorConsulta = "Não informado";
      }
    },

    async carregarHorarios(medico) {
      if (!medico.diasAtendimento) {
        this.horariosDisponiveis = [{ horario: "Nenhum horário disponível", disponivel: false }];
        return;
      }

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const duasSemanasDepois = new Date();
      duasSemanasDepois.setDate(hoje.getDate() + 14);

      const diasSemana = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
      const horarios = [];

      for (let i = 0; i < 14; i++) {
        const dataConsulta = new Date(hoje);
        dataConsulta.setDate(hoje.getDate() + i);
        dataConsulta.setHours(0, 0, 0, 0);

        const nomeDiaSemana = diasSemana[dataConsulta.getDay()];

        if (!medico.diasAtendimento[nomeDiaSemana]) continue;

        for (const horario of medico.diasAtendimento[nomeDiaSemana]) {
          const [hora, minuto] = horario.split(":").map(Number);
          const horarioCompleto = new Date(dataConsulta);
          horarioCompleto.setHours(hora, minuto, 0, 0);

          if (horarioCompleto < new Date()) continue;

          const horarioFormatado = `${horarioCompleto.toLocaleDateString("pt-BR")} ${horario}`;

          const disponivel = await this.verificarDisponibilidade(medico.id, horarioFormatado);
          if (disponivel) {
            horarios.push({ horario: horarioFormatado });
          }
        }
      }

      this.horariosDisponiveis = horarios.length
        ? horarios
        : [{ horario: "Nenhum horário disponível", disponivel: false }];
    },

    async verificarDisponibilidade(medicoId, horarioCompleto) {
      const db = getFirestore();

      const q = query(
        collection(db, "agendamentos"),
        where("medicoId", "==", medicoId),
        where("data", "==", horarioCompleto)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.empty;
    },

    async submitForm() {
      try {
        const db = getFirestore();
        const q = query(
          collection(db, "agendamentos"),
          where("medicoId", "==", this.form.medicoId),
          where("data", "==", this.form.data)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          alert("Este horário já está ocupado. Por favor, escolha outro horário.");
          return;
        }

        await addDoc(collection(db, "agendamentos"), {
          especialidade: this.form.especialidade,
          medicoId: this.form.medicoId,
          medicoNome: this.form.medicoNome,
          telefoneConsultorio: this.form.telefoneConsultorio,
          valorConsulta: this.form.valorConsulta,
          local: this.form.local,
          data: this.form.data,
          pacienteId: this.pacienteLogado.id,
          pacienteNome: this.form.pacienteNome,
          pacienteTelefone: this.form.pacienteTelefone,
          situacao: "Confirmada",
        });

        alert("Consulta agendada com sucesso!");
        this.$router.push("/");
      } catch (error) {
        alert("Não foi possível agendar a consulta. Tente novamente.");
      }
    },
  },

  async mounted() {
    await this.verificarPacienteLogado();
    await this.fetchMedicos();
  }
};
</script>


<style scoped>
.card {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.voltar-container {
  position: absolute;
  top: 20px;
  left: 150px;
  z-index: 10;
}

.logo {
  max-width: 70%;
}

.form-label {
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-select,
.form-control {
  border-radius: 10px;
  border: 1px solid #d1d5db;
  padding: 12px;
  font-size: 16px;
  transition: border 0.3s ease-in-out;
}

.form-select:focus,
.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
}

.btn-lg {
  padding: 14px 36px;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 8px;
  transition: 0.3s ease-in-out;
}

.btn-shadow {
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.btn-lg:hover {
  background-color: #0056b3;
  box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.3);
}

@media (max-width: 1024px) {
  .voltar-container {
    left: 50px;
  }
}

@media (max-width: 768px) {
  .voltar-container {
    left: 20px;
    top: 10px;
  }

  .card {
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }

  .logo {
    max-width: 50%;
    margin-bottom: 20px;
  }

  .form-label {
    justify-content: center;
    font-size: 0.9rem;
  }

  .btn-lg {
    width: 100%;
    font-size: 1rem;
    padding: 12px;
  }

  .col-md-4 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .voltar-container {
    left: 10px;
    top: 5px;
  }

  .logo {
    max-width: 60%;
  }

  .form-label {
    font-size: 0.85rem;
  }

  .btn-lg {
    font-size: 0.9rem;
    padding: 10px;
  }
}
</style>