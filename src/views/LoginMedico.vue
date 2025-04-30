<template>
  <Navbar />
  <div class="main-container">
    <div class="login-container">
      <!-- Formulário à Esquerda -->
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
            <i class="fas fa-id-card"></i>
            <input type="text" v-model="crm" placeholder="CRM" required class="input-field" />
          </div>

          <div class="input-group">
            <i class="fas fa-lock"></i>
            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Senha" required
              class="input-field" />
          </div>

          <div class="show-password" @click="togglePassword">
            <span>{{ showPassword ? "Ocultar Senha" : "Mostrar Senha" }}</span>
          </div>

          <div class="remember-section">
            <label for="remember" class="remember-label">
              <input type="checkbox" id="remember" /> Lembrar Sempre
            </label>
            <a href="#" class="forgot-password">Esqueceu a Senha?</a>
          </div>

          <div class="btn-container">
            <button type="submit" class="btn">Entrar</button>
          </div>
        </form>

        <div class="logo-container">
          <a href="#" class="create-account" @click.prevent="goToCadastro">Criar Conta Médica</a>
        </div>
      </div>

      <!-- Logo à Direita -->
      <div class="logo-side">
        <img src="@/assets/img/NexusSaude_vertical.png" alt="Logo Nexus Saúde" class="logo" />
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
      crm: "",
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
      if (this.email && this.crm && this.password) {
        alert("Médico autenticado com sucesso.");
        this.$router.push("/home");
      } else {
        alert("Email, CRM ou senha inválidos.");
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
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.login-container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(26, 26, 60, 0.1);
  overflow: hidden;
}

.login-form {
  width: 50%;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #000524;
  color: #fff;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  font-size: 2rem;
  color: #fff;
  font-weight: bold;
}

h2 {
  color: #53ba83;
  font-size: 1.5rem;
  margin-bottom: 20px;
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
  padding: 15px 15px 15px 40px;
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
  margin-bottom: 15px;
}

.remember-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.remember-label {
  font-size: 0.9rem;
}

.forgot-password {
  color: #53ba83;
  font-size: 0.9rem;
}

.btn-container {
  text-align: center;
  margin-top: 20px;
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

.create-account {
  text-align: center;
  color: #53ba83;
  font-size: 1rem;
  text-decoration: none;
  font-weight: bold;
  margin-top: 15px;
}

.create-account:hover {
  text-decoration: underline;
}

.logo-side {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
}

.logo {
  max-width: 70%;
  height: auto;
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    width: 100%;
    padding: 20px;
  }

  .login-form {
    width: 100%;
  }

  .logo-side {
    width: 100%;
    margin-top: 20px;
  }

  .logo {
    max-width: 50%;
  }

  h1 {
    font-size: 1.8rem;
  }

  h2 {
    font-size: 1.3rem;
  }

  .input-field {
    font-size: 0.9rem;
  }

  .btn {
    font-size: 1rem;
    padding: 12px;
  }
}
</style>
