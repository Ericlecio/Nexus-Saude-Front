<template>
  <div>
    <Navbar />
    <div class="container py-5">
      <BotaoVoltar />
      <div class="d-flex align-items-center justify-content-center mb-4">
        <i class="fas fa-user-md fa-2x text-primary me-3"></i>
        <h1 class="text-primary mb-0">Perfil do Médico</h1>
      </div>

      <!-- Exibe o perfil do médico -->
      <div v-if="medico">
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
                <p><strong>Nome Completo:</strong> {{ medico.nome }}</p>
                <p><strong>E-mail:</strong> {{ medico.email }}</p>
                <p><strong>Telefone:</strong> {{ formatarTelefoneExibicao(medico.telefoneConsultorio) }}</p>
                <p><strong>CRM:</strong> {{ medico.crm || "Não informado" }}</p>
              </div>
              <div class="col-md-6">
                <p><strong>Especialidade:</strong> {{ medico.especialidade || "Não informado" }}</p>
                <p><strong>UF:</strong> {{ medico.uf }}</p>
                <p><strong>Sexo:</strong> {{ medico.sexo }}</p>
                <p><strong>CPF:</strong> {{ formatarCPFExibicao(medico.cpf) || "Não informado" }}</p>
                <p><strong>Valor da Consulta:</strong> {{ medico.valorConsulta ?
                  formatarValorConsulta(medico.valorConsulta) : "Não informado" }}</p>
                <p><strong>Data de Nascimento:</strong> {{ formatarDataNascimento(medico.dataNascimento) ||
                  "Não informado" }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Dias de Atendimento -->
        <div class="card shadow-lg mb-4 p-4">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="card-title mb-0">
                <i class="fas fa-clock me-2 text-primary"></i>
                <strong>Dias de Atendimento</strong>
              </h5>
              <button class="btn btn-sm btn-outline-primary" @click="abrirModalDias">
                <i class="fas fa-edit me-1"></i> Editar
              </button>
            </div>
            <div class="row">
              <div class="col-md-4 mb-3" v-for="dia in diasSemana" :key="dia.value">
                <label class="fw-bold">{{ dia.label }}</label>
                <div v-if="diasAtendimentoEditPerfil[dia.value] && diasAtendimentoEditPerfil[dia.value].inicio">
                  {{ diasAtendimentoEditPerfil[dia.value].inicio }} - {{ diasAtendimentoEditPerfil[dia.value].fim }}
                </div>
                <div v-else class="text-muted">Não atendido</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Segurança da Conta -->
        <div class="card shadow-lg border-warning mt-4 p-4">
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
        <div class="card shadow-lg border-danger mt-4 p-4">
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

    <!-- Modal de Edição Dados -->
    <div v-if="showModalEdit" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header bg-light">
          <h5 class="modal-title">Editar Informações</h5>
          <button type="button" class="btn-close" @click="fecharModal"></button>
        </div>
        <form @submit.prevent="salvarEdicao">
          <div class="modal-body">
            <div class="row">
              <!-- Coluna Esquerda -->
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Nome Completo</label>
                  <input v-model="formEdit.nome" type="text" class="form-control" required @input="filtrarNome"
                    :class="{ 'is-valid': nomeValido, 'is-invalid': !nomeValido }" />
                  <div v-if="!nomeValido" class="invalid-feedback">
                    Nome deve conter apenas letras e espaços
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Telefone</label>
                  <input v-model="formEdit.telefoneConsultorio" @input="formatarTelefone" type="text"
                    class="form-control" required
                    :class="{ 'is-valid': telefoneValido, 'is-invalid': !telefoneValido }" />
                  <div v-if="!telefoneValido" class="invalid-feedback">
                    Telefone inválido
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">CRM</label>
                  <input v-model="formEdit.crm" type="text" class="form-control" maxlength="6" required />
                </div>

                <div class="mb-3">
                  <label class="form-label">Especialidade</label>
                  <select v-model="formEdit.especialidade" class="form-select">
                    <option v-for="especialidade in especialidades" :key="especialidade" :value="especialidade">
                      {{ especialidade }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Coluna Direita -->
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">CPF</label>
                  <input v-model="formEdit.cpf" @input="formatarCPF" @blur="validarCPF" type="text" class="form-control"
                    maxlength="14" required :class="{ 'is-valid': !cpfInvalido, 'is-invalid': cpfInvalido }" />
                  <div v-if="cpfInvalido" class="invalid-feedback">
                    CPF inválido
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Valor da Consulta (R$)</label>
                  <div class="input-group">
                    <span class="input-group-text">R$</span>
                    <input v-model="formEdit.valorConsulta" type="text" class="form-control"
                      @input="formatarValorConsultaInput" />
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">UF</label>
                  <select v-model="formEdit.uf" class="form-select">
                    <option v-for="uf in ufs" :key="uf" :value="uf">{{ uf }}</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label class="form-label">Data de Nascimento</label>
                  <input v-model="formEdit.dataNascimento" type="date" class="form-control" :max="hoje" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="fecharModal">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="loadingEdicao">
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

    <!-- Modal de Dias de Atendimento -->
    <div v-if="showModalDias" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header bg-light">
          <h5 class="modal-title">Editar Dias de Atendimento</h5>
          <button type="button" class="btn-close" @click="fecharModalDias"></button>
        </div>
        <form @submit.prevent="salvarDias">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-4 mb-3" v-for="dia in diasSemana" :key="dia.value">
                <label class="fw-bold">{{ dia.label }}</label>
                <div class="d-flex">
                  <select v-model="diasAtendimentoEdit[dia.value].inicio" class="form-select me-2">
                    <option value="">Início</option>
                    <option v-for="h in horarios" :key="h" :value="h">{{ h }}</option>
                  </select>
                  <select v-model="diasAtendimentoEdit[dia.value].fim" class="form-select">
                    <option value="">Fim</option>
                    <option v-for="h in horarios" :key="h" :value="h">{{ h }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="fecharModalDias">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="loadingDias">
              <span v-if="loadingDias">
                <span class="spinner-border spinner-border-sm" role="status"></span>
                Salvando...
              </span>
              <span v-else>Salvar</span>
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
          <button type="button" class="btn-close" @click="fecharModalDelete"></button>
        </div>
        <div class="modal-body">
          <p>Tem certeza de que deseja excluir sua conta? Todos os seus dados serão apagados permanentemente.</p>
          <div class="alert alert-warning">
            <i class="fas fa-exclamation-circle me-2"></i>
            Esta ação não pode ser desfeita!
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="fecharModalDelete">Cancelar</button>
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
      diasSemana: [
        { value: 'segunda', label: 'Segunda-feira' },
        { value: 'terca', label: 'Terça-feira' },
        { value: 'quarta', label: 'Quarta-feira' },
        { value: 'quinta', label: 'Quinta-feira' },
        { value: 'sexta', label: 'Sexta-feira' },
        { value: 'sabado', label: 'Sábado' }
      ],
      diasAtendimentoEdit: {
        segunda: { inicio: '', fim: '' },
        terca: { inicio: '', fim: '' },
        quarta: { inicio: '', fim: '' },
        quinta: { inicio: '', fim: '' },
        sexta: { inicio: '', fim: '' },
        sabado: { inicio: '', fim: '' }
      },
      diasAtendimentoEditPerfil: {
        segunda: { inicio: '', fim: '' },
        terca: { inicio: '', fim: '' },
        quarta: { inicio: '', fim: '' },
        quinta: { inicio: '', fim: '' },
        sexta: { inicio: '', fim: '' },
        sabado: { inicio: '', fim: '' }
      },
      horarios: this.gerarHorarios(8, 18),
      formEdit: {},
      novaSenha: "",
      confirmarSenha: "",
      emailUsuario: "",
      loadingSenha: false,
      loadingEdicao: false,
      loadingExclusao: false,
      loadingDias: false,
      cpfInvalido: false,
      nomeValido: true,
      telefoneValido: true,
      hoje: new Date().toISOString().split("T")[0],
      especialidades: [
        'Cardiologia', 'Dermatologia', 'Endocrinologia', 'Gastroenterologia',
        'Ginecologia', 'Neurologia', 'Oftalmologia', 'Ortopedia',
        'Otorrinolaringologia', 'Pediatria', 'Psiquiatria', 'Urologia'
      ],
      ufs: [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
        'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
      ]
    };
  },
  async mounted() {
    await this.carregarPerfilDoUsuarioLogado();
  },
  methods: {
    gerarHorarios(inicio, fim) {
      const horarios = [];
      for (let hora = inicio; hora <= fim; hora++) {
        for (let minuto = 0; minuto < 60; minuto += 15) {
          const horaStr = hora.toString().padStart(2, '0');
          const minutoStr = minuto.toString().padStart(2, '0');
          horarios.push(`${horaStr}:${minutoStr}`);
        }
      }
      return horarios;
    },
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

        // Inicializar diasAtendimentoEdit e diasAtendimentoEditPerfil
        this.diasSemana.forEach(dia => {
          const atendimento = this.diasAtendimento.find(d => d.diaSemana === dia.value);
          if (atendimento) {
            this.diasAtendimentoEdit[dia.value] = {
              inicio: atendimento.horarioInicio || '',
              fim: atendimento.horarioFim || ''
            };
            this.diasAtendimentoEditPerfil[dia.value] = { ...this.diasAtendimentoEdit[dia.value] };
          } else {
            this.diasAtendimentoEdit[dia.value] = { inicio: '', fim: '' };
            this.diasAtendimentoEditPerfil[dia.value] = { inicio: '', fim: '' };
          }
        });
      } catch (error) {
        this.diasAtendimento = [];
      }
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
    },
    fecharModalDias() {
      this.showModalDias = false;
    },
    fecharModalDelete() {
      this.showModalDelete = false;
    },
    async salvarEdicao() {
      this.loadingEdicao = true;
      try {
        const response = await medicoApi.put(
          `/update/${this.medico.id}`,
          this.formEdit,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
            }
          }
        );
        this.medico = response.data;
        this.loadingEdicao = false;
        alert("Informações atualizadas com sucesso!");
        this.fecharModal();
      } catch (error) {
        console.error("Erro ao atualizar o perfil do médico:", error);
        this.loadingEdicao = false;
        alert("Erro ao atualizar o perfil. Verifique as permissões.");
      }
    },
    async salvarDias() {
      this.loadingDias = true;
      // Monta lista de objetos diasAtendimento a partir dos campos preenchidos
      let lista = [];
      this.diasSemana.forEach(dia => {
        const horariosDia = this.diasAtendimentoEdit[dia.value];
        if (horariosDia.inicio && horariosDia.fim) {
          lista.push({
            diaSemana: dia.value,
            horarioInicio: horariosDia.inicio,
            horarioFim: horariosDia.fim
          });
        }
      });

      try {
        await medicoApi.put(`/update/${this.medico.id}`,
          { diasAtendimento: lista },
          {
            headers: { Authorization: `Bearer ${sessionStorage.getItem("authToken")}` }
          }
        );
        // Atualiza a exibição no perfil
        this.diasSemana.forEach(dia => {
          this.diasAtendimentoEditPerfil[dia.value] = { ...this.diasAtendimentoEdit[dia.value] };
        });
        this.loadingDias = false;
        this.fecharModalDias();
        alert("Dias de atendimento atualizados!");
      } catch (error) {
        this.loadingDias = false;
        alert("Erro ao atualizar dias de atendimento.");
      }
    },
    confirmarExclusao() {
      this.showModalDelete = true;
    },
    async deletarConta() {
      this.loadingExclusao = true;
      try {
        await medicoApi.delete(`/deletar/${this.medico.id}`, {
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
        alert("Erro ao excluir conta.");
      }
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
        const response = await medicoApi.put(`/redefinir-senha/${this.medico.id}`, {
          novaSenha: this.novaSenha
        }, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
          }
        });
        alert(response.data);
        this.novaSenha = "";
        this.confirmarSenha = "";
        this.loadingSenha = false;
      } catch (error) {
        console.error("Erro ao redefinir senha:", error);
        this.loadingSenha = false;
        alert("Erro ao redefinir senha.");
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
    },
    formatarCPFExibicao(cpf) {
      if (!cpf) return "";
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    },
    formatarTelefone() {
      let telefone = this.formEdit.telefoneConsultorio.replace(/\D/g, '');
      if (telefone.length > 11) telefone = telefone.substring(0, 11);

      // Aplica máscara de telefone
      if (telefone.length === 11) {
        telefone = telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (telefone.length === 10) {
        telefone = telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      }

      this.formEdit.telefoneConsultorio = telefone;
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
    formatarValorConsulta(valor) {
      if (!valor) return "";
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(valor);
    },
    formatarValorConsultaInput(event) {
      // Remove qualquer caractere não numérico
      let valor = event.target.value.replace(/\D/g, '');
      // Converte para número e divide por 100 para obter os decimais
      valor = (parseInt(valor) / 100).toFixed(2);
      this.formEdit.valorConsulta = valor;
    },
    filtrarNome(event) {
      // Remove números e caracteres especiais, mantendo apenas letras, espaços e acentos
      let nome = event.target.value;
      nome = nome.replace(/[^a-zA-Z\u00C0-\u00FF\s']/g, '');
      this.formEdit.nome = nome;

      // Valida se o nome é válido
      const regex = /^[a-zA-Z\u00C0-\u00FF\s']+$/;
      this.nomeValido = regex.test(nome) && nome.trim().length > 0;
    },
    formatarDataNascimento(data) {
      if (!data) return '';
      return new Date(data).toLocaleDateString('pt-BR');
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
  max-width: 800px;
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

.invalid-feedback {
  display: block;
}

/* Estilos para o layout de duas colunas no modal */
.modal-body .row {
  display: flex;
  flex-wrap: wrap;
  margin-left: -8px;
  margin-right: -8px;
}

.modal-body .col-md-6 {
  padding-left: 8px;
  padding-right: 8px;
}

.input-group-text {
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-right: none;
}

.input-group .form-control {
  border-left: none;
}

/* Estilos para o modal de dias de atendimento */
.modal-body .col-md-4 {
  margin-bottom: 1rem;
}

.d-flex {
  display: flex;
}

.form-select {
  flex: 1;
  font-size: 0.875rem;
  padding: 0.4rem 0.75rem;
}

/* Melhorias para dispositivos móveis */
@media (max-width: 768px) {
  .modal-body .col-md-4 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .d-flex {
    flex-direction: column;
  }

  .form-select {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .form-select.me-2 {
    margin-right: 0 !important;
  }
}
</style>