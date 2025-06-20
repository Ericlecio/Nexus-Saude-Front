<template>
  <Navbar />
  <div class="main-container">
    <div class="login-container">
      <div class="login-form">
        <div class="header">
          <h2>Bem-Vindo</h2>
          <h1>Nexus Saúde</h1>
        </div>

        <form @submit.prevent="loginPaciente">
          <div class="input-group">
            <i class="fas fa-user"></i>
            <input type="email" v-model="email" placeholder="E-mail" class="input-field" required />
          </div>

          <div class="input-group">
            <i class="fas fa-lock"></i>
            <input type="password" v-model="password" placeholder="Senha" class="input-field" required />
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

        <div class="options">
          <a href="#" class="create-account" @click.prevent="goToCadastro">Criar Conta</a>
        </div>
      </div>

      <div class="logo-container">
        <img src="@/assets/img/NexusSaude_vertical.png" alt="Logo Nexus Saúde" class="logo" />
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import axios from "axios";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "LoginView",
  components: { Navbar, Footer },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async loginPaciente() {
      try {
        // Faz login e obtém o token
        const response = await axios.post("http://localhost:8080/auth/login", {
          email: this.email,
          senha: this.password,
        });

        const token = response.data.accessToken;
        sessionStorage.setItem("authToken", token); // ✅ salva no sessionStorage

        // Armazena o tipo de usuário (opcional, se o backend enviar)
        if (response.data.role) {
          sessionStorage.setItem("userRole", response.data.role);
        }

        // Valida se está autenticado
        const perfilResponse = await axios.get("http://localhost:8080/usuarios/logado", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const usuario = perfilResponse.data;

        // Salva nome e ID (se quiser usar no Navbar, por exemplo)
        sessionStorage.setItem("userId", usuario.id);
        sessionStorage.setItem("userNome", usuario.nome);

        // Redireciona conforme o tipo de usuário
        if (usuario.role === "PACIENTE") {
          this.$router.push("/agendar");
        } else if (usuario.role === "MEDICO") {
          this.$router.push("/agenda");
        } else {
          this.$router.push("/");
        }

      } catch (error) {
        alert("Erro de login. Verifique e-mail e senha.");
        console.error("Login error:", error);
      }
    },
    goToCadastro() {
      this.$router.push("/cadastroPaciente");
    },
  },
};
</script>

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
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
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
  padding: 16px 15px 16px 45px;
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

.options {
  text-align: center;
  margin-top: 10px;
}

.create-account {
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  text-decoration: none;
}

.create-account:hover {
  text-decoration: underline;
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

.btn-google {
  background-color: #53ba83;
  color: #fff;
  border: none;
  padding: 14px 24px;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  max-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-google i {
  font-size: 1.2rem;
}

.btn-google:hover {
  background-color: #3aa86d;
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column-reverse;
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

  .btn-google {
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