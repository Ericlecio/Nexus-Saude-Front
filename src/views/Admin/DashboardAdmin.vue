<template>
    <div class="dashboard">
        <Sidebar />
        <div class="content">
            <!-- PAINEL PRINCIPAL -->
            <template v-if="telaAtual === 'dashboard'">
                <h1 class="title">Painel Administrativo</h1>

                <div class="dashboard-stats">
                    <div class="stat-card">
                        <h3>Médicos Cadastrados</h3>
                        <p>{{ doctorsCount }}</p>
                        <button @click="telaAtual = 'medicos'">Ver Médicos</button>
                    </div>
                    <div class="stat-card">
                        <h3>Pacientes Cadastrados</h3>
                        <p>{{ patientsCount }}</p>
                        <router-link to="/patients">Ver Pacientes</router-link>
                    </div>
                    <div class="stat-card">
                        <h3>Agendamentos Ativos</h3>
                        <p>{{ agendamentosAtivos }}</p>
                        <router-link to="/agendamentos">Ver Agendamentos</router-link>
                    </div>
                    <div class="stat-card">
                        <h3>Consultas Realizadas</h3>
                        <p>{{ consultasRealizadas }}</p>
                        <router-link to="/consultas">Ver Consultas</router-link>
                    </div>
                </div>

                <div class="relatorio-section">
                    <h2>Relatórios</h2>
                    <p>Baixe os relatórios completos de agendamentos e histórico de consultas.</p>
                    <button class="btn-relatorio">
                        📥 Baixar Relatório de Consultas
                    </button>
                </div>
            </template>

            <!-- LISTA DE MÉDICOS -->
            <template v-else-if="telaAtual === 'medicos'">
                <button class="btn-voltar" @click="telaAtual = 'dashboard'">← Voltar</button>
                <h2>Lista de Médicos</h2>
                <div class="top-bar">
                    <button @click="irParaCadastro">Adicionar Médico</button>
                    <input type="text" v-model="searchTerm" placeholder="Buscar por nome, CPF ou CRM..."
                        class="search-input" />
                </div>

                <div v-if="doctors.length === 0" class="no-doctors">
                    <p>Não há médicos cadastrados.</p>
                </div>

                <table v-else>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Especialidade</th>
                            <th>Email</th>
                            <th>CRM</th>
                            <th>Telefone</th>
                            <th>UF</th>
                            <th>Valor</th>
                            <th>Dias de Atendimento</th>
                            <th>CPF</th>
                            <th>Sexo</th>
                            <th>Tempo Consulta</th>
                            <th>Data Nasc.</th>
                            <th>Cadastrado</th>
                            <th>Criado em</th>
                            <th>Atualizado em</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="doctor in filteredDoctors" :key="doctor.id">
                            <td>{{ doctor.nome }}</td>
                            <td>{{ doctor.especialidade }}</td>
                            <td>{{ doctor.email }}</td>
                            <td>{{ doctor.crm }}</td>
                            <td>{{ doctor.telefoneConsultorio }}</td>
                            <td>{{ doctor.uf }}</td>
                            <td>R$ {{ doctor.valorConsulta?.toFixed(2).replace('.', ',') }}</td>
                            <td>
                                <ul>
                                    <li v-for="dia in doctor.diasAtendimento" :key="dia.id">
                                        {{ dia.diaSemana }} - {{ dia.horario }}
                                    </li>
                                </ul>
                            </td>
                            <td>{{ doctor.cpf || '-' }}</td>
                            <td>{{ doctor.sexo || '-' }}</td>
                            <td>{{ doctor.tempoConsulta ? doctor.tempoConsulta + ' min' : '-' }}</td>
                            <td>{{ formatarData(doctor.dataNascimento) }}</td>
                            <td>{{ formatarDataHora(doctor.dataCadastro) }}</td>
                            <td>{{ formatarDataHora(doctor.createdAt) }}</td>
                            <td>{{ formatarDataHora(doctor.updatedAt) }}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="edit" @click="editarMedico(doctor)">
                                        <i class="fas fa-pen"></i>
                                    </button>
                                    <button class="delete" @click="excluirMedico(doctor.id)">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>

            <!-- CADASTRO DE MÉDICO -->
            <template v-else-if="telaAtual === 'cadastroMedico'">
                <button class="btn-voltar" @click="telaAtual = 'medicos'">← Voltar</button>
                <CadastroMedico @cadastro-finalizado="telaAtual = 'medicos'" />
            </template>
        </div>
    </div>
</template>

<script>
import Sidebar from '/src/views/Admin/Sidebar.vue';
import CadastroMedico from '/src/views/CadastroMedicoView.vue';
import { medicoApi } from '@/services/http';

export default {
    components: { Sidebar, CadastroMedico },
    data() {
        return {
            telaAtual: 'dashboard',
            doctors: [],
            searchTerm: "",
            doctorsCount: 0,
            patientsCount: 0,
            agendamentosAtivos: 0,
            consultasRealizadas: 0
        };
    },
    computed: {
        filteredDoctors() {
            const term = this.searchTerm.toLowerCase();
            return this.doctors.filter(doc =>
                doc.nome?.toLowerCase().includes(term) ||
                doc.cpf?.includes(term) ||
                doc.crm?.toLowerCase().includes(term)
            );
        }
    },
    async mounted() {
        await this.fetchStats();
        this.fetchDoctors();
    },
    methods: {
        async fetchStats() {
            try {
                const response = await fetch("http://localhost:8080/admin/dashboard-stats");
                const data = await response.json();
                this.doctorsCount = data.doctorsCount;
                this.patientsCount = data.patientsCount;
                this.agendamentosAtivos = data.agendamentosAtivos;
                this.consultasRealizadas = data.consultasRealizadas;
            } catch (error) {
                console.error("Erro ao buscar estatísticas", error);
            }
        },
        async fetchDoctors() {
            try {
                const response = await medicoApi.get('/listar');
                this.doctors = response.data;
            } catch (error) {
                console.error('Erro ao buscar médicos:', error);
            }
        },
        irParaCadastro() {
            this.telaAtual = 'cadastroMedico';
        },
        editarMedico(doctor) {
            this.$router.push({ name: 'editDoctor', params: { id: doctor.id } });
        },
        async excluirMedico(id) {
            if (confirm('Deseja realmente excluir?')) {
                try {
                    await medicoApi.delete(`/deletar/${id}`);
                    this.fetchDoctors();
                } catch (error) {
                    console.error('Erro ao excluir médico:', error);
                }
            }
        },
        formatarData(data) {
            if (!data) return '-';
            return new Date(data).toLocaleDateString('pt-BR');
        },
        formatarDataHora(dataHora) {
            if (!dataHora) return '-';
            return new Date(dataHora).toLocaleString('pt-BR');
        }
    }
};
</script>


<style scoped>
.dashboard {
    display: flex;
    background-color: #f5f6fa;
    min-height: 100vh;
}

.content {
    flex: 1;
    padding: 40px;
    margin-left: 240px;
}

.title {
    font-size: 2.2rem;
    font-weight: bold;
    color: #03052b;
    margin-bottom: 30px;
}

.dashboard-stats {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 40px;
}

.stat-card {
    background-color: #fff;
    padding: 20px 25px;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    flex: 1;
    min-width: 250px;
    transition: transform 0.2s ease-in-out;
}

.stat-card:hover {
    transform: scale(1.03);
}

.stat-card h3 {
    font-size: 1.1rem;
    margin-bottom: 10px;
    color: #333;
}

.stat-card p {
    font-size: 2rem;
    font-weight: bold;
    color: #53ba83;
}

.stat-card a {
    margin-top: 10px;
    display: inline-block;
    color: #007BFF;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
}

.stat-card a:hover {
    text-decoration: underline;
}

.relatorio-section {
    background: #fff;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.relatorio-section h2 {
    margin-bottom: 10px;
    color: #03052b;
}

.relatorio-section p {
    margin-bottom: 20px;
    color: #555;
}

.btn-relatorio {
    background-color: #53ba83;
    color: white;
    border: none;
    padding: 12px 24px;
    font-weight: bold;
    border-radius: 25px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s ease;
}

.btn-relatorio:hover {
    background-color: #3aa86d;
}

.btn-voltar {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: bold;
    margin-bottom: 20px;
    cursor: pointer;
    transition: 0.3s;
}

.btn-voltar:hover {
    background-color: #5a6268;
}
</style>
