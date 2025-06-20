<template>
  <div>
    <Navbar />
    <div class="container py-5">
      <BotaoVoltar />
      <h1 class="text-center mb-4 text-primary">Perfil do Paciente</h1>

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
            <p><strong>Plano de Saúde:</strong> {{ paciente.planoSaude || "Não informado" }}</p>
            <p><strong>CPF:</strong> {{ paciente.cpf || "Não informado" }}</p>
            <p><strong>Data de Nascimento:</strong> {{ paciente.dataNascimento || "Não informado" }}</p>
          </div>
        </div>

        <!-- Botão de Exclusão -->
        <div class="text-center mt-4">
          <button class="btn btn-danger btn-lg shadow-sm" @click="confirmarExclusao">
            <i class="fas fa-trash-alt"></i> Excluir Conta
          </button>
        </div>

        <!-- Redefinir Senha -->
        <div class="card shadow-sm mt-4">
          <div class="card-body">
            <h5 class="card-title mb-3 text-danger">
              <i class="fas fa-lock me-2"></i><strong>Redefinir Senha</strong>
            </h5>
            <label class="form-label">Senha Antiga</label>
            <input type="password" v-model="senhaAntiga" class="form-control mb-2" placeholder="Digite a senha antiga"
              required />
            <label class="form-label">Nova Senha</label>
            <input type="password" v-model="novaSenha" class="form-control mb-2" placeholder="Digite a nova senha"
              required />
            <button class="btn btn-warning" @click="redefinirSenha">Salvar Nova Senha</button>
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
            <button type="submit" class="btn btn-success" :disabled="cpfInvalido">Salvar</button>
            <button type="button" class="btn btn-secondary ms-2" @click="fecharModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Exclusão -->
    <div v-if="showModalDelete" class="modal-overlay">
      <div class="modal-content">
        <h4 class="text-danger">Confirmação de Exclusão</h4>
        <p>Tem certeza de que deseja excluir sua conta? Todos os seus dados serão apagados permanentemente.</p>
        <div class="text-center mt-3">
          <button class="btn btn-danger" @click="deletarConta">Confirmar</button>
          <button class="btn btn-secondary ms-2" @click="fecharModal">Cancelar</button>
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
      hoje: new Date().toISOString().split("T")[0],
      cpfInvalido: false,
      novaSenha: "",
      senhaAntiga: "",
      emailUsuario: ""
    };
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
        email: this.paciente.email,           // ✅ novo campo
        senha: "123456"                       // ✅ obrigatório no DTO, mesmo dummy
      };
      this.showModalEdit = true;
    }
    ,
    fecharModal() {
      this.showModalEdit = false;
      this.showModalDelete = false;
    },
    salvarEdicao() {
      axios.put(
        `http://localhost:8080/paciente/update/${this.paciente.id}`,
        this.formEdit,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
          }
        }
      )
        .then(response => {
          this.paciente = response.data;
          alert("Informações atualizadas com sucesso!");
          this.fecharModal();
        })
        .catch(error => {
          console.error("Erro ao atualizar o perfil do paciente:", error);
          alert("Erro ao atualizar o perfil. Verifique as permissões.");
        });
    },
    confirmarExclusao() {
      this.showModalDelete = true;
    },
    deletarConta() {
      pacienteApi.delete(`/deletar/${this.paciente.id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
        }
      })
        .then(() => {
          alert("Conta excluída com sucesso!");
          this.$router.push("/login");
        })
        .catch(error => {
          console.error("Erro ao excluir a conta:", error);
        });
    },
    async redefinirSenha() {
      if (!this.senhaAntiga || !this.novaSenha) {
        alert("Preencha todos os campos.");
        return;
      }
      try {
        const response = await pacienteApi.put(`/redefinir-senha/${this.paciente.id}`, {
          senhaAntiga: this.senhaAntiga,
          novaSenha: this.novaSenha
        }, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
          }
        });
        alert(response.data);
        this.fecharModal();
      } catch (error) {
        console.error("Erro ao redefinir senha:", error);
        alert("Erro ao redefinir senha.");
      }
    }
  }
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