<template>
    <div class="sidebar">
        <div class="sidebar-header">
            <h2>Admin</h2>
        </div>
        <ul class="nav-list">
            <li><router-link to="/">📊 Dashboard</router-link></li>
            <li><router-link to="/doctors">🩺 Médicos</router-link></li>
            <li><router-link to="/patients">🙍‍♂️ Pacientes</router-link></li>
            <li><router-link to="/consultas">📁 Consultas</router-link></li>
            <li><router-link to="/relatorios">📄 Relatórios</router-link></li>
        </ul>
    </div>
</template>

<style scoped>
.sidebar {
    width: 240px;
    background-color: #03052b;
    color: white;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    padding: 30px 20px;
    box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
    font-size: 1.6rem;
    font-weight: bold;
    margin-bottom: 40px;
    text-align: center;
    color: #53ba83;
}

.nav-list {
    list-style: none;
    padding: 0;
}

.nav-list li {
    margin-bottom: 25px;
}

.nav-list a {
    color: #fff;
    text-decoration: none;
    font-size: 1.05rem;
    display: block;
    padding: 10px 15px;
    border-radius: 8px;
    transition: background 0.3s ease;
}

.nav-list a.router-link-active,
.nav-list a:hover {
    background-color: #53ba83;
    color: #000;
}
</style>

<script>
export default {
    name: 'Sidebar'
};
</script>