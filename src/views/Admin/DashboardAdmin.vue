<template>
    <Navbar />
    <div class="dashboard">
        <div class="content">
            <h1 class="title">Painel Administrativo</h1>
            <div class="dashboard-stats">
                <div class="stat-card">
                    <h3>Médicos Cadastrados</h3>
                    <p>{{ doctorsCount }}</p>
                    <router-link to="/medicoAdmin">
                        <button>Ver Médicos</button>
                    </router-link>
                </div>
                <div class="stat-card">
                    <h3>Pacientes Cadastrados</h3>
                    <p>{{ patientsCount }}</p>
                    <router-link to="/pacienteAdmin">
                        <button>Ver Pacientes</button>
                    </router-link>
                </div>
                <div class="stat-card">
                    <h3>Agendamentos Ativos</h3>
                    <p>{{ agendamentosAtivos }}</p>
                    <router-link to="/agendamentos">
                        <button>Ver Agendamentos</button>
                    </router-link>
                </div>
                <div class="stat-card">
                    <h3>Consultas Realizadas</h3>
                    <p>{{ consultasRealizadas }}</p>
                    <router-link to="/consultas">
                        <button>Ver Consultas</button>
                    </router-link>
                </div>
            </div>

            <div class="relatorio-section">
                <h2>Relatórios</h2>
                <p>Baixe os relatórios completos de agendamentos e histórico de consultas.</p>
                <button class="btn-relatorio">
                    📥 Baixar Relatório de Consultas
                </button>
            </div>
        </div>
    </div>
    <Footer />
</template>

<script>
import { medicoApi } from '@/services/http';
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

export default {
    components: { Navbar, Footer },
    data() {
        return {
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
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.dashboard {
    background-color: #f5f6fa;
    min-height: 100vh;
    padding-top: 80px;
    display: flex;
    justify-content: center;
}

.content {
    width: 100%;
    max-width: 100%;
    padding: 40px 20px;
    background-color: #f5f6fa;
}

.title {
    font-size: 2.2rem;
    font-weight: bold;
    color: #03052b;
    margin-bottom: 30px;
    text-align: center;
}

.dashboard-stats {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 40px;
}

.stat-card {
    background-color: #fff;
    padding: 20px 25px;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    flex: 1;
    min-width: 250px;
    max-width: 280px;
    transition: transform 0.2s ease-in-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
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

.stat-card button {
    margin-top: 10px;
    background: none;
    border: 1px solid #000;
    padding: 6px 12px;
    cursor: pointer;
    font-weight: 500;
    border-radius: 6px;
}

button i,
.fa {
    color: #53ba83;
}

.relatorio-section {
    background: #fff;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    margin-top: 30px;
    text-align: center;
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