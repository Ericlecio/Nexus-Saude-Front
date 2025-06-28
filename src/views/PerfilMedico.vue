<template>
  <div>
    <Navbar />
    <div class="container py-5">
      <BotaoVoltar />
      <h1 class="text-center mb-4 text-primary">Perfil do Médico</h1>

      <!-- Exibe o perfil do médico -->
      <div v-if="medico">
        <!-- Informações Pessoais -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-info-circle me-2 text-primary"></i>
              <strong>Informações Pessoais</strong>
              <i class="fas fa-edit ms-2 text-primary cursor-pointer" @click="abrirModal"></i>
            </h5>
            <p><strong>Nome Completo:</strong> {{ medico.nome }}</p>
            <p><strong>E-mail:</strong> {{ medico.email }}</p>
            <p><strong>Telefone:</strong> {{ medico.telefoneConsultorio }}</p>
            <p><strong>CRM:</strong> {{ medico.crm || "Não informado" }}</p>
            <p><strong>Especialidade:</strong> {{ medico.especialidade || "Não informado" }}</p>
            <p><strong>UF:</strong> {{ medico.uf }}</p>
            <p><strong>Sexo:</strong> {{ medico.sexo }}</p>
            <p><strong>CPF:</strong> {{ medico.cpf || "Não informado" }}</p>
            <p><strong>Valor da Consulta:</strong> {{ medico.valorConsulta || "Não informado" }}</p>
            <p><strong>Data de Nascimento:</strong> {{ medico.dataNascimento || "Não informado" }}</p>
          </div>
        </div>

        <!-- Dias de Atendimento -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-clock me-2 text-primary"></i>
              <strong>Dias de Atendimento</strong>
              <i class="fas fa-edit ms-2 text-primary cursor-pointer" @click="abrirModalDias"></i>
            </h5>
            <ul class="list-unstyled">
              <li v-for="dia in diasAtendimento" :key="dia.diasAtendimentoId">
                <strong>{{ traduzirDia(dia.diaSemana) }}:</strong> {{ dia.horario }}
              </li>
              <li v-if="!diasAtendimento.length" class="text-muted">Nenhum horário cadastrado.</li>
            </ul>
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
            <input type="password" v-model="senhaAntiga" class="form-control mb-2" placeholder="Digite a senha antiga" required />
            <label class="form-label">Nova Senha</label>
            <input type="password" v-model="novaSenha" class="form-control mb-2" placeholder="Digite a nova senha" required />
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

    <!-- Modal de Edição Dados -->
    <div v-if="showModalEdit" class="modal-overlay">
      <div class="modal-content">
        <h4>Editar Informações</h4>
        <form @submit.prevent="salvarEdicao">
          <label>Nome Completo</label>
          <input v-model="formEdit.nome" type="text" class="form-control" required />

          <label>Telefone</label>
          <input v-model="formEdit.telefoneConsultorio" type="text" class="form-control" required />

          <label>CRM</label>
          <input v-model="formEdit.crm" type="text" class="form-control" maxlength="6" required />

          <label>Especialidade</label>
          <input v-model="formEdit.especialidade" type="text" class="form-control" />

          <label>CPF</label>
          <input v-model="formEdit.cpf" type="text" class="form-control" maxlength="14" required />

          <label>Valor da Consulta (R$)</label>
          <input v-model="formEdit.valorConsulta" type="text" class="form-control" />

          <label>UF</label>
          <input v-model="formEdit.uf" type="text" class="form-control" />

          <label>Data de Nascimento</label>
          <input v-model="formEdit.dataNascimento" type="date" class="form-control" />

          <div class="mt-3 text-center">
            <button type="submit" class="btn btn-success">Salvar</button>
            <button type="button" class="btn btn-secondary ms-2" @click="fecharModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Dias de Atendimento -->
    <div v-if="showModalDias" class="modal-overlay">
      <div class="modal-content">
        <h4 class="mb-3">Editar Dias de Atendimento</h4>
        <form @submit.prevent="salvarDias">
          <div class="mb-2" v-for="dia in diasSemanaEnum" :key="dia">
            <label class="fw-bold">{{ traduzirDia(dia) }}</label>
            <input v-model="diasSelecionados[dia]" type="text" class="form-control mb-1"
              placeholder="Ex: 08:00,09:00,10:00" />
            <small class="text-muted">Separe os horários por vírgula</small>
          </div>
          <div class="mt-3 text-center">
            <button type="submit" class="btn btn-success">Salvar</button>
            <button type="button" class="btn btn-secondary ms-2" @click="fecharModalDias">Cancelar</button>
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
import { medicoApi, diasAtendimentoApi } from '@/services/http';
import axios from "axios";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import BotaoVoltar from "@/components/BotaoVoltar.vue";

export default {
  name: "PerfilMedico",
  components: { Navbar, Footer, BotaoVoltar },
  data() {
    return {
      medico: null,
      showModalEdit: false,
      showModalDelete: false,
      showModalDias: false,
      diasAtendimento: [],
      diasSemanaEnum: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
      diasSelecionados: {},
      formEdit: {},
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
        const response = await medicoApi.get(`/email/${email}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
          }
        });
        this.medico = response.data;
        await this.carregarDiasAtendimento();
      } catch (error) {
        console.error("Erro ao carregar os dados do médico logado:", error);
        alert("Erro ao carregar dados do médico.");
      }
    },
    async carregarDiasAtendimento() {
      try {
        if (!this.medico?.id) {
          this.diasAtendimento = [];
          return;
        }
        const response = await diasAtendimentoApi.get(`/listar/${this.medico.id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
          }
        });
        this.diasAtendimento = response.data || [];
        // Preenche os campos do modal já com horários cadastrados
        this.diasSemanaEnum.forEach(dia => {
          this.diasSelecionados[dia] =
            this.diasAtendimento.filter(item => item.diaSemana === dia)
              .map(item => item.horario).join(",");
        });
      } catch (error) {
        this.diasAtendimento = [];
      }
    },
    traduzirDia(dia) {
      const mapa = {
        "Segunda": "Segunda-feira",
        "Terça": "Terça-feira",
        "Quarta": "Quarta-feira",
        "Quinta": "Quinta-feira",
        "Sexta": "Sexta-feira",
        "Sábado": "Sábado",
      };
      return mapa[dia] || dia;
    },
    abrirModal() {
      if (!this.medico) return;
      this.formEdit = {
        nome: this.medico.nome,
        email: this.medico.email,
        telefoneConsultorio: this.medico.telefoneConsultorio,
        crm: this.medico.crm,
        especialidade: this.medico.especialidade,
        cpf: this.medico.cpf,
        valorConsulta: this.medico.valorConsulta,
        uf: this.medico.uf,
        dataNascimento: this.medico.dataNascimento
      };
      this.showModalEdit = true;
    },
    abrirModalDias() {
      this.showModalDias = true;
    },
    fecharModal() {
      this.showModalEdit = false;
      this.showModalDelete = false;
    },
    fecharModalDias() {
      this.showModalDias = false;
    },
    salvarEdicao() {
      medicoApi.put(
        `/update/${this.medico.id}`,
        this.formEdit,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
          }
        }
      )
        .then(response => {
          this.medico = response.data;
          alert("Informações atualizadas com sucesso!");
          this.fecharModal();
        })
        .catch(error => {
          console.error("Erro ao atualizar o perfil do médico:", error);
          alert("Erro ao atualizar o perfil. Verifique as permissões.");
        });
    },
    async salvarDias() {
      // Monta lista de objetos diasAtendimento a partir dos campos preenchidos
      let lista = [];
      for (const dia of this.diasSemanaEnum) {
        const horarios = (this.diasSelecionados[dia] || "")
          .split(",")
          .map(h => h.trim())
          .filter(h => h);
        for (const horario of horarios) {
          lista.push({ diaSemana: dia, horario });
        }
      }
      try {
        await medicoApi.put(`/update/${this.medico.id}`,
          { diasAtendimento: lista },
          {
            headers: { Authorization: `Bearer ${sessionStorage.getItem("authToken")}` }
          }
        );
        await this.carregarDiasAtendimento();
        this.fecharModalDias();
        alert("Dias de atendimento atualizados!");
      } catch (error) {
        alert("Erro ao atualizar dias de atendimento.");
      }
    },
    confirmarExclusao() {
      this.showModalDelete = true;
    },
    deletarConta() {
      medicoApi.delete(`/deletar/${this.medico.id}`, {
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
        const response = await medicoApi.put(`/redefinir-senha/${this.medico.id}`, {
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
.container { max-width: 90%; }
.cursor-pointer { cursor: pointer; }
.modal-overlay {
  z-index: 1;
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex; align-items: center; justify-content: center;
}
.modal-content {
  background: white; padding: 20px; border-radius: 8px;
  width: 90%; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
.text-danger { color: #dc3545; }
.text-success { color: #28a745; }
.text-warning { color: #ffc107; }
.btn-danger {
  padding: 12px 24px; font-size: 1rem; font-weight: bold;
  border-radius: 8px; transition: 0.3s ease-in-out;
}
.btn-danger:hover { background-color: #c82333; box-shadow: 0px 4px 8px rgba(255, 0, 0, 0.3); }
</style>
