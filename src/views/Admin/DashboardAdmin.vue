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
                        <a href="#" @click.prevent="telaAtual = 'medicos'">Ver Médicos</a>
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
                <DoctorList @novo-medico="telaAtual = 'cadastroMedico'" />
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
import DoctorList from '/src/views/Admin/DoctorsList.vue'; // ajuste o caminho se necessário
import CadastroMedico from '/src/views/CadastroMedicoView.vue'; // ajuste conforme seu projeto

export default {
    components: { Sidebar, DoctorList, CadastroMedico },
    data() {
        return {
            telaAtual: 'dashboard',
            doctorsCount: 0,
            patientsCount: 0,
            agendamentosAtivos: 0,
            consultasRealizadas: 0
        };
    },
    async mounted() {
        await this.fetchStats();
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
