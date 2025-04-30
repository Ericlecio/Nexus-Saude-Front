<template>
  <div>
    <Navbar />
    <div class="container py-5">
      <BotaoVoltar />
      <h1 class="text-center mb-4 text-primary"> </h1>

      <div v-if="medico">
        <!-- Seção de Identidade do Medico -->
        <div class="card shadow-sm mb-4" id="informacoespessois">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-info-circle me-2 text-primary"></i>
              <strong>Informações Pessoais</strong>
              <i class="fas fa-edit ms-2 text-primary cursor-pointer" @click="abrirModal('info')"></i>
            </h5>
            <p><strong>Nome Completo:</strong> {{ medico.nomeCompleto }}</p>
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

        <!-- Horários de Atendimento -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-clock me-2 text-primary"></i>
              <strong>Horários de Atendimento</strong>
              <i class="fas fa-edit ms-2 text-primary cursor-pointer" @click="abrirModal('horarios')"></i>
            </h5>
            <ul class="list-unstyled">
              <li v-for="(horarios, dia) in medico.diasAtendimento" :key="dia">
                <strong>{{ formatDia(dia) }}:</strong>
                <span v-if="horarios.length > 0">
                  {{ horarios[0] }} - {{ horarios[horarios.length - 1] }}
                </span>
                <span v-else class="text-muted">Sem horário definido</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Histórico de Consultas -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-calendar-alt me-2 text-primary"></i>
              <strong>Histórico de Consultas</strong>
            </h5>
            <div v-if="agenda.length">
              <table class="table table-striped table-hover">
                <thead class="table table-striped">
                  <tr>
                    <th>Paciente</th>
                    <th>Telefone</th>
                    <th>Data e Hora</th>
                    <th>Local</th>
                    <th>Especialidade</th>
                    <th>Valor</th>
                    <th>Situação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="consulta in agenda" :key="consulta.id">
                    <td>{{ consulta.pacienteNome || "Não informado" }}</td>
                    <td>{{ consulta.pacienteTelefone || "Não informado" }}</td>
                    <td>{{ consulta.data || "Sem data" }}</td>
                    <td>{{ consulta.local || "Não informado" }}</td>
                    <td>{{ consulta.especialidade || "Não informado" }}</td>
                    <td>{{ consulta.valorConsulta || "Não informado" }}</td>
                    <td><span :class="statusClass(consulta.situacao)">
                        <i :class="statusIcon(consulta.situacao)"></i> {{ consulta.situacao }}
                      </span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-else class="text-muted text-center">
              Nenhuma consulta encontrada.
            </p>
          </div>
        </div>

        <div class="botoes-acao">
          <button class="btn btn-warning" @click="abrirModal('senha')">
            Alterar Senha
          </button>

          <div class="text-center mt-4">
            <button class="btn btn-danger" @click="abrirModal('exclusao')">
              Excluir Conta
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center mt-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
      </div>

      <!-- Modal de Alteração de Senha -->
      <div v-if="showModalSenha" class="modal-overlay">
        <div class="modal-content">
          <h4 class="text-center text-primary">Alterar Senha</h4>
          <form @submit.prevent="alterarSenha">
            <label>Nova Senha</label>
            <input v-model="novaSenha" type="password" class="form-control" required minlength="6" />

            <label>Confirmar Nova Senha</label>
            <input v-model="confirmarSenha" type="password" class="form-control" required minlength="6" />

            <div class="mt-3 text-center">
              <button type="submit" class="btn btn-success">Salvar</button>
              <button type="button" class="btn btn-secondary ms-2" @click="fecharModal">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal de Edição -->
      <div v-if="showModalEdit" class="modal-overlay">
        <div class="modal-content">
          <h4>
            {{
              campoSelecionado === "info"
                ? "Editar Informações Pessoais"
                : "Editar Horários de Atendimento"
            }}
          </h4>
          <form @submit.prevent="salvarEdicao">
            <template v-if="campoSelecionado === 'info'">
              <label>Nome Completo</label>
              <input v-model="formEdit.nomeCompleto" type="text" class="form-control" required @input="validarNome" />

              <label>Telefone</label>
              <input v-model="formEdit.telefoneConsultorio" type="text" class="form-control" @input="formatarTelefone"
                required />

              <label>CRM</label>
              <input v-model="formEdit.crm" type="text" class="form-control" maxlength="6" @input="formatarCRM"
                @blur="validarCRM" required />


              <label>CPF</label>
              <input v-model="formEdit.cpf" type="text" class="form-control" required maxlength="14"
                @input="formatarCPF" />

              <label>Valor da Consulta (R$)</label>
              <input v-model="formEdit.valorConsulta" type="text" class="form-control" @input="formatarValorConsulta"
                placeholder="0,00" required />


              <label>Especialidade</label>
              <select v-model="formEdit.especialidade" id="especialidade" class="form-select" required>
                <option value="" disabled selected>
                  Selecione a especialidade
                </option>
                <option v-for="especialidade in especialidades" :key="especialidade" :value="especialidade">
                  {{ especialidade }}
                </option>
              </select>

              <label>UF</label>
              <select v-model="formEdit.uf" class="form-control" required>
                <option v-for="uf in ufOptions" :key="uf" :value="uf">
                  {{ uf }}
                </option>
              </select>

              <label>Data de Nascimento</label>
              <input v-model="formEdit.dataNascimento" type="date" class="form-control" :max="hoje"
                @change="validarIdade" />
              <small v-if="erroIdade" class="text-danger">O médico deve ter no mínimo 18 anos.</small>
            </template>

            <template v-if="campoSelecionado === 'horarios'">
              <div class="container">
                <div class="row">
                  <div class="col-md-4 mb-3" v-for="dia in diasSemana" :key="dia">
                    <div class="d-flex align-items-center">
                      <label class="me-2">{{ formatDia(dia) }}</label>

                      <select v-model="formEdit.diasAtendimento[dia].inicio" class="form-select me-2"
                        @change="validateHorario(dia)">
                        <option value="">Início</option>
                        <option v-for="hora in horariosDisponiveis" :key="hora" :value="hora">
                          {{ hora }}
                        </option>
                      </select>

                      <select v-model="formEdit.diasAtendimento[dia].fim" class="form-select me-2"
                        @change="validateHorario(dia)">
                        <option value="">Fim</option>
                        <option v-for="hora in horariosDisponiveis" :key="hora" :value="hora">
                          {{ hora }}
                        </option>
                      </select>

                      <button class="btn btn-danger btn-sm ms-2" @click="removerDia(dia)"
                        v-if="formEdit.diasAtendimento[dia].inicio">
                        Limpar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div class="mt-3 text-center">
              <button type="submit" class="btn btn-success">Salvar</button>
              <button type="button" class="btn btn-secondary ms-2" @click="fecharModal">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal de Confirmação de Exclusão -->
      <div v-if="showModalExclusao" class="modal-overlay d-flex justify-content-center align-items-center" style="
          position: fixed;
          z-index: 1;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
        ">
        <div class="modal-content p-4 bg-white rounded shadow" style="width: 300px">
          <h4 class="text-center text-danger">Confirmar Exclusão</h4>
          <p class="text-center">
            Insira sua senha para confirmar a exclusão da conta.
          </p>

          <input v-model="senhaExclusao" type="password" class="form-control mb-3" placeholder="Digite sua senha"
            required />

          <div class="text-center">
            <button @click="excluirConta" class="btn btn-danger">
              Confirmar Exclusão
            </button>
            <button @click="fecharModal" class="btn btn-secondary ms-2">
              Cancelar
            </button>
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

export default {
  name: "PerfilMedico",
  components: { Navbar, Footer, BotaoVoltar },
  data() {
    return {
      showModalSenha: false,
      novaSenha: "",
      confirmarSenha: "",
      showModalExclusao: false,
      senhaExclusao: "",
      medico: null,
      medicoId: null,
      showModalEdit: false,
      campoSelecionado: "",
      formEdit: {},
      hoje: new Date().toISOString().split("T")[0],
      horariosDisponiveis: this.gerarHorarios("07:00", "20:00", 15),
      diasSemana: ["segunda", "terca", "quarta", "quinta", "sexta", "sabado"],
      duracaoConsulta: 30,
      agenda: [],
      ufOptions: [
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
    formatarValorConsulta(event) {
      let valor = event.target.value.replace(/\D/g, "");

      if (valor === "" || isNaN(parseInt(valor, 10))) {
        this.formEdit.valorConsulta = "R$ 0,00";
        return;
      }
      valor = (parseInt(valor, 10) / 100).toFixed(2);
      this.formEdit.valorConsulta = `R$ ${valor.replace(".", ",")}`;
    },
    async carregarAgenda() {
      // Simulação de dados para o histórico de consultas
      this.agenda = [
        { id: 1, pacienteNome: "João Silva", pacienteTelefone: "123456789", data: "2025-05-01 10:00", local: "Clínica A", especialidade: "Cardiologia", valorConsulta: "R$ 150,00", situacao: "Confirmada" },
        { id: 2, pacienteNome: "Ana Oliveira", pacienteTelefone: "987654321", data: "2025-05-03 14:00", local: "Clínica B", especialidade: "Dermatologia", valorConsulta: "R$ 180,00", situacao: "Pendente" }
      ];
    },
    formatarCPF(event) {
      let cpf = event.target.value.replace(/\D/g, "");
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      this.formEdit.cpf = cpf;
    },
    formatarTelefone(event) {
      let telefone = event.target.value.replace(/\D/g, "");
      telefone = telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      this.formEdit.telefoneConsultorio = telefone.slice(0, 15);
    },
    abrirModal(campo) {
      this.fecharModal();
      this.campoSelecionado = campo;
      this.showModalEdit = true;
      this.formEdit = { ...this.medico };
    },
    fecharModal() {
      this.showModalEdit = false;
      this.showModalSenha = false;
      this.showModalExclusao = false;
    },
    salvarEdicao() {
      alert("Simulando a atualização dos dados.");
      this.fecharModal();
    },
    excluirConta() {
      alert("Simulando a exclusão de conta.");
    },
    formatDia(dia) {
      const dias = {
        segunda: "Segunda-feira",
        terca: "Terça-feira",
        quarta: "Quarta-feira",
        quinta: "Quinta-feira",
        sexta: "Sexta-feira",
        sabado: "Sábado",
      };
      return dias[dia] || dia;
    },
    gerarHorarios(inicio, fim, intervalo) {
      const horarios = [];
      let [hora, minuto] = inicio.split(":").map(Number);
      const [fimHora, fimMinuto] = fim.split(":").map(Number);

      while (hora < fimHora || (hora === fimHora && minuto <= fimMinuto)) {
        horarios.push(
          `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`
        );
        minuto += intervalo;
        if (minuto >= 60) {
          minuto -= 60;
          hora++;
        }
      }
      return horarios;
    },
  },
  mounted() {
    this.medico = {
      nomeCompleto: "Dr. João Souza",
      email: "dr.joao@saude.com",
      telefoneConsultorio: "(11) 12345-6789",
      crm: "12345",
      especialidade: "Cardiologia",
      uf: "SP",
      sexo: "Masculino",
      cpf: "123.456.789-10",
      valorConsulta: "R$ 200,00",
      dataNascimento: "1980-01-01",
      diasAtendimento: {
        segunda: ["08:00", "18:00"],
        terca: ["08:00", "18:00"],
        quarta: ["08:00", "18:00"],
        quinta: ["08:00", "18:00"],
        sexta: ["08:00", "18:00"],
        sabado: [],
      },
    };
    this.carregarAgenda();
  },
};
</script>


<style scoped>
/* Overlay do modal */
.modal-overlay {
  z-index: 1000;
  position: fixed;
  top: 5%;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

/* Modal responsivo */
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
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

/* Inputs e elementos alinhados */
.container {
  max-width: 90%;
}

.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.col-md-4 {
  width: 100%;
  margin-bottom: 12px;
}

/* Ajuste dos horários */
.d-flex {
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.d-flex label {
  text-align: center;
  font-weight: bold;
  font-size: 1rem;
}

/* Inputs e selects responsivos */
.form-select {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  transition: border-color 0.3s ease;
}

.form-select:focus {
  border-color: #007bff;
  outline: none;
}

/* Botão de remover horário */
.btn-danger {
  width: 100%;
  max-width: 200px;
  margin-top: 8px;
  padding: 10px;
  font-size: 1rem;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.btn-danger:hover {
  background: #dc3545;
  color: white;
}

/* Responsividade melhorada para telas menores */
@media (max-width: 768px) {
  .modal-content {
    max-width: 95%;
    padding: 15px;
  }

  .container h4 {
    font-size: 1.4rem;
    text-align: center;
    margin-bottom: 10px;
  }

  .form-select {
    font-size: 0.9rem;
    padding: 8px;
  }

  .btn-danger {
    font-size: 0.9rem;
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .modal-content {
    max-width: 100%;
    padding: 12px;
  }

  .form-select {
    font-size: 0.85rem;
    padding: 6px;
  }

  .btn-danger {
    font-size: 0.85rem;
    padding: 6px;
  }
}
</style>