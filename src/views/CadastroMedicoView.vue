<template>
  <div>
    <Navbar />
    <div class="container py-5 mt-5">
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div class="card shadow-lg border-0 rounded-4 p-5 bg-light">
            <div class="text-center d-flex align-items-center justify-content-center mb-3">
              <img src="@/assets/img/NexusSaude_vertical.png" alt="Logo Nexus Saúde"
                class="img-fluid logo-small me-3" />
              <h1 class="text-primary fw-bold">Nexus Saúde</h1>
            </div>
            <h3 class="text-center text-muted mb-5">Cadastro de Médico</h3>
            <form @submit.prevent="submitForm">
              <div class="row g-4">

                <!-- Nome Completo -->
                <div class="col-md-3">
                  <label for="nomeCompleto" class="form-label">Nome Completo</label>
                  <input v-model="form.nomeCompleto" type="text" id="nomeCompleto" class="form-control"
                    placeholder="Digite seu nome completo" required @input="validarNome" />
                </div>

                <!-- CPF -->
                <div class="col-md-3">
                  <label for="cpf" class="form-label">CPF</label>
                  <input v-model="form.cpf" @input="handleCPFInput" type="text" id="cpf" class="form-control"
                    placeholder="Digite seu CPF" required />
                </div>

                <!-- Sexo -->
                <div class="col-md-3">
                  <label for="sexo" class="form-label">Sexo</label>
                  <select v-model="form.sexo" id="sexo" class="form-select" required>
                    <option value="" disabled selected>Selecione o sexo</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="O">Outro</option>
                  </select>
                </div>

                <!-- Data de Nascimento -->
                <div class="col-md-3">
                  <label for="dataNascimento" class="form-label">Data de Nascimento</label>
                  <input v-model="form.dataNascimento" type="date" id="dataNascimento" class="form-control" required />
                </div>
              </div>

              <div class="row g-4 mt-3">

                <!-- CRM -->
                <div class="col-md-3">
                  <label for="crm" class="form-label">CRM</label>
                  <input v-model="form.crm" type="text" id="crm" class="form-control" placeholder="Digite o CRM"
                    @input="formatCRM" required />

                  <small v-if="crmInvalido" class="text-danger">
                    CRM inválido. Verifique o formato ou a UF.
                  </small>
                </div>

                <!-- UF -->
                <div class="col-md-3">
                  <label for="uf" class="form-label">UF</label>
                  <select v-model="form.uf" id="uf" class="form-select" required>
                    <option value="" disabled selected>Selecione a UF</option>
                    <option v-for="estado in ufs" :key="estado" :value="estado">
                      {{ estado }}
                    </option>
                  </select>
                </div>

                <!-- E-mail -->
                <div class="col-md-3">
                  <label for="email" class="form-label">E-mail</label>
                  <input v-model="form.email" type="email" id="email" class="form-control"
                    placeholder="seuemail@dominio.com" required />
                </div>

                <!-- Telefone -->
                <div class="col-md-3">
                  <label for="telefoneConsultorio" class="form-label">Telefone</label>
                  <input v-model="form.telefoneConsultorio" @input="handlePhoneInput" type="text"
                    id="telefoneConsultorio" class="form-control" placeholder="(00) 00000-0000" required />
                </div>
              </div>

              <div class="row g-4 mt-3">
                <!-- Valor da Consulta -->
                <div class="col-md-3">
                  <label for="valorConsulta" class="form-label">Valor da Consulta</label>
                  <input v-model="form.valorConsulta" type="text" id="valorConsulta" class="form-control"
                    placeholder="R$ 0,00" required @input="formatarValorConsulta" />
                  <small v-if="valorInvalido" class="text-danger">O valor da consulta deve ser maior que R$ 0,00</small>
                </div>

                <!-- Especialidade -->
                <div class="col-md-3">
                  <label for="especialidade" class="form-label">Especialidade</label>
                  <select v-model="form.especialidade" id="especialidade" class="form-select" required>
                    <option value="" disabled selected>
                      Selecione a especialidade
                    </option>
                    <option v-for="especialidade in especialidades" :key="especialidade" :value="especialidade">
                      {{ especialidade }}
                    </option>
                  </select>
                </div>

                <!-- Tempo Médio de Consulta -->
                <div class="col-md-3">
                  <label for="tempoConsulta" class="form-label">Tempo Médio de Consulta</label>
                  <select v-model="form.tempoConsulta" id="tempoConsulta" class="form-select" required>
                    <option value="" disabled selected>Selecione</option>
                    <option value="15">15 minutos</option>
                    <option value="30">30 minutos</option>
                    <option value="45">45 minutos</option>
                    <option value="60">1 hora</option>
                  </select>
                </div>

                <!-- Senha -->
                <div class="col-md-3">
                  <label for="senha" class="form-label">Senha</label>
                  <div class="input-group">
                    <input :type="showPassword ? 'text' : 'password'" v-model="form.senha" id="senha"
                      class="form-control" placeholder="Digite sua senha" required />
                    <button type="button" class="btn btn-outline-secondary" @click="togglePassword">
                      {{ showPassword ? "Ocultar" : "Mostrar" }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Horários de Atendimento -->
              <div class="mt-4">
                <label class="form-label">Horários de Atendimento</label>
                <div class="row">
                  <div class="col-md-4 mb-3" v-for="(dia, index) in Object.entries(diasAtendimento)" :key="index">
                    <div class="d-flex align-items-center">
                      <label class="me-2">{{
                        dia[0].charAt(0).toUpperCase() + dia[0].slice(1)
                      }}</label>
                      <select v-model="dia[1].inicio" class="form-select me-2" @change="validateHorario(dia)">
                        <option v-for="hora in horarios" :key="hora" :value="hora">
                          {{ hora }}
                        </option>
                      </select>
                      <select v-model="dia[1].fim" class="form-select" @change="validateHorario(dia)">
                        <option v-for="hora in horarios" :key="hora" :value="hora">
                          {{ hora }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botão Cadastrar -->
              <div class="text-center mt-4">
                <button type="submit" class="btn btn-primary btn-lg w-50 shadow">
                  Cadastrar
                </button>
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
import api from "@/services/http"; // Verifique se o caminho está correto
import {
  validarNome,
  validarCPF,
  formatarCRM,
  formatarValorConsulta,
  validarHorario,
  gerarHorarios,
} from "@/components/validators";
export default {
  name: "CadastroMedico",
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      ufs: [
        "AC",
        "AL",
        "AP",
        "AM",
        "BA",
        "CE",
        "DF",
        "ES",
        "GO",
        "MA",
        "MT",
        "MS",
        "MG",
        "PA",
        "PB",
        "PR",
        "PE",
        "PI",
        "RJ",
        "RN",
        "RS",
        "RO",
        "RR",
        "SC",
        "SP",
        "SE",
        "TO",
      ],
      horarios: gerarHorarios("07:00", "20:00", 15),
      diasAtendimento: {
        segunda: { inicio: "", fim: "" },
        terca: { inicio: "", fim: "" },
        quarta: { inicio: "", fim: "" },
        quinta: { inicio: "", fim: "" },
        sexta: { inicio: "", fim: "" },
        sabado: { inicio: "", fim: "" },
      },
      especialidades: [
        "Pediatria",
        "Cardiologia",
        "Dermatologia",
        "Ortopedia",
        "Neurologia",
        "Ginecologia",
        "Urologia",
        "Oftalmologia",
        "Endocrinologia",
        "Gastroenterologia",
        "Psiquiatria",
        "Otorrinolaringologia",
        "Reumatologia",
        "Nefrologia",
        "Oncologia",
        "Hematologia",
        "Pneumologia",
        "Infectologia",
        "Cirurgia Geral",
        "Anestesiologia",
        "Clínica Médica",
        "Medicina do Trabalho",
        "Medicina Esportiva",
        "Medicina Intensiva",
        "Radiologia",
        "Hepatologia",
        "Angiologia",
        "Nutrologia",
        "Geriatria",
        "Imunologia",
      ],
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
        tempoConsulta: "",
      },
      valorInvalido: false,
      showPassword: false,
      crmInvalido: false,
      daoService: null,
    };
  },
  methods: {
    formatarValorConsulta(valor) {
      let valorFormatado = valor.replace(/\D/g, "");
      if (valor === "" || parseFloat(valor) === 0) {
        return "R$ 0,00";
      }
      return (parseFloat(valor) / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
    validarNome(event) {
      this.form.nomeCompleto = validarNome(event.target.value);
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    handleCPFInput(event) {
      this.form.cpf = event.target.value
        .replace(/\D/g, "")
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2")
        .slice(0, 14);
      if (this.form.cpf.length === 14) {
        if (!validarCPF(this.form.cpf)) {
          alert("CPF inválido. Por favor, verifique.");
          this.form.cpf = "";
        }
      }
    },
    formatCRM(event) {
      this.form.crm = formatarCRM(event.target.value);
    },
    handlePhoneInput(event) {
      let phone = event.target.value.replace(/\D/g, "");
      phone = phone.replace(/^(\d{2})(\d)/g, "($1) $2");
      phone = phone.replace(/(\d{5})(\d)/, "$1-$2");
      this.form.telefoneConsultorio = phone.slice(0, 15);
    },
    validateHorario(dia) {
      const error = validarHorario(dia);
      if (error) {
        alert(error);
        dia[1].fim = "";
      }
    },
    formatarValorConsulta(event) {
      this.form.valorConsulta = formatarValorConsulta(event.target.value);
      this.valorInvalido = this.form.valorConsulta === "R$ 0,00";
    },
    async submitForm() {
      try {
        // Remover o símbolo 'R$' e garantir que o valor seja um número válido
        const valorConsulta = parseFloat(this.form.valorConsulta.replace(/[^\d.-]/g, ''));

        // Verificar se o valor da consulta é válido
        if (isNaN(valorConsulta) || valorConsulta <= 0) {
          alert("O valor da consulta não é válido.");
          return;
        }

        const response = await api.post('/medico/inserir', {
          nome: this.form.nomeCompleto,
          cpf: this.form.cpf,
          sexo: this.form.sexo,
          dataNascimento: this.form.dataNascimento,
          email: this.form.email,
          senha: this.form.senha,
          telefoneConsultorio: this.form.telefoneConsultorio,
          crm: this.form.crm,
          uf: this.form.uf,
          especialidade: this.form.especialidade,
          valorConsulta: valorConsulta,  // Enviando apenas o valor numérico
          tempoConsulta: this.form.tempoConsulta,
        });

        alert('Médico cadastrado com sucesso!');
        console.log(response.data);
      } catch (error) {
        console.error('Erro no cadastro:', error.response || error);
        if (error.response && error.response.data) {
          alert(`Erro ao cadastrar médico: ${error.response.data.message || 'Tente novamente.'}`);
        } else {
          alert('Erro ao cadastrar médico. Tente novamente.');
        }
      }
    }

  },
};
</script>

<style scoped>
.logo-small {
  max-width: 80px;
  animation: fadeIn 2s ease-in-out;
}

.text-center button {
  width: 50%;
}

.form-control,
.form-select {
  border-radius: 10px;
  border: 1px solid #ced4da;
}

.input-group button {
  border-radius: 10px;
}

.card {
  background-color: #f8f9fa;
}

button {
  transition: all 0.3s ease-in-out;
}

button:hover {
  transform: scale(1.05);
}
</style>
