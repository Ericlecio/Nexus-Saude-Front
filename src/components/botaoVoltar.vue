<template>
  <button class="btn-voltar" @click="voltarPagina">
    <i class="fas fa-arrow-left"></i> Voltar
  </button>
</template>

<script>
export default {
  name: "BotaoVoltar",
  methods: {
    voltarPagina() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.btn-voltar {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e88e5, #1565c0);
  color: white;
  font-size: 0.9rem;
  font-weight: bold;
  border: none;
  padding: 8px 18px;
  border-radius: 6px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-top: 8%;
}

.btn-voltar i {
  margin-right: 8px;
  transition: transform 0.3s ease-in-out;
}

.btn-voltar:hover {
  background: linear-gradient(135deg, #1565c0, #0d47a1);
  transform: translateY(-2px);
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.3);
}

.btn-voltar:active {
  transform: translateY(1px);
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

@media (max-width: 480px) {
  .btn-voltar {
    width: 100%;
    margin-top: 30%;
    margin-bottom: 5%;
  }
}
</style>
