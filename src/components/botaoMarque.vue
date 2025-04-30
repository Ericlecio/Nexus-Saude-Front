<template>
    <div class="btn-container">
        <button v-if="user && user.tipo === 'paciente'" class="btn-marcar-consulta" @click="marcarConsulta">
            <i class="fas fa-calendar-check"></i> Marque Sua Consulta
        </button>
    </div>
</template>

<script>
export default {
    name: "BotaoMarcarConsulta",
    data() {
        return {
            user: null
        };
    },
    mounted() {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            this.user = JSON.parse(storedUser);
        }
    },
    methods: {
        marcarConsulta() {
            this.$router.push('/Agendamento');
        },
    },
};
</script>

<style scoped>
.btn-container {
    display: flex;
    justify-content: center;
    margin: 20px 0;
    width: 100%;
}

.btn-marcar-consulta {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #43A047, #2E7D32);
    color: white;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.btn-marcar-consulta i {
    margin-right: 10px;
    transition: transform 0.3s ease-in-out;
}

.btn-marcar-consulta:hover {
    background: linear-gradient(135deg, #2E7D32, #1B5E20);
    transform: translateY(-2px);
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.3);
}

.btn-marcar-consulta:active {
    transform: translateY(1px);
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
    .btn-container {
        display: flex;
        justify-content: center;
    }

    .btn-marcar-consulta {
        width: 100%;
        max-width: 300px;
        text-align: center;
    }
}
</style>
