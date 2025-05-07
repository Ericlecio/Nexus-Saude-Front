<template>
  <div>
    <Navbar />
    <div class="container py-5 mt-5">
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div class="card shadow-lg border-0 rounded-4 p-5 bg-white position-relative">
            <div class="text-center position-absolute top-0 start-50 translate-middle-y mt-n5">
              <img src="@/assets/img/NexusSaude_vertical.png" alt="Logo Nexus Saúde" class="logo-small" />
            </div>
            <div class="text-center mt-5 pt-4">
              <h1 class="text-primary fw-bold">Cadastro de Médico</h1>
              <p class="text-muted mb-4">Etapa {{ step + 1 }} de 4 - {{ stepTitles[step] }}</p>
              <div class="progress rounded-pill bg-light shadow-sm mx-auto" style="height: 10px; max-width: 400px;">
                <div class="progress-bar bg-primary rounded-pill transition-bar" :style="{ width: progresso + '%' }">
                </div>
              </div>
            </div>

            <form class="mt-4" @submit.prevent="submitForm">
              <!-- Etapa 1: Dados Pessoais -->
              <div v-if="step === 0" class="row g-4">
                <div class="col-md-6">
                  <label class="form-label">Nome Completo</label>
                  <input v-model="form.nomeCompleto" type="text" class="form-control" @input="validarNome" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label">CPF</label>
                  <input v-model="form.cpf" type="text" class="form-control" @input="handleCPFInput" required />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Sexo</label>
                  <select v-model="form.sexo" class="form-select" required>
                    <option value="" disabled>Selecione</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="O">Outro</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Data de Nascimento</label>
                  <input v-model="form.dataNascimento" type="date" class="form-control" required />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Telefone</label>
                  <input v-model="form.telefoneConsultorio" type="text" class="form-control" @input="handlePhoneInput"
                    required />
                </div>
              </div>

              <!-- Etapa 2: Contato -->
              <div v-if="step === 1" class="row g-4">
                <div class="col-md-6">
                  <label class="form-label">E-mail</label>
                  <input v-model="form.email" type="email" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Senha</label>
                  <div class="input-group">
                    <input :type="showPassword ? 'text' : 'password'" v-model="form.senha" class="form-control"
                      required />
                    <button class="btn btn-outline-secondary" @click.prevent="togglePassword">
                      {{ showPassword ? 'Ocultar' : 'Mostrar' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Etapa 3: Profissional -->
              <div v-if="step === 2" class="row g-4">
                <div class="col-md-4">
                  <label class="form-label">CRM</label>
                  <input v-model="form.crm" type="text" class="form-control" @input="formatCRM" required />
                  <small v-if="crmInvalido" class="text-danger">CRM inválido</small>
                </div>
                <div class="col-md-4">
                  <label class="form-label">UF</label>
                  <select v-model="form.uf" class="form-select" required>
                    <option value="" disabled>Selecione a UF</option>
                    <option v-for="estado in ufs" :key="estado" :value="estado">{{ estado }}</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Especialidade</label>
                  <select v-model="form.especialidade" class="form-select" required>
                    <option value="" disabled>Selecione</option>
                    <option v-for="e in especialidades" :key="e" :value="e">{{ e }}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Valor da Consulta</label>
                  <input v-model="form.valorConsulta" type="text" class="form-control" @input="formatarValorConsulta"
                    required />
                  <small v-if="valorInvalido" class="text-danger">Valor deve ser maior que R$ 0,00</small>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Tempo Médio</label>
                  <select v-model="form.tempoConsulta" class="form-select" required>
                    <option value="" disabled>Selecione</option>
                    <option value="15">15 minutos</option>
                    <option value="30">30 minutos</option>
                    <option value="45">45 minutos</option>
                    <option value="60">1 hora</option>
                  </select>
                </div>
              </div>

              <!-- Etapa 4: Horários -->
              <div v-if="step === 3">
                <label class="form-label">Horários de Atendimento</label>
                <div class="row">
                  <div class="col-md-4 mb-3" v-for="(dia, index) in Object.entries(diasAtendimento)" :key="index">
                    <label>{{ dia[0].charAt(0).toUpperCase() + dia[0].slice(1) }}</label>
                    <div class="d-flex">
                      <select v-model="dia[1].inicio" class="form-select me-2" @change="validateHorario(dia)">
                        <option value="">Início</option>
                        <option v-for="h in horarios" :key="h" :value="h">{{ h }}</option>
                      </select>
                      <select v-model="dia[1].fim" class="form-select" @change="validateHorario(dia)">
                        <option value="">Fim</option>
                        <option v-for="h in horarios" :key="h" :value="h">{{ h }}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botões -->
              <div class="d-flex justify-content-between mt-4">
                <button v-if="step > 0" type="button" class="btn btn-outline-primary btn-lg px-4" @click="step--">←
                  Voltar</button>
                <button v-if="step < 3" type="button" class="btn btn-primary btn-lg ms-auto px-4"
                  @click="proximo">Próximo →</button>
                <button v-else type="submit" class="btn btn-success btn-lg ms-auto px-5">✔ Cadastrar Médico</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
/* Animação para suavizar a entrada da logo */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estilo da logo adaptado para melhor legibilidade e consistência */
.logo-small {
  max-width: 120px;
  height: auto;
  margin-top: 100%;
  margin-bottom: 16px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  background-color: transparent;
  box-shadow: none;
  border-radius: 12px;
  animation: fadeIn 0.8s ease-in-out;
}

/* Barra de progresso suave */
.progress-bar {
  transition: width 0.5s ease-in-out;
  background: linear-gradient(90deg, #007bff, #17a2b8);
}

/* Cartão principal */
.card {
  background: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
  position: relative;
}

/* Botões */
button {
  transition: all 0.25s ease-in-out;
  border-radius: 0.6rem;
}

button:hover {
  transform: scale(1.04);
}

/* Campos de formulário */
.form-control,
.form-select {
  border-radius: 12px;
  border: 1px solid #ced4da;
  font-size: 0.95rem;
  box-shadow: none;
  padding: 10px 14px;
}

.form-control:focus,
.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
  outline: none;
}

/* Botão de senha */
.input-group button {
  border-radius: 0 0.6rem 0.6rem 0;
}

/* Labels */
label.form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 4px;
}

/* Avisos */
small.text-danger {
  font-size: 0.85rem;
  margin-top: 2px;
  display: block;
}

/* Responsividade básica */
@media (max-width: 768px) {
  .logo-small {
    max-width: 90px;
    margin-bottom: 12px;
  }

  button.btn {
    width: 100%;
  }
}
</style>

<script>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import { medicoApi } from '@/services/http'; // Importando apenas medicoApi
import {
  validarNome,
  validarCPF,
  formatarCRM,
  formatarValorConsulta,
  validarHorario,
  gerarHorarios,
  handlePhoneInput,
  handleCPFInput
} from '@/components/validators';

export default {
  components: { Navbar, Footer },
  data() {
    return {
      step: 0,
      stepTitles: ['Dados Pessoais', 'Contato e Acesso', 'Profissionais', 'Disponibilidade'],
      showPassword: false,
      valorInvalido: false,
      crmInvalido: false,
      ufs: ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"],
      especialidades: ["Pediatria", "Cardiologia", "Dermatologia", "Ortopedia", "Neurologia"],
      horarios: gerarHorarios("07:00", "20:00", 15),
      diasAtendimento: {
        segunda: { inicio: "", fim: "" },
        terca: { inicio: "", fim: "" },
        quarta: { inicio: "", fim: "" },
        quinta: { inicio: "", fim: "" },
        sexta: { inicio: "", fim: "" },
        sabado: { inicio: "", fim: "" }
      },
      form: {
        nomeCompleto: "",
        cpf: "",
        sexo: "",
        dataNascimento: "",
        email: "",
        senha: "",
        telefoneConsultorio: "",
        crm: "",
        uf: "",
        especialidade: "",
        valorConsulta: "R$ 0,00",
        tempoConsulta: ""
      }
    }
  },
  computed: {
    progresso() {
      return ((this.step + 1) / 4) * 100;
    }
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    validarNome(e) {
      this.form.nomeCompleto = validarNome(e.target.value);
    },
    handleCPFInput(e) {
      this.form.cpf = handleCPFInput(e.target.value);
      if (this.form.cpf.length === 14 && !validarCPF(this.form.cpf)) {
        alert("CPF inválido.");
        this.form.cpf = "";
      }
    },
    handlePhoneInput(e) {
      this.form.telefoneConsultorio = handlePhoneInput(e.target.value);
    },
    formatCRM(e) {
      this.form.crm = formatarCRM(e.target.value);
      this.crmInvalido = this.form.crm.length < 5;
    },
    formatarValorConsulta(e) {
      this.form.valorConsulta = formatarValorConsulta(e.target.value);
      const valor = parseFloat(this.form.valorConsulta.replace(/[^\d.-]/g, ''));
      this.valorInvalido = isNaN(valor) || valor <= 0;
    },
    validateHorario(dia) {
      const erro = validarHorario(dia);
      if (erro) {
        alert(erro);
        dia[1].fim = "";
      }
    },
    proximo() {
      this.step++;
    },
    async submitForm() {
      try {
        const valor = parseFloat(this.form.valorConsulta.replace(/[^\d,-]/g, '').replace(',', '.'));

        if (isNaN(valor) || valor <= 0) {
          alert("Valor da consulta inválido.");
          return;
        }

        const payload = {
          nome: this.form.nomeCompleto,
          cpf: this.form.cpf,
          sexo: this.form.sexo,
          dataNascimento: this.form.dataNascimento,
          email: this.form.email.toLowerCase(),
          senha: this.form.senha,
          telefoneConsultorio: this.form.telefoneConsultorio,
          crm: this.form.crm,
          uf: this.form.uf,
          especialidade: this.form.especialidade,
          valorConsulta: valor,
          tempoConsulta: this.form.tempoConsulta,
        };

        const response = await medicoApi.post('/inserir', payload);

        alert("Médico cadastrado com sucesso!");
        console.log(response.data);
      } catch (error) {
        console.error("Erro ao cadastrar médico:", error);
        alert("Erro ao cadastrar médico. Verifique os dados e tente novamente.");
      }
    }
  }
};
</script>
