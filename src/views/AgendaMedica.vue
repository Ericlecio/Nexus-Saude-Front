<template>
    <Navbar />
    <br />
    <div class="div-principal">
        <div class="container my-5">
            <BotaoVoltar />
            <h2 class="text-center text-primary fw-bold mb-4">Minhas Consultas</h2>

            <div v-if="carregando" class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
                <p class="mt-3 text-muted">Carregando suas consultas...</p>
            </div>

            <div v-else>
                <!-- Seleção de Médico -->
                <div class="mb-4 text-center">
                    <label for="medicoSelect" class="form-label fw-bold">Selecione o Médico:</label>
                    <select id="medicoSelect" class="form-select w-auto mx-auto" v-model="medicoSelecionado"
                        @change="carregarConsultas">
                        <option disabled value="">-- Selecione um Médico --</option>
                        <option v-for="medico in medicos" :key="medico.id" :value="medico.id">
                            {{ medico.nome }}
                        </option>
                    </select>
                </div>

                <ul class="nav nav-pills justify-content-center mb-4">
                    <li class="nav-item" v-for="opcao in opcoesFiltro" :key="opcao.valor">
                        <a class="nav-link" :class="{ active: filtroSituacao === opcao.valor }"
                            @click.prevent="filtrarPorSituacao(opcao.valor)">
                            {{ opcao.label }}
                        </a>
                    </li>
                </ul>

                <div class="table-responsive" v-if="consultasFiltradas.length">
                    <table class="table table-striped table-hover shadow-sm">
                        <thead class="table-primary">
                            <tr>
                                <th>Especialidade</th>
                                <th>Paciente</th>
                                <th>Telefone</th>
                                <th>Local</th>
                                <th>Data e Hora</th>
                                <th>Situação</th>
                                <th class="text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="consulta in consultasFiltradas" :key="consulta.agendamentoId"
                                :class="{ 'consulta-cancelada': consulta.situacao.toLowerCase().includes('cancelado') }">
                                <td>{{ consulta.especialidade || "Não informado" }}</td>
                                <td>{{ consulta.pacienteNome || "Não disponível" }}</td>
                                <td>{{ consulta.pacienteTelefone || "Não informado" }}</td>
                                <td>{{ consulta.local || "Não informado" }}</td>
                                <td>{{ consulta.data || "Não informado" }}</td>
                                <td>{{ consulta.situacao || "Não informado" }}</td>
                                <td class="text-center">
                                    <button v-if="consulta.situacao === 'Agendado'" class="btn btn-sm btn-warning"
                                        @click="confirmarAcao(consulta.agendamentoId, 'cancelar')">
                                        <i class="fas fa-ban"></i> Cancelar
                                    </button>
                                    <button v-if="consulta.situacao === 'Agendado'" class="btn btn-sm btn-success"
                                        @click="confirmarAcao(consulta.agendamentoId, 'Presente')">
                                        <i class="fas fa-check-circle"></i> Presente
                                    </button>
                                    <button v-if="consulta.situacao === 'Agendado'" class="btn btn-sm btn-danger"
                                        @click="confirmarAcao(consulta.agendamentoId, 'Ausente')">
                                        <i class="fas fa-times-circle"></i> Ausente
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p v-if="!consultasFiltradas.length && medicoSelecionado" class="text-center text-muted">
                    Nenhuma consulta encontrada para o médico selecionado e situação atual.
                </p>

                <p v-if="!medicoSelecionado" class="text-center text-muted">
                    Selecione um médico para ver as consultas.
                </p>
            </div>
        </div>

        <!-- Modal de confirmação -->
        <div v-if="showModal" class="modal-overlay">
            <div class="modal-content">
                <h4 class="text-center text-danger fw-bold">{{ modalMensagem.titulo }}</h4>
                <p class="text-center">{{ modalMensagem.texto }}</p>
                <div class="text-center mt-3">
                    <button class="btn btn-danger me-3" @click="confirmarAcaoModal">Confirmar</button>
                    <button class="btn btn-secondary" @click="showModal = false">Fechar</button>
                </div>
            </div>
        </div>

        <Footer />
    </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import BotaoVoltar from "@/components/BotaoVoltar.vue";
import { AgendamentoApi, medicoApi } from "@/services/http";

export default {
    name: "AgendaMedico",
    components: { Navbar, Footer, BotaoVoltar },
    data() {
        return {
            medicos: [],
            medicoSelecionado: "",
            consultas: [],
            carregando: false,
            showModal: false,
            consultaSelecionada: null,
            acaoSelecionada: null,
            modalMensagem: { titulo: "", texto: "" },
            filtroSituacao: "Agendado",
            opcoesFiltro: [
                { label: "Agendadas", valor: "Agendado" },
                { label: "Canceladas", valor: "Cancelado" },
                { label: "Finalizadas", valor: "Finalizado" },
                { label: "Presente", valor: "Presente" },
                { label: "Ausente", valor: "Ausente" },
            ],
        };
    },
    computed: {
        consultasFiltradas() {
            return this.consultas.filter(c => c.situacao === this.filtroSituacao);
        },
    },
    watch: {
        medicoSelecionado() {
            this.carregarConsultas();
        },
        filtroSituacao() {
            this.carregarConsultas();
        },
    },
    methods: {
        async carregarMedicos() {
            this.carregando = true;
            try {
                const response = await medicoApi.get("/listar");
                this.medicos = Array.isArray(response.data) ? response.data : [];
            } catch (error) {
                alert("Erro ao carregar médicos");
                console.error(error);
            } finally {
                this.carregando = false;
            }
        },

        async carregarConsultas() {
            if (!this.medicoSelecionado) {
                this.consultas = [];
                return;
            }
            this.carregando = true;
            try {
                const params = { medicoId: this.medicoSelecionado };
                if (this.filtroSituacao) params.situacao = this.filtroSituacao;

                const response = await AgendamentoApi.get("/listarPorMedico", { params });

                this.consultas = response.data.map(c => ({
                    agendamentoId: c.agendamentoId,
                    especialidade: c.especialidade,
                    pacienteNome: c.pacienteNome || "Não disponível",
                    pacienteTelefone: c.pacienteTelefone || "Não informado",
                    local: c.local,
                    data: c.data,
                    situacao: c.situacao,
                }));
            } catch (error) {
                alert("Erro ao carregar consultas");
                console.error(error);
            } finally {
                this.carregando = false;
            }
        },

        filtrarPorSituacao(valor) {
            this.filtroSituacao = valor;
        },

        confirmarAcao(id, acao) {
            this.consultaSelecionada = id;
            this.acaoSelecionada = acao;

            let titulo = "";
            let texto = "";

            if (acao === "Presente") {
                titulo = "Confirmar Presença";
                texto = "Tem certeza de que deseja marcar esta consulta como Presente?";
            } else if (acao === "Ausente") {
                titulo = "Confirmar Ausência";
                texto = "Tem certeza de que deseja marcar esta consulta como Ausente?";
            } else if (acao === "cancelar") {
                titulo = "Confirmar Cancelamento";
                texto = "Tem certeza de que deseja cancelar esta consulta?";
            }

            this.modalMensagem = { titulo, texto };
            this.showModal = true;
        },

        async confirmarAcaoModal() {
            if (!this.consultaSelecionada || !this.acaoSelecionada) return;

            try {
                let novaSituacao = this.acaoSelecionada;
                if (novaSituacao === "cancelar") novaSituacao = "Cancelado";

                await AgendamentoApi.put(`/update/${this.consultaSelecionada}`, {
                    situacaoId: this.getSituacaoIdPorDescricao(novaSituacao),
                });

                alert(`Consulta marcada como ${novaSituacao}`);
                this.showModal = false;
                this.carregarConsultas();
            } catch (error) {
                alert("Erro ao atualizar situação da consulta");
                console.error(error);
            }
        },

        getSituacaoIdPorDescricao(descricao) {
            const map = {
                Agendado: 1,
                Cancelado: 2,
                Finalizado: 3,
                Presente: 4, // ajuste conforme sua base
                Ausente: 5,  // ajuste conforme sua base
            };
            return map[descricao] || 1;
        },

        formatarDataHora(dataISO) {
            if (!dataISO) return null;
            const data = new Date(dataISO);
            return data.toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        },
    },
    mounted() {
        this.carregarMedicos();
    },
};
</script>


<style scoped>
.div-principal {
    margin-top: 5%;
}

.nav-pills .nav-link {
    color: #53ba83;
    cursor: pointer;
}

.nav-pills .nav-link.active {
    background-color: #53ba83;
    color: white;
}

.table {
    border: 1px solid #ddd;
    border-radius: 10px;
}

.consulta-cancelada td {
    text-decoration: line-through;
    background: rgba(0, 0, 30, 0.1);
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
    text-align: center;
}
</style>
