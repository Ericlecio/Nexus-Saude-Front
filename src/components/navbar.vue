<template>
  <nav class="navbar navbar-expand-lg fixed-top" :class="{
    scrolled: isScrolled,
    admin: user?.papel === 'ADMIN'
  }" aria-label="Navegação principal">
    <div class="container">
      <router-link class="navbar-brand" to="/">
        <img src="/src/assets/img/NexusSaude_horizontal.png" alt="Nexus Saúde" class="logo" width="220" height="50"
          loading="lazy" />
      </router-link>

      <button class="navbar-toggler" type="button" @click="toggleCollapse" aria-controls="navbarContent"
        :aria-expanded="!isCollapsed" :aria-label="isCollapsed ? 'Abrir menu' : 'Fechar menu'">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="navbarContent" class="collapse navbar-collapse" :class="{ show: !isCollapsed }" role="navigation">
        <ul class="navbar-nav mx-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/" exact-active-class="active">Home</router-link>
          </li>

          <template v-if="user?.papel === 'ADMIN'">
            <li class="nav-item">
              <router-link class="nav-link" to="/dashboardAdmin" active-class="active">
                <i class="bi bi-graph-up me-1"></i> Dashboard
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/doctors" active-class="active">
                <i class="bi bi-heart-pulse me-1"></i> Médicos
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/patients" active-class="active">
                <i class="bi bi-people me-1"></i> Pacientes
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/consultas" active-class="active">
                <i class="bi bi-calendar-check me-1"></i> Consultas
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/relatorios" active-class="active">
                <i class="bi bi-file-earmark-text me-1"></i> Relatórios
              </router-link>
            </li>
          </template>

          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link" to="/sobre" active-class="active">Quem Somos</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/contato" active-class="active">Fale Conosco</router-link>
            </li>
          </template>
        </ul>

        <div class="dropdown ms-3">
          <a href="#" class="d-flex align-items-center perfil-link" data-bs-toggle="dropdown" aria-haspopup="true"
            :aria-expanded="false">
            <i class="bi bi-person-circle me-2"></i>
            <span v-if="user" class="text-truncate" style="max-width: 150px">
              {{ user.nomeCompleto || user.email }}
            </span>
            <span v-else>Perfil</span>
          </a>

          <ul class="dropdown-menu dropdown-menu-end animate-dropdown">
            <li v-if="!user">
              <router-link class="dropdown-item" to="/login">
                <i class="bi bi-box-arrow-in-right me-2"></i> Login
              </router-link>
            </li>

            <template v-if="user?.papel === 'PACIENTE'">
              <li>
                <router-link class="dropdown-item" to="/perfilPaciente">
                  <i class="bi bi-person me-2"></i> Meu Perfil
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/agendaPaciente">
                  <i class="bi bi-calendar me-2"></i> Minha Agenda
                </router-link>
              </li>
            </template>

            <template v-if="user?.papel === 'MEDICO'">
              <li>
                <router-link class="dropdown-item" to="/perfilMedico">
                  <i class="bi bi-person me-2"></i> Meu Perfil
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/agendaMedica">
                  <i class="bi bi-calendar me-2"></i> Minha Agenda
                </router-link>
              </li>
            </template>

            <template v-if="user?.papel === 'ADMIN'">
              <li>
                <router-link class="dropdown-item" to="/dashboardAdmin">
                  <i class="bi bi-speedometer2 me-2"></i> Painel Admin
                </router-link>
              </li>
            </template>

            <li v-if="user">
              <a class="dropdown-item logout-btn" href="#" @click.prevent="logout">
                <i class="bi bi-box-arrow-right me-2"></i> Sair
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      isScrolled: false,
      isCollapsed: true,
      user: null,
      scrollTimer: null
    };
  },
  methods: {
    handleScroll() {
      // Debounce para otimizar performance
      clearTimeout(this.scrollTimer);
      this.scrollTimer = setTimeout(() => {
        this.isScrolled = window.scrollY > 50;
      }, 50);
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
    async fetchUsuarioLogado() {
      const token = sessionStorage.getItem("authToken");
      if (!token) return;

      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const response = await axios.get(`${API_URL}/usuarios/logado`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.user = response.data;
      } catch (error) {
        if (error.response?.status === 401) {
          this.handleInvalidToken();
        } else {
          console.error("Erro ao buscar usuário:", error);
        }
        sessionStorage.removeItem("authToken");
        this.user = null;
      }
    },
    handleInvalidToken() {
      sessionStorage.removeItem("authToken");
      this.$router.push("/login");
      this.$notify({
        title: "Sessão expirada",
        text: "Por favor, faça login novamente",
        type: "error"
      });
    },
    logout() {
      sessionStorage.removeItem("authToken");
      this.user = null;
      this.$emit("user-logged-out");
      this.$router.push("/");
    }
  },
  watch: {
    '$route'() {
      this.fetchUsuarioLogado();
      this.isCollapsed = true; // Fecha menu ao navegar
    }
  },
  mounted() {
    this.fetchUsuarioLogado();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    clearTimeout(this.scrollTimer);
  }
};
</script>

<style scoped>
.navbar {
  background: transparent;
  transition: all 0.4s ease-in-out;
  padding: 15px 0;
}

.navbar.admin {
  background-color: #ffffff;
}

.navbar.admin .nav-link,
.navbar.admin .perfil-link {
  color: #03052b;
}

.navbar.admin .nav-link:hover {
  color: #53ba83;
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  padding: 10px 0;
}

@media (max-width: 991px) {

  .navbar,
  .navbar.admin {
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }

  .navbar.admin {
    background: #03052b;
  }

  .collapse.navbar-collapse {
    background: white;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }

  .navbar.admin .collapse.navbar-collapse {
    background: #03052b;
  }

  .dropdown {
    margin-top: 15px;
    border-top: 1px solid #eee;
    padding-top: 10px;
  }

  .navbar.admin .dropdown {
    border-top-color: #444;
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
  position: relative;
}

.navbar-nav .nav-link:hover,
.navbar-nav .nav-link.active {
  color: #53ba83;
  font-weight: bold;
}

.navbar-nav .nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 15px;
  width: calc(100% - 30px);
  height: 2px;
  background: #53ba83;
  border-radius: 2px;
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
  min-width: 120px;
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
  min-width: 200px;
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
  display: flex;
  align-items: center;
}

.dropdown-menu .dropdown-item:hover {
  background: #f1f1f1;
  transform: translateX(5px);
}

.logout-btn {
  color: #e74c3c !important;
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

@media (max-width: 768px) {
  .navbar-nav {
    margin-top: 15px;
  }

  .navbar-nav .nav-item {
    margin-bottom: 5px;
  }
}
</style>