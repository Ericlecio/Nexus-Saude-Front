<template>
  <div>
    <Navbar />
    <div class="container py-5">
      <BotaoVoltar />

      <!-- Campo para inserir ID do médico -->
      <div class="mb-4">
        <label for="medicoId" class="form-label">Digite o ID do Médico</label>
        <input v-model="medicoId" type="number" id="medicoId" class="form-control" placeholder="ID do médico"
          required />
        <button @click="carregarPerfil" class="btn btn-primary mt-2">Carregar Perfil</button>
      </div>

      <!-- Se o médico for carregado -->
      <div v-if="medico">
        <!-- Seção de Identidade do Medico -->
        <div class="card shadow-sm mb-4" id="informacoespessois">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-info-circle me-2 text-primary"></i>
              <strong>Informações Pessoais</strong>
              <i class="fas fa-edit ms-2 text-primary cursor-pointer" @click="abrirModal('info')"></i>
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
      medico: null, // Inicializando o objeto médico
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
        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
        "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
        "SP", "SE", "TO",
      ],
      especialidades: [
        "Pediatria", "Cardiologia", "Dermatologia", "Ortopedia", "Neurologia",
        "Ginecologia", "Urologia", "Oftalmologia", "Endocrinologia", "Gastroenterologia",
        "Psiquiatria", "Otorrinolaringologia", "Reumatologia", "Nefrologia", "Oncologia",
        "Hematologia", "Pneumologia", "Infectologia", "Cirurgia Geral", "Anestesiologia",
        "Clínica Médica", "Medicina do Trabalho", "Medicina Esportiva", "Medicina Intensiva",
        "Radiologia", "Hepatologia", "Angiologia", "Nutrologia", "Geriatria", "Imunologia",
      ],
    };
  },
  methods: {
    async carregarPerfil() {
      try {
        if (!this.medicoId) {
          alert("Por favor, insira o ID do médico.");
          return;
        }

        const response = await this.$http.get(`http://localhost:8080/Medico/${this.medicoId}`);

        console.log(response.data); // Verifique a estrutura da resposta da API

        if (response.status === 200) {
          this.medico = response.data;

          if (!this.medico) {
            alert("Médico não encontrado.");
          }
        } else {
          alert("Erro ao carregar o perfil do médico.");
        }
      } catch (error) {
        console.error("Erro ao carregar o perfil do médico:", error);
        alert("Erro ao carregar o perfil. Verifique o ID e tente novamente.");
      }
    },

    // Funções auxiliares (para formatar valores, status, etc.)
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
        horarios.push(`${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`);
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
    // Pode começar com médico nulo ou vazio
    this.medico = null;
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