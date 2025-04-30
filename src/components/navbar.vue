<template>
  <nav class="navbar navbar-expand-lg fixed-top" :class="{ scrolled: isScrolled }">
    <div class="container">
      <router-link class="navbar-brand" to="/">
        <img src="/src/assets/img/NexusSaude_horizontal.png" alt="Nexus Saúde" class="logo" />
      </router-link>

      <button class="navbar-toggler" type="button" @click="toggleCollapse">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" :class="{ show: !isCollapsed }">
        <ul class="navbar-nav mx-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/sobre">Quem Somos</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/contato">Fale Conosco</router-link>
          </li>
        </ul>

        <div class="dropdown ms-3">
          <a href="#" class="d-flex align-items-center perfil-link" data-bs-toggle="dropdown">
            <i class="bi bi-person-circle"></i>
            <span v-if="user">{{ user.nomeCompleto }}</span>
          </a>
          <ul class="dropdown-menu dropdown-menu-end animate-dropdown">
            <li v-if="!user">
              <router-link class="dropdown-item" to="/login">Login</router-link>
            </li>

            <li v-if="user && user.tipo === 'paciente'">
              <router-link class="dropdown-item" to="/perfilPaciente">Meu Perfil</router-link>
              <router-link class="dropdown-item" to="/consultasAgendadas">Minhas Consultas</router-link>
            </li>

            <li v-if="user && user.tipo === 'medico'">
              <router-link class="dropdown-item" to="/perfilMedico">Meu Perfil</router-link>
              <router-link class="dropdown-item" to="/agendaMedica">Minha Agenda</router-link>
            </li>

            <li v-if="user">
              <router-link class="dropdown-item logout-btn" to="/" @click.prevent="logout">
                Sair
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>

export default {
  data() {
    return {
      isScrolled: false,
      isCollapsed: true,
      user: null,
    };
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
    async logout() {
      try {
        const auth = getAuth();
        await signOut(auth);

        sessionStorage.clear();
        localStorage.clear();

        this.user = null;

        this.$router.push("/login");

      } catch (error) {
        console.error("Erro ao fazer logout:", error);
        alert("Erro ao sair. Tente novamente.");
      }
    },
    async verificarUsuario() {
      const auth = getAuth();
      const db = getFirestore();

      auth.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const pacienteRef = doc(db, "pacientes", firebaseUser.uid);
            const medicoRef = doc(db, "medicos", firebaseUser.uid);
            const [pacienteSnap, medicoSnap] = await Promise.all([
              getDoc(pacienteRef),
              getDoc(medicoRef),
            ]);

            if (pacienteSnap.exists()) {
              this.user = {
                id: firebaseUser.uid,
                ...pacienteSnap.data(),
                tipo: "paciente",
              };
              sessionStorage.setItem("user", JSON.stringify(this.user));
            } else if (medicoSnap.exists()) {
              this.user = {
                id: firebaseUser.uid,
                ...medicoSnap.data(),
                tipo: "medico",
              };
              sessionStorage.setItem("user", JSON.stringify(this.user));
            } else {
              this.user = null;
              sessionStorage.clear();
              localStorage.clear();
            }
          } catch (error) {
            console.error("Erro ao verificar usuário na Navbar:", error);
            this.user = null;
          }
        } else {
          this.user = null;
        }
      });
    },
  },
  mounted() {
    this.verificarUsuario();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style scoped>
.navbar {
  background: transparent;
  transition: all 0.4s ease-in-out;
  padding: 15px 0;
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  padding: 10px 0;
}

@media (max-width: 991px) {
  .navbar {
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }
}

.navbar-brand .logo {
  height: 50px;
  transition: all 0.3s ease-in-out;
}

.navbar-nav .nav-link {
  color: #000;
  font-weight: 600;
  text-transform: uppercase;
  padding: 10px 15px;
  border-radius: 30px;
  transition: all 0.3s ease-in-out;
}

.navbar-nav .nav-link:hover {
  color: #53ba83;
  font-weight: bold;
  text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.bi-person-circle {
  font-size: 1.8rem;
  color: #53ba83;
  transition: all 0.3s ease-in-out;
}

.perfil-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: black;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease-in-out;
}

.perfil-link:hover .bi-person-circle {
  color: #1565c0;
}

.dropdown-menu {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 8px;
  border: none;
  padding: 10px 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-menu .dropdown-item {
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease-in-out;
}

.dropdown-menu .dropdown-item:hover {
  background: #f1f1f1;
  transform: scale(1.05);
}

.logout-btn {
  color: red !important;
  font-weight: bold;
}

.navbar-toggler {
  border: none;
  transition: all 0.3s ease-in-out;
}

.navbar-toggler:focus {
  box-shadow: none;
}

.navbar-toggler-icon {
  transition: 0.3s ease-in-out;
}

.navbar-toggler:hover .navbar-toggler-icon {
  transform: rotate(90deg);
}

@media (max-width: 991px) {
  .collapse.navbar-collapse {
    background: white;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }
}
</style>