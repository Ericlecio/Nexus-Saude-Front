<template>
  <div>
    <Navbar />
    <div class="container py-5">
      <BotaoVoltar />
      <h1 class="text-center mb-4 text-primary"></h1>

      <div v-if="paciente">
        <!-- Seção de Identidade do Paciente -->
        <!-- <div class="card shadow-sm p-4 text-center">
          <img :src="profilePicture" alt="Foto do Paciente" class="profile-img mb-3">
          <h1 class="text-primary fw-bold">{{ paciente ? paciente.nomeCompleto : "Carregando..." }}</h1>
          <p class="text-muted">Paciente cadastrado no Nexus Saúde</p>
        </div> -->

        <!-- Informações Pessoais -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-info-circle me-2 text-primary"></i>
              <strong>Informações Pessoais</strong>
              <i class="fas fa-edit ms-2 text-primary cursor-pointer" @click="abrirModal"></i>
            </h5>
            <p><strong>Nome Completo:</strong> {{ paciente.nomeCompleto }}</p>
            <p><strong>E-mail:</strong> {{ paciente.email }}</p>
            <p><strong>Telefone:</strong> {{ paciente.telefone }}</p>
            <p>
              <strong>Plano de Saúde:</strong>
              {{ paciente.planoSaude || "Não informado" }}
            </p>
            <p><strong>CPF:</strong> {{ paciente.cpf || "Não informado" }}</p>
            <p>
              <strong>Data de Nascimento:</strong>
              {{ paciente.dataNascimento || "Não informado" }}
            </p>
          </div>
        </div>

        <!-- Histórico de Consultas -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-calendar-check me-2 text-primary"></i>
              <strong>Histórico de Consultas</strong>
            </h5>
            <div v-if="paciente.consultas && paciente.consultas.length">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Médico</th>
                    <th>Especialidade</th>
                    <th>Local</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="consulta in paciente.consultas" :key="consulta.id">
                    <td>{{ consulta.data }}</td>
                    <td>{{ consulta.medicoNome }}</td>
                    <td>{{ consulta.especialidade }}</td>
                    <td>{{ consulta.local }}</td>
                    <td>
                      <span :class="statusClass(consulta.situacao)">
                        <i :class="statusIcon(consulta.situacao)"></i> {{ consulta.situacao }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

            </div>
            <p v-else class="text-muted">Nenhuma consulta encontrada.</p>
          </div>
        </div>

        <!-- Botão de Exclusão -->
        <div class="text-center mt-4">
          <button class="btn btn-danger btn-lg shadow-sm" @click="confirmarExclusao">
            <i class="fas fa-trash-alt"></i> Excluir Conta
          </button>
        </div>

      </div>

      <div v-else class="text-center mt-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
      </div>
    </div>

    <!-- Modal de Edição -->
    <div v-if="showModalEdit" class="modal-overlay">
      <div class="modal-content">
        <h4>Editar Informações</h4>
        <form @submit.prevent="salvarEdicao">
          <label>Nome Completo</label>
          <input v-model="formEdit.nomeCompleto" type="text" class="form-control" required @input="validarNome" />

          <label>Telefone</label>
          <input v-model="formEdit.telefone" @input="formatarTelefone" type="text" class="form-control" required />

          <label>Plano de Saúde</label>
          <select v-model="formEdit.planoSaude" class="form-control">
            <option value="" disabled>Selecione o plano</option>
            <option value="Unimed">Unimed</option>
            <option value="Amil">Amil</option>
            <option value="Bradesco Saúde">Bradesco Saúde</option>
            <option value="SulAmérica">SulAmérica</option>
            <option value="Hapvida">Hapvida</option>
            <option value="Notredame Intermédica">Notredame Intermédica</option>
            <option value="Sem plano de saúde">Sem plano de saúde</option>
          </select>

          <label>CPF</label>
          <input v-model="formEdit.cpf" @input="formatarCPF" @blur="validarCPF" type="text" class="form-control"
            maxlength="14" required />
          <small v-if="cpfInvalido" class="text-danger">CPF inválido!</small>

          <label>Data de Nascimento</label>
          <input v-model="formEdit.dataNascimento" type="date" class="form-control" required :max="hoje" />

          <div class="mt-3 text-center">
            <button type="submit" class="btn btn-success" :disabled="cpfInvalido">
              Salvar
            </button>
            <button type="button" class="btn btn-secondary ms-2" @click="fecharModal">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Exclusão -->
    <div v-if="showModalDelete" class="modal-overlay">
      <div class="modal-content">
        <h4 class="text-danger">Confirmação de Exclusão</h4>
        <p>
          Tem certeza de que deseja excluir sua conta? Todos os seus dados serão
          apagados permanentemente.
        </p>
        <div class="text-center mt-3">
          <button class="btn btn-danger" @click="deletarConta">
            Confirmar
          </button>
          <button class="btn btn-secondary ms-2" @click="fecharModal">
            Cancelar
          </button>
        </div>
      </div>
    </div>


    <Footer />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  collection,
  where,
  getDocs,
  writeBatch
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut, deleteUser } from "firebase/auth";
import BotaoVoltar from "@/components/BotaoVoltar.vue";



export default {
  name: "PerfilPaciente",
  components: {
    Navbar,
    Footer,
    BotaoVoltar,

  },
  data() {
    return {
      paciente: null,
      pacienteId: null,
      showModalEdit: false,
      showModalDelete: false,
      formEdit: {},
      hoje: new Date().toISOString().split("T")[0],
      cpfInvalido: false,
      // profilePicture: "https://via.placeholder.com/100", // Aqui pode ser a URL real da foto do paciente

    };
  },
  methods: {
    statusClass(status) {
      return {
        "text-danger": status.includes("Cancelada"),
        "text-success": status.includes("Confirmada"),
        "text-warning": status.includes("Pendente")
      };
    },
    statusIcon(status) {
      return {
        "Cancelada pelo paciente": "fas fa-times-circle",
        "Confirmada": "fas fa-check-circle",
        "Pendente": "fas fa-clock"
      }[status] || "fas fa-info-circle";
    },
    async carregarPerfil() {
      try {
        const auth = getAuth();
        const db = getFirestore();
        const firebaseUser = auth.currentUser;

        if (firebaseUser) {
          const pacienteRef = doc(db, "pacientes", firebaseUser.uid);
          const pacienteSnap = await getDoc(pacienteRef);

          if (pacienteSnap.exists()) {
            this.pacienteId = firebaseUser.uid;
            this.paciente = pacienteSnap.data();

            // Após carregar os dados do paciente, carregar o histórico de consultas
            await this.carregarHistoricoConsultas();
          } else {
            await signOut(auth);
            alert("Email verificado, Faça login Novamente.");
            this.$router.push("/login");
          }
        } else {
          this.$router.push("/login");
        }
      } catch (error) {
        alert("Erro ao carregar perfil do paciente.");
      }
    },

    abrirModal() {
      if (!this.paciente) return;
      this.formEdit = { ...this.paciente };
      this.showModalEdit = true;
    },

    fecharModal() {
      this.showModalEdit = false;
      this.showModalDelete = false;
    },

    validarNome(event) {
      this.formEdit.nomeCompleto = event.target.value.replace(/[^a-zA-Z\s]/g, "");
    },

    formatarTelefone(event) {
      let telefone = event.target.value.replace(/\D/g, "");
      telefone = telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      this.formEdit.telefone = telefone.slice(0, 15);
    },

    formatarCPF(event) {
      let cpf = event.target.value.replace(/\D/g, "");
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      cpf = cpf.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
      cpf = cpf.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
      this.formEdit.cpf = cpf.slice(0, 14);
    },

    validarCPF() {
      const cpf = this.formEdit.cpf.replace(/\D/g, "");
      if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        this.cpfInvalido = true;
        return;
      }
      const calcularDigito = (base) =>
        Array.from(
          { length: base },
          (_, i) => parseInt(cpf[i]) * (base + 1 - i)
        ).reduce((a, b) => a + b) % 11;
      const digito1 = calcularDigito(9) < 2 ? 0 : 11 - calcularDigito(9);
      const digito2 = calcularDigito(10) < 2 ? 0 : 11 - calcularDigito(10);

      this.cpfInvalido = !(
        digito1 === parseInt(cpf[9]) && digito2 === parseInt(cpf[10])
      );
    },

    confirmarExclusao() {
      this.showModalDelete = true;
    },

    async deletarConta() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        const db = getFirestore();

        if (!user) {
          alert("Usuário não autenticado.");
          return;
        }

        const batch = writeBatch(db);

        const agendamentosQuery = query(
          collection(db, "agendamentos"),
          where("pacienteId", "==", this.pacienteId)
        );
        const agendamentosSnapshot = await getDocs(agendamentosQuery);

        if (!agendamentosSnapshot.empty) {
          for (const agendamentoDoc of agendamentosSnapshot.docs) {
            const agendamento = agendamentoDoc.data();

            const historicoRef = doc(collection(db, "historicoConsultas"));
            batch.set(historicoRef, {
              pacienteId: agendamento.pacienteId,
              pacienteNome: agendamento.pacienteNome,
              pacienteTelefone: agendamento.pacienteTelefone,
              medicoId: agendamento.medicoId,
              medicoNome: agendamento.medicoNome,
              data: agendamento.data,
              local: agendamento.local,
              especialidade: agendamento.especialidade,
              valorConsulta: agendamento.valorConsulta,
              situacao: "Paciente removido do sistema",
            });

            batch.delete(agendamentoDoc.ref);
          }
        }

        const pacienteRef = doc(db, "pacientes", this.pacienteId);
        batch.delete(pacienteRef);

        await batch.commit();

        await user.delete();

        alert("Conta excluída com sucesso!");
        this.$router.push("/login");

      } catch (error) {
        console.error("Erro ao excluir conta:", error);
        if (error.code === "auth/requires-recent-login") {
          alert("Por segurança, você precisa fazer login novamente para excluir sua conta.");
          await signOut(auth);
          this.$router.push("/login");
        } else {
          alert(`Erro ao excluir conta: ${error.message}`);
        }
      } finally {
        this.fecharModal();
      }
    },

    async carregarHistoricoConsultas() {
      if (!this.pacienteId) return;

      try {
        const db = getFirestore();

        const qHistorico = query(collection(db, "historicoConsultas"), where("pacienteId", "==", this.pacienteId));
        const snapshotHistorico = await getDocs(qHistorico);

        const consultas = snapshotHistorico.empty ? [] : snapshotHistorico.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            data: data.data || "Sem data",
            medicoNome: data.medicoNome || "Não informado",
            especialidade: data.especialidade || "Não informado",
            local: data.local || "Não informado",
            situacao: data.situacao || "Sem status",
          };
        });
        this.paciente.consultas = consultas;

      } catch (error) {
        alert("Erro ao carregar o histórico de consultas.");
      }
    },

    async salvarEdicao() {
      try {
        if (!this.pacienteId) {
          console.error("ID do paciente não encontrado.");
          alert("Erro ao atualizar dados. ID do paciente não encontrado.");
          return;
        }
        const db = getFirestore();
        const pacienteRef = doc(db, "pacientes", this.pacienteId);
        const dadosAtualizados = { ...this.formEdit };
        delete dadosAtualizados.email;
        await updateDoc(pacienteRef, dadosAtualizados);
        this.paciente = { ...this.paciente, ...dadosAtualizados };
        alert("Informações atualizadas com sucesso!");
        this.fecharModal();
      } catch (error) {
        alert("Erro ao atualizar paciente. Tente novamente.");
      }
    },
  },
  mounted() {
    this.carregarPerfil();
  },
};
</script>

<style scoped>
.container {
  max-width: 90%;
}

/* .profile-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #007bff;
} */

.cursor-pointer {
  cursor: pointer;
}

.modal-overlay {
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.text-danger {
  color: #dc3545;
}

.text-success {
  color: #28a745;
}

.text-warning {
  color: #ffc107;
}

.btn-danger {
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 8px;
  transition: 0.3s ease-in-out;
}

.btn-danger:hover {
  background-color: #c82333;
  box-shadow: 0px 4px 8px rgba(255, 0, 0, 0.3);
}
</style>