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
        // Garante que o usuário seja carregado corretamente ao montar o componente
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
/* Container do botão */
.btn-container {
    display: flex;
    justify-content: center;
    /* Centraliza horizontalmente */
    margin: 20px 0;
    width: 100%;
    /* Garante que o container ocupe toda a largura */
}

/* Estilo do botão */
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

/* Ícone do botão */
.btn-marcar-consulta i {
    margin-right: 10px;
    transition: transform 0.3s ease-in-out;
}

/* Efeito hover */
.btn-marcar-consulta:hover {
    background: linear-gradient(135deg, #2E7D32, #1B5E20);
    transform: translateY(-2px);
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.3);
}

/* Efeito ao clicar */
.btn-marcar-consulta:active {
    transform: translateY(1px);
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

/* Responsividade */
@media (max-width: 768px) {
    .btn-container {
        display: flex;
        justify-content: center;
        /* Mantém centralizado em telas pequenas */
    }

    .btn-marcar-consulta {
        width: 100%;
        /* Faz o botão ocupar toda a largura */
        max-width: 300px;
        /* Limita o tamanho para não ficar exagerado */
        text-align: center;
    }
}
</style>
