<template>
    <div class="dashboard">
        <Sidebar />
        <div class="content">
            <h1>Admin Dashboard</h1>
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
            </div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import Sidebar from './Sidebar.vue';

export default {
    components: {
        Sidebar
    },
    data() {
        return {
            doctorsCount: 50, // Exemplo, pode vir de uma API
            patientsCount: 120 // Exemplo, pode vir de uma API
        };
    }
};
</script>

<style scoped>
.dashboard {
    display: flex;
}

.content {
    flex: 1;
    padding: 20px;
}

.dashboard-stats {
    display: flex;
    gap: 20px;
}

.stat-card {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 200px;
}

.stat-card h3 {
    font-size: 16px;
}

.stat-card p {
    font-size: 24px;
    font-weight: bold;
}

a {
    text-decoration: none;
    color: #007BFF;
}
</style>