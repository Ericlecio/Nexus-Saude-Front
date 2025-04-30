<template>
    <div class="sidebar">
        <ul>
            <li><router-link to="/">Dashboard</router-link></li>
            <li><router-link to="/doctors">Médicos</router-link></li>
            <li><router-link to="/patients">Pacientes</router-link></li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'Sidebar'
};
</script>

<style scoped>
.sidebar {
    width: 200px;
    background: #f4f4f4;
    padding: 20px;
    height: 100vh;
    position: fixed;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    margin: 20px 0;
}

router-link {
    color: #333;
    text-decoration: none;
    font-size: 18px;
}
</style>