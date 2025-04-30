<template>
  <Navbar />
  <div class="main-container">
    <div class="login-container">
      <div class="login-form">
        <div class="header">
          <h2>Bem-Vindo</h2>
          <h1>Nexus Saúde</h1>
        </div>

        <form @submit.prevent="loginMedico">
          <div class="input-group">
            <i class="fas fa-user"></i>
            <input type="email" v-model="email" placeholder="E-mail" required class="input-field" />
          </div>

          <div class="input-group">
            <i class="fas fa-lock"></i>
            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Senha" required
              class="input-field" />
          </div>

          <div class="show-password" @click="togglePassword">
            <span>{{ showPassword ? "Ocultar Senha" : "Mostrar Senha" }}</span>
          </div>

          <div class="btn-container">
            <button type="submit" class="btn">Entrar</button>
          </div>
        </form>

        <div class="logo-container">
          <img src="@/assets/img/NexusSaude_vertical.png" alt="Logo Nexus Saúde" class="logo" />
          <a href="#" class="create-account" @click.prevent="goToCadastro">Criar Conta Médica</a>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "LoginMedico",
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
    };
  },
  methods: {
    goToCadastro() {
      this.$router.push("/cadastro-medico");
    },

    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    loginMedico() {
      // Simula a autenticação de médico
      if (this.email && this.password) {
        alert("Médico autenticado com sucesso.");
        this.$router.push("/home");
      } else {
        alert("Email ou senha inválidos.");
      }
    }
  },
};
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  font-family: "Poppins", sans-serif;
  height: 100%;
  background: linear-gradient(to right, #000524, #53ba83);
}

.main-container {
  margin-top: 65px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 20px 20px;
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-container {
  display: flex;
  width: 90%;
  max-width: 1100px;
  background-color: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgb(26, 26, 60);
}

.login-form {
  flex: 1;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-form header {
  text-align: center;
}

.logo-container {
  flex: 1;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 30px;
  color: #000524;
}

.login-container a {
  color: #000524;
}

.logo {
  max-width: 70%;
  height: auto;
  margin-bottom: 20px;
}

h1 {
  color: #000524;
  font-size: 2.5rem;
  font-weight: bold;
}

h2 {
  color: #53ba83;
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.user-type-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.user-type-selector label {
  font-size: 1.1rem;
  color: #000524;
  margin: 0 15px;
}

.input-group {
  position: relative;
  margin-bottom: 20px;
}

.input-group i {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  color: #999;
}

.input-field {
  width: 100%;
  padding: 15px 15px 15px 50px;
  border-radius: 25px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 1rem;
}

.input-field:focus {
  border-color: #53ba83;
  box-shadow: 0 0 8px rgba(83, 186, 131, 0.5);
}

.show-password {
  text-align: center;
  color: #53ba83;
  cursor: pointer;
}

.options {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.options a {
  color: #000524;
  text-decoration: none;
  font-weight: bold;
}

.options a:hover {
  text-decoration: underline;
}

.btn-container {
  text-align: center;
}

.btn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 25px;
  background-color: #53ba83;
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
}

.btn:hover {
  background-color: #000524;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 30px;
}

.header h1,
.header h2 {
  text-align: center;
  width: 100%;
}

.btn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 25px;
  background-color: #28a745;
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #218838;
}

.create-account {
  text-align: center;
  color: white;
  font-size: 1.1rem;
  text-decoration: none;
  font-weight: bold;
  transition: 0.3s ease;
}

.create-account:hover {
  text-decoration: underline;
}

.btn-google {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 25px;
  background-color: #db4437;
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
}

.btn-google:hover {
  background-color: #b2301b;
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column-reverse;
    width: 100%;
    max-width: 450px;
    box-shadow: none;
    border-radius: 10px;
  }

  .login-form {
    padding: 30px;
    text-align: center;
  }

  .logo-container {
    padding: 20px;
    text-align: center;
  }

  .logo {
    max-width: 60%;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  .user-type-selector {
    flex-direction: column;
  }

  .user-type-selector label {
    margin-bottom: 10px;
  }

  .input-group {
    margin-bottom: 15px;
  }

  .input-field {
    padding: 12px 12px 12px 40px;
    font-size: 0.9rem;
  }

  .btn {
    font-size: 1rem;
    padding: 12px;
  }

  .btn-google {
    font-size: 1rem;
    padding: 12px;
  }

  .options {
    flex-direction: column;
    text-align: center;
  }

  .options a {
    margin-top: 10px;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 10px;
    max-width: 100%;
    box-shadow: none;
  }

  .login-form {
    padding: 20px;
  }

  .logo {
    max-width: 50%;
  }

  h1 {
    font-size: 1.8rem;
  }

  h2 {
    font-size: 1rem;
  }

  .btn {
    font-size: 0.9rem;
    padding: 10px;
  }

  .btn-google {
    font-size: 0.9rem;
    padding: 10px;
  }

  .create-account {
    font-size: 1rem;
  }
}

.options {
  text-align: center;
  margin-top: 10px;
}

.options a {
  color: #53ba83;
  font-weight: bold;
  text-decoration: none;
}

.options a:hover {
  text-decoration: underline;
}

.back-login {
  margin-top: 15px;
  text-align: center;

}

.back-login a {
  color: #53ba83;
  font-weight: bold;
  text-decoration: none;
}

.back-login a:hover {
  text-decoration: underline;
}
</style>