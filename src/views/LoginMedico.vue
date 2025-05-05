<template>
  <Navbar />
  <div class="main-container">
    <div class="login-container">
      <!-- Lado Esquerdo: Logo + botão de criar conta -->
      <div class="logo-container">
        <img src="@/assets/img/NexusSaude_vertical.png" alt="Logo Nexus Saúde" class="logo" />
        <button type="button" class="btn-create-account" @click="goToCadastro">
          Criar Conta Médica
        </button>
      </div>

      <!-- Lado Direito: Formulário -->
      <div class="login-form">
        <div class="header">
          <h2>Bem-Vindo</h2>
          <h1>Nexus Saúde</h1>
        </div>

        <form @submit.prevent="loginMedico">
          <div class="input-group">
            <i class="fas fa-envelope"></i>
            <input type="email" v-model="email" placeholder="E-mail" required class="input-field" />
          </div>

          <div class="input-group">
            <i class="fas fa-id-card"></i>
            <input type="text" v-model="crm" placeholder="CRM" required class="input-field" />
          </div>

          <div class="input-group password-group">
            <i class="fas fa-lock"></i>
            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Senha" required
              class="input-field" />
            <span class="toggle-password" @click="togglePassword">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </span>
          </div>

          <div class="remember-section">
            <label class="remember-label">
              <input type="checkbox" /> Lembrar Sempre
            </label>
            <a href="#" class="forgot-password">Esqueceu a Senha?</a>
          </div>

          <div class="btn-container">
            <button type="submit" class="btn-primary">Entrar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
body {
  font-family: "Poppins", sans-serif;
  background: linear-gradient(to right, #000524, #53ba83);
  margin: 0;
  padding: 0;
}

.main-container {
  margin-top: 65px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 20px;
}

.login-container {
  display: flex;
  width: 100%;
  max-width: 1100px;
  height: 600px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.logo-container {
  flex: 1;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  text-align: center;
}

.logo {
  max-width: 85%;
  height: auto;
  margin-bottom: 40px;
}

.btn-create-account {
  background-color: #03052b;
  color: #53ba83;
  border: 2px solid #53ba83;
  padding: 12px 24px;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.btn-create-account:hover {
  background-color: #53ba83;
  color: #000;
  border-color: #53ba83;
}

.login-form {
  flex: 1;
  background-color: #03052b;
  padding: 60px 40px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.header {
  text-align: center;
  width: 100%;
  margin-bottom: 40px;
}

.header h2 {
  font-size: 1.5rem;
  color: #53ba83;
  margin-bottom: 5px;
}

.header h1 {
  font-size: 2.3rem;
  font-weight: bold;
  color: white;
}

.input-group {
  position: relative;
  width: 100%;
  max-width: 440px;
  margin: 0 auto 25px auto;
}

.input-group i {
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  color: #666;
  font-size: 1.1rem;
}

.input-field {
  width: 100%;
  padding: 16px 45px 16px 45px;
  border-radius: 18px;
  border: none;
  font-size: 1rem;
  background: #fff;
  color: #333;
}

.input-field::placeholder {
  color: #888;
  font-weight: 500;
}

.password-group .toggle-password {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #666;
  font-size: 1.2rem;
}

.password-group .toggle-password:hover {
  color: #53ba83;
}

.password-group .input-field {
  padding-right: 50px !important;
}

.remember-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 440px;
  margin: 0 auto 25px auto;
  font-size: 0.9rem;
}

.remember-label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
}

.forgot-password {
  color: #53ba83;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn-container {
  display: flex;
  justify-content: center;
  max-width: 440px;
  margin: 0 auto 20px auto;
  width: 100%;
}

.btn-primary {
  width: 100%;
  padding: 16px;
  border: 2px solid #fff;
  border-radius: 30px;
  background-color: transparent;
  color: #fff;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.btn-primary:hover {
  background-color: #53ba83;
  color: #000;
  border-color: #53ba83;
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    border-radius: 10px;
  }

  .logo-container,
  .login-form {
    width: 100%;
  }

  .logo {
    max-width: 60%;
  }

  .input-group,
  .btn-container,
  .remember-section {
    max-width: 90%;
  }

  .header h1 {
    font-size: 2rem;
  }

  .header h2 {
    font-size: 1.2rem;
  }
}
</style>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "LoginMedico",
  components: { Navbar, Footer },
  data() {
    return {
      email: "",
      crm: "",
      password: "",
      showPassword: false
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
      if (this.email && this.crm && this.password) {
        alert("Médico autenticado com sucesso.");
        this.$router.push("/home");
      } else {
        alert("Email, CRM ou senha inválidos.");
      }
    }
  }
};
</script>