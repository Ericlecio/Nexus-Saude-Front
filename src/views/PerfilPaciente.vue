<template>
  <div>
    <Navbar />
    <div class="container py-5">
      <BotaoVoltar />
      <h1 class="text-center mb-4 text-primary">Perfil do Paciente</h1>

      <!-- Seleção do ID do paciente -->
      <div class="mb-4">
        <label for="pacienteId">Digite o ID do Paciente:</label>
        <input type="number" v-model="pacienteId" class="form-control" placeholder="ID do Paciente" />
        <!-- Botão de pesquisa para carregar o perfil do paciente -->
        <button class="btn btn-primary mt-3" @click="carregarPerfil">Pesquisar</button>
      </div>

      <!-- Exibe o perfil do paciente -->
      <div v-if="paciente">
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
            <p><strong>Data de Nascimento:</strong> {{ paciente.dataNascimento || "Não informado" }}</p>

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
import { pacienteApi } from '@/services/http'; // Importando a instância pacienteApi
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
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
      showModalEdit: false,
      showModalDelete: false,
      formEdit: {},
      hoje: new Date().toISOString().split("T")[0],
      cpfInvalido: false,
      pacienteId: null, // Recebe o ID do paciente
    };
  },
  methods: {
    // Carregar o perfil do paciente pelo ID
    async carregarPerfil() {
      if (this.pacienteId) {
        try {
          const response = await pacienteApi.get(`/${this.pacienteId}`);
          this.paciente = response.data;
        } catch (error) {
          console.error("Erro ao carregar o perfil do paciente:", error);
        }
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
    salvarEdicao() {
      pacienteApi.put(`/update/${this.pacienteId}`, this.formEdit)
        .then(response => {
          this.paciente = { ...this.formEdit };
          alert("Informações atualizadas com sucesso!");
          this.fecharModal();
        })
        .catch(error => {
          console.error("Erro ao atualizar o perfil do paciente:", error);
        });
    },
    confirmarExclusao() {
      this.showModalDelete = true;
    },
    deletarConta() {
      pacienteApi.delete(`/deletar/${this.pacienteId}`)
        .then(() => {
          alert("Conta excluída com sucesso!");
          this.$router.push("/login");
        })
        .catch(error => {
          console.error("Erro ao excluir a conta:", error);
        });
    },
  },
  mounted() {
    // Não chamamos carregarPerfil() automaticamente no mounted, pois agora depende do clique no botão de pesquisa
  },
};
</script>


<style scoped>
.container {
  max-width: 90%;
}

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