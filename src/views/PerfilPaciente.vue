<template>
  <div>
    <Navbar />
    <div class="container py-5">
      <BotaoVoltar />
      <div class="d-flex align-items-center justify-content-center mb-4">
        <i class="fas fa-user-circle fa-2x text-primary me-3"></i>
        <h1 class="text-primary mb-0">Meu Perfil</h1>
      </div>

      <!-- Exibe o perfil do paciente -->
      <div v-if="paciente">
        <!-- Informações Pessoais -->
        <div class="card shadow-lg mb-4 p-4">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="card-title mb-0">
                <i class="fas fa-info-circle me-2 text-primary"></i>
                <strong>Informações Pessoais</strong>
              </h5>
              <button class="btn btn-sm btn-outline-primary" @click="abrirModal">
                <i class="fas fa-edit me-1"></i> Editar
              </button>
            </div>
            <div class="row mt-3">
              <div class="col-md-6">
                <p><strong>Nome Completo:</strong> {{ paciente.nomeCompleto }}</p>
                <p><strong>E-mail:</strong> {{ paciente.email }}</p>
                <p><strong>Telefone:</strong> {{ formatarTelefoneExibicao(paciente.telefone) }}</p>
              </div>
              <div class="col-md-6">
                <p><strong>Plano de Saúde:</strong> {{ paciente.planoSaude || "Não informado" }}</p>
                <p><strong>CPF:</strong> {{ formatarCPFExibicao(paciente.cpf) || "Não informado" }}</p>
                <p><strong>Data de Nascimento:</strong> {{ formatarDataNascimento(paciente.dataNascimento) ||
                  "Nãoinformado" }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Preferências de Notificação -->
        <div class="card shadow-lg mt-4">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-bell me-2 text-info"></i>
              <strong>Preferências de Notificação</strong>
            </h5>

            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" v-model="notificacoes.email" id="notifEmail">
              <label class="form-check-label" for="notifEmail">Receber notificações por e-mail</label>
            </div>

            <div class="form-check form-switch mt-2">
              <input class="form-check-input" type="checkbox" v-model="notificacoes.sms" id="notifSMS">
              <label class="form-check-label" for="notifSMS">Receber notificações por SMS</label>
            </div>

            <button class="btn btn-outline-primary mt-3" @click="salvarPreferencias">
              <i class="fas fa-save me-1"></i> Salvar Preferências
            </button>
          </div>
        </div>

        <!-- Histórico de Consultas -->
        <div class="card shadow-lg mt-4">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-calendar-alt me-2 text-primary"></i>
              <strong>Histórico de Consultas</strong>
            </h5>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Data/Hora</th>
                    <th>Médico</th>
                    <th>Especialidade</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="consulta in paciente.consultas" :key="consulta.id">
                    <td>{{ formatarDataHora(consulta.data, consulta.horario) }}</td>
                    <td>{{ consulta.medico }}</td>
                    <td>{{ consulta.especialidade }}</td>
                    <td>
                      <span :class="`badge bg-${consulta.concluida ? 'success' : 'warning'}`">
                        {{ consulta.concluida ? 'Concluída' : 'Agendada' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Segurança da Conta -->
        <div class="card shadow-lg mt-4 border-warning">
          <div class="card-body">
            <h5 class="card-title mb-3 text-warning">
              <i class="fas fa-shield-alt me-2"></i><strong>Segurança da Conta</strong>
            </h5>

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Nova Senha</label>
                <input type="password" v-model="novaSenha" class="form-control" placeholder="Mínimo 6 caracteres">
              </div>
              <div class="col-md-6">
                <label class="form-label">Confirmar Senha</label>
                <input type="password" v-model="confirmarSenha" class="form-control" placeholder="Repita a nova senha">
              </div>
            </div>

            <div class="d-flex justify-content-end mt-4">
              <button class="btn btn-warning" @click="redefinirSenha" :disabled="loadingSenha">
                <span v-if="loadingSenha">
                  <span class="spinner-border spinner-border-sm" role="status"></span>
                  Processando...
                </span>
                <span v-else>
                  <i class="fas fa-sync-alt me-1"></i> Atualizar Senha
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Zona de Perigo -->
        <div class="card shadow-lg mt-4 border-danger">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="text-danger mb-1">
                  <i class="fas fa-exclamation-triangle me-2"></i>Zona de Perigo
                </h5>
                <p class="mb-0 text-muted">Esta ação é irreversível</p>
              </div>
              <button class="btn btn-outline-danger" @click="confirmarExclusao">
                <i class="fas fa-trash-alt me-1"></i> Excluir Conta
              </button>
            </div>
          </div>
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
        <div class="modal-header bg-light">
          <h5 class="modal-title">Editar Perfil</h5>
          <button type="button" class="btn-close" @click="fecharModal"></button>
        </div>
        <form @submit.prevent="salvarEdicao">
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Nome Completo</label>
              <input v-model="formEdit.nomeCompleto" type="text" class="form-control" maxlength="50" required
                @input="filtrarNome" :class="{ 'is-valid': nomeValido, 'is-invalid': !nomeValido }" />
              <div v-if="!nomeValido" class="invalid-feedback">
                Nome deve conter apenas letras e espaços
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Telefone</label>
              <input v-model="formEdit.telefone" @input="formatarTelefone" type="text" class="form-control" required
                :class="{ 'is-valid': telefoneValido, 'is-invalid': !telefoneValido }" />
              <div v-if="!telefoneValido" class="invalid-feedback">
                Telefone inválido (formato: (00) 00000-0000)
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Plano de Saúde</label>
              <select v-model="formEdit.planoSaude" class="form-select">
                <option v-for="plano in planosSaude" :key="plano.nome" :value="plano.nome">
                  {{ plano.nome }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">CPF</label>
              <input v-model="formEdit.cpf" @input="formatarCPF" @blur="validarCPF" type="text" class="form-control"
                maxlength="14" required :class="{ 'is-valid': !cpfInvalido, 'is-invalid': cpfInvalido }" />
              <div v-if="cpfInvalido" class="invalid-feedback">
                CPF inválido ou já cadastrado!
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Data de Nascimento</label>
              <input v-model="formEdit.dataNascimento" type="date" class="form-control" required :max="hoje"
                :class="{ 'is-valid': nascimentoValido, 'is-invalid': !nascimentoValido }" />
              <div v-if="!nascimentoValido" class="invalid-feedback">
                Data de nascimento inválida
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="fecharModal">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="cpfInvalido || !todosCamposValidos">
              <span v-if="loadingEdicao">
                <span class="spinner-border spinner-border-sm" role="status"></span>
                Salvando...
              </span>
              <span v-else>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Exclusão -->
    <div v-if="showModalDelete" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header bg-light">
          <h5 class="modal-title text-danger">Confirmação de Exclusão</h5>
          <button type="button" class="btn-close" @click="fecharModal"></button>
        </div>
        <div class="modal-body">
          <p>Tem certeza de que deseja excluir sua conta? Todos os seus dados serão apagados permanentemente.</p>
          <div class="alert alert-warning">
            <i class="fas fa-exclamation-circle me-2"></i>
            Esta ação não pode ser desfeita!
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="fecharModal">Cancelar</button>
          <button class="btn btn-danger" @click="deletarConta" :disabled="loadingExclusao">
            <span v-if="loadingExclusao">
              <span class="spinner-border spinner-border-sm" role="status"></span>
              Excluindo...
            </span>
            <span v-else>Confirmar Exclusão</span>
          </button>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import { pacienteApi } from '@/services/http';
import axios from "axios";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import BotaoVoltar from "@/components/BotaoVoltar.vue";

export default {
  name: "PerfilPaciente",
  components: { Navbar, Footer, BotaoVoltar },
  data() {
    return {
      paciente: null,
      showModalEdit: false,
      showModalDelete: false,
      formEdit: {},
      planosSaude: [
        { nome: 'Unimed' },
        { nome: 'Amil' },
        { nome: 'Bradesco Saúde' },
        { nome: 'SulAmérica' },
        { nome: 'Hapvida' },
        { nome: 'Notredame Intermédica' },
        { nome: 'Sem plano de saúde' },
        { nome: 'Porto Seguro Saúde' },
        { nome: 'Grupo NotreDame' },
        { nome: 'Golden Cross' },
        { nome: 'Care Plus' },
        { nome: 'Bradesco Saúde Empresarial' }
      ],
      hoje: new Date().toISOString().split("T")[0],
      cpfInvalido: false,
      nomeValido: true,
      telefoneValido: true,
      nascimentoValido: true,
      novaSenha: "",
      confirmarSenha: "",
      emailUsuario: "",
      loadingSenha: false,
      loadingEdicao: false,
      loadingExclusao: false,
      notificacoes: {
        email: true,
        sms: false
      }
    };
  },
  computed: {
    todosCamposValidos() {
      return this.nomeValido &&
        this.telefoneValido &&
        this.nascimentoValido &&
        !this.cpfInvalido;
    }
  },
  async mounted() {
    await this.carregarPerfilDoUsuarioLogado();
  },
  methods: {
    async carregarPerfilDoUsuarioLogado() {
      try {
        const userResponse = await axios.get("http://localhost:8080/usuarios/logado", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
        });
        const email = userResponse.data.email;
        this.emailUsuario = email;
        const response = await pacienteApi.get(`/email/${email}`);
        this.paciente = response.data;
      } catch (error) {
        console.error("Erro ao carregar os dados do paciente logado:", error);
        alert("Erro ao carregar dados do paciente.");
      }
    },
    abrirModal() {
      if (!this.paciente) return;
      this.formEdit = {
        nomeCompleto: this.paciente.nomeCompleto,
        telefone: this.paciente.telefone,
        cpf: this.paciente.cpf,
        dataNascimento: this.paciente.dataNascimento,
        planoSaude: this.paciente.planoSaude,
        email: this.paciente.email
      };
      this.showModalEdit = true;
    },
    fecharModal() {
      this.showModalEdit = false;
      this.showModalDelete = false;
      this.cpfInvalido = false;
    },
    async salvarEdicao() {
      if (!this.todosCamposValidos) {
        alert("Por favor, corrija os campos inválidos antes de salvar.");
        return;
      }

      this.loadingEdicao = true;

      try {
        const response = await axios.put(
          `http://localhost:8080/paciente/update/${this.paciente.id}`,
          this.formEdit,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
            }
          }
        );
        this.paciente = response.data;
        this.loadingEdicao = false;
        alert("Informações atualizadas com sucesso!");
        this.fecharModal();
      } catch (error) {
        console.error("Erro ao atualizar o perfil do paciente:", error);
        this.loadingEdicao = false;
        alert("Erro ao atualizar o perfil. Verifique as permissões.");
      }
    },
    confirmarExclusao() {
      this.showModalDelete = true;
    },
    async deletarConta() {
      this.loadingExclusao = true;

      try {
        await pacienteApi.delete(`/deletar/${this.paciente.id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
          }
        });
        this.loadingExclusao = false;
        alert("Conta excluída com sucesso!");
        this.$router.push("/login");
      } catch (error) {
        console.error("Erro ao excluir a conta:", error);
        this.loadingExclusao = false;
        alert("Erro ao excluir conta. Tente novamente.");
      }
    },
    formatarCPF() {
      let valor = this.formEdit.cpf.replace(/\D/g, '');
      if (valor.length > 11) valor = valor.substring(0, 11);

      // Aplica a máscara de CPF: xxx.xxx.xxx-xx
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

      this.formEdit.cpf = valor;
      this.validarCPF();
    },
    formatarCPFExibicao(cpf) {
      if (!cpf) return "";
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    },
    async validarCPF() {
      const cpf = this.formEdit.cpf.replace(/\D/g, '');

      // Validação básica de tamanho
      if (cpf.length !== 11) {
        this.cpfInvalido = true;
        return;
      }

      // Algoritmo de validação de CPF
      let soma = 0;
      let resto;

      // Valida primeiro dígito verificador
      for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
      }
      resto = (soma * 10) % 11;

      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cpf.substring(9, 10))) {
        this.cpfInvalido = true;
        return;
      }

      soma = 0;
      // Valida segundo dígito verificador
      for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
      }
      resto = (soma * 10) % 11;

      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cpf.substring(10, 11))) {
        this.cpfInvalido = true;
        return;
      }

      // Verifica se todos os dígitos são iguais
      if (/^(\d)\1{10}$/.test(cpf)) {
        this.cpfInvalido = true;
        return;
      }

      // Verifica se CPF já está cadastrado
      try {
        const response = await axios.get(`http://localhost:8080/paciente/cpf/${cpf}`);
        if (response.data.exists && cpf !== this.paciente.cpf.replace(/\D/g, '')) {
          this.cpfInvalido = true;
        } else {
          this.cpfInvalido = false;
        }
      } catch (error) {
        console.error("Erro ao validar CPF:", error);
        this.cpfInvalido = false;
      }
    },
    formatarTelefone() {
      let telefone = this.formEdit.telefone.replace(/\D/g, '');
      if (telefone.length > 11) telefone = telefone.substring(0, 11);

      // Aplica máscara de telefone
      if (telefone.length === 11) {
        telefone = telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (telefone.length === 10) {
        telefone = telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      }

      this.formEdit.telefone = telefone;
      this.telefoneValido = telefone.length >= 14;
    },
    formatarTelefoneExibicao(telefone) {
      if (!telefone) return "";
      const nums = telefone.replace(/\D/g, '');
      if (nums.length === 11) {
        return nums.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
      return telefone;
    },
    filtrarNome(event) {
      // Remove números e caracteres especiais, mantendo apenas letras, espaços e acentos
      let nome = event.target.value;
      nome = nome.replace(/[^a-zA-Z\u00C0-\u00FF\s']/g, '');
      this.formEdit.nomeCompleto = nome;

      // Valida se o nome é válido
      const regex = /^[a-zA-Z\u00C0-\u00FF\s']+$/;
      this.nomeValido = regex.test(nome) && nome.trim().length > 0;
    },
    formatarDataHora(data, hora) {
      if (!data) return '';
      const dataObj = new Date(data);
      return `${dataObj.toLocaleDateString()} às ${hora}`;
    },
    formatarDataNascimento(data) {
      if (!data) return '';
      return new Date(data).toLocaleDateString('pt-BR');
    },
    async redefinirSenha() {
      // Validações básicas
      if (this.novaSenha.length < 6) {
        alert("A nova senha deve ter no mínimo 6 caracteres");
        return;
      }

      if (this.novaSenha !== this.confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
      }

      this.loadingSenha = true;

      try {
        const response = await axios.post(
          "http://localhost:8080/usuarios/redefinir-senha",
          {
            email: this.paciente.email,
            novaSenha: this.novaSenha
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
            }
          }
        );

        if (response.status === 200) {
          alert("Senha atualizada com sucesso!");
          this.novaSenha = "";
          this.confirmarSenha = "";
        }
      } catch (error) {
        console.error("Erro ao redefinir senha:", error);
        alert(error.response?.data?.message || "Erro ao redefinir senha. Verifique os dados.");
      } finally {
        this.loadingSenha = false;
      }
    },
    salvarPreferencias() {
      alert("Preferências de notificação salvas com sucesso!");
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 90%;
}

.card {
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
  border: none;
}

.card-body {
  padding: 1.5rem;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.card-title {
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.75rem;
  margin-bottom: 1.25rem;
}

.btn {
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  transition: 0.3s ease-in-out;
  padding: 0.5rem 1rem;
}

.btn-outline-primary {
  border-width: 2px;
}

.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #212529;
}

.btn-warning:hover {
  background-color: #e0a800;
  border-color: #d39e00;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.badge {
  font-weight: 500;
  letter-spacing: 0.5px;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
}

.bg-success {
  background-color: #28a745 !important;
}

.bg-warning {
  background-color: #ffc107 !important;
  color: #212529;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.05);
}

.border-warning {
  border: 2px solid #ffc107 !important;
}

.border-danger {
  border: 2px solid #dc3545 !important;
}

.text-warning {
  color: #ffc107 !important;
}

.text-danger {
  color: #dc3545 !important;
}

.form-switch .form-check-input {
  height: 1.5rem;
  width: 2.75rem;
}

.form-switch .form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.invalid-feedback {
  display: block;
}
</style>