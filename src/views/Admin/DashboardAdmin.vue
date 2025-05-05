<template>
    <div class="dashboard">
        <Sidebar />
        <div class="content">
            <h1 class="title">Painel Administrativo</h1>

            <div class="dashboard-stats">
                <div class="stat-card">
                    <h3>Médicos Cadastrados</h3>
                    <p>{{ doctorsCount }}</p>
                    <router-link to="/doctors">Ver Médicos</router-link>
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
        </div>
    </div>
</template>

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
</style>

<script>
import Sidebar from '/src/views/Admin/Sidebar.vue';

export default {
    components: { Sidebar },
    data() {
        return {
            doctorsCount: 50,
            patientsCount: 120,
            agendamentosAtivos: 30,
            consultasRealizadas: 200
        };
    }
};
</script>