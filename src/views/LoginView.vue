<template>
  <Navbar />
  <div class="main-container">
    <div class="login-container">
      <div class="login-form">
        <div class="header">
          <h2 v-if="!isResettingPassword">Bem-Vindo</h2>
          <h1>Nexus Saúde</h1>
        </div>

        <div v-if="!isResettingPassword">
          <div class="user-type-selector">
            <label>
              <input type="radio" name="userType" value="paciente" v-model="userType" />
              Paciente
            </label>
            <label>
              <input type="radio" name="userType" value="medico" v-model="userType" />
              Médico
            </label>
          </div>

          <form @submit.prevent="login">
            <div v-if="userType === 'paciente'">
              <div class="btn-container">
                <button type="button" @click="loginWithGoogle" class="btn-google">
                  <i class="fab fa-google"></i> Login com Google
                </button>
              </div>
            </div>

            <div v-if="userType === 'medico'">
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

              <div class="options">
                <a href="#" @click.prevent="isResettingPassword = true">Esqueceu a Senha?</a>
              </div>

              <div class="btn-container">
                <button type="submit" class="btn">Entrar</button>
              </div>
            </div>
          </form>
        </div>

        <div v-else>
          <h2>Redefinir Senha</h2>
          <p>Digite seu e-mail cadastrado e enviaremos um link para redefinir sua senha.</p>

          <form @submit.prevent="resetPassword">
            <div class="input-group">
              <i class="fas fa-envelope"></i>
              <input type="email" v-model="email" placeholder="Digite seu e-mail" required class="input-field" />
            </div>

            <div class="btn-container">
              <button type="submit" class="btn">Enviar Link</button>
            </div>

            <p class="back-login">
              <a href="#" @click.prevent="isResettingPassword = false">Voltar para o Login</a>
            </p>
          </form>
        </div>
      </div>

      <div class="logo-container">
        <img src="@/assets/img/NexusSaude_vertical.png" alt="Logo Nexus Saúde" class="logo" />
        <a href="#" class="create-account" @click.prevent="goToCadastro">Criar Conta Médica</a>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

export default {
  name: "LoginScreen",
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      userType: "paciente",
      email: "",
      password: "",
      showPassword: false,
      isResettingPassword: false,
    };
  },
  created() {
    this.verificarUsuarioLogado();

    const { userType, email, senha } = this.$route.query;
    if (userType) this.userType = userType;
    if (email) this.email = email;
    if (senha) this.password = senha;
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    goToCadastro() {
      this.$router.push("/cadastro");
    },

    async verificarUsuarioLogado() {
      const auth = getAuth();
      const db = getFirestore();

      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const pacienteRef = doc(db, "pacientes", firebaseUser.uid);
            const medicoRef = doc(db, "medicos", firebaseUser.uid);

            const [pacienteSnap, medicoSnap] = await Promise.all([
              getDoc(pacienteRef),
              getDoc(medicoRef),
            ]);

            if (pacienteSnap.exists()) {
              // ✅ Redireciona paciente
              sessionStorage.setItem("user", JSON.stringify({
                id: firebaseUser.uid,
                ...pacienteSnap.data(),
                tipo: "paciente"
              }));
              this.$router.push("/");
            } else if (medicoSnap.exists()) {
              // ✅ Redireciona médico
              sessionStorage.setItem("user", JSON.stringify({
                id: firebaseUser.uid,
                ...medicoSnap.data(),
                tipo: "medico"
              }));
              this.$router.push("/");
            } else {
              // ❌ Usuário inválido, faz logout
              await signOut(auth);
            }
          } catch (error) {
            console.error("Erro ao verificar usuário logado:", error);
          }
        }
      });
    }
    ,

    async login() {
      try {
        const auth = getAuth();
        const db = getFirestore();

        // 🔹 Autentica normalmente com email/senha
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const userId = userCredential.user.uid;

        // 🔹 Verifica se o usuário é médico
        const medicoRef = doc(db, "medicos", userId);
        const medicoSnap = await getDoc(medicoRef);

        if (medicoSnap.exists()) {
          // ✅ Login permitido
          sessionStorage.setItem("user", JSON.stringify({
            id: userId,
            ...medicoSnap.data(),
            tipo: "medico"
          }));
          this.$router.push("/").then(() => window.location.reload());
        } else {
          // ❌ Se não for médico, bloquear
          alert("Erro: Apenas médicos podem fazer login com email e senha.");
          await signOut(auth);
        }

      } catch (error) {
        console.error("Erro ao autenticar médico:", error);
        alert("Email ou senha inválidos.");
      }
    }
    ,

    async loginWithGoogle() {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const db = getFirestore();

      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userId = user.uid;

        // 🔹 Verifica se o usuário já está na coleção de médicos (médico não pode usar Google)
        const medicoRef = doc(db, "medicos", userId);
        const medicoSnap = await getDoc(medicoRef);

        if (medicoSnap.exists()) {
          alert("Erro: Médicos não podem fazer login com o Google.");
          await signOut(auth);
          return;
        }

        // 🔹 Verifica se o usuário já está na coleção de pacientes
        const pacienteRef = doc(db, "pacientes", userId);
        const pacienteSnap = await getDoc(pacienteRef);

        if (!pacienteSnap.exists()) {
          // Se ainda não estiver cadastrado, adiciona no banco de dados
          await setDoc(pacienteRef, {
            nomeCompleto: user.displayName || "Nome não informado",
            email: user.email,
            telefone: user.phoneNumber || "Não informado",
            dataCadastro: new Date().toISOString(),
          });
        }

        // ✅ Login permitido para pacientes
        sessionStorage.setItem("user", JSON.stringify({
          id: userId,
          tipo: "paciente",
          email: user.email
        }));

        this.$router.push("/").then(() => window.location.reload());

      } catch (error) {
        console.error("Erro ao autenticar com o Google:", error);
        alert("Erro ao autenticar com o Google. Tente novamente.");
      }
    }
    ,

    async resetPassword() {
      if (!this.email) {
        alert("Por favor, insira um e-mail válido.");
        return;
      }

      const auth = getAuth();
      try {
        await sendPasswordResetEmail(auth, this.email);
        alert("E-mail de redefinição enviado! Verifique sua caixa de entrada.");
        this.isResettingPassword = false;
      } catch (error) {
        alert("Erro ao enviar o e-mail. Verifique se o e-mail está correto.");
      }
    },

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