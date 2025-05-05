<template>
    <Navbar />
    <div class="admin-container">
        <div class="admin-card">
            <div class="admin-header">
                <i class="fas fa-shield-alt"></i>
                <h2>Portal do Administrador</h2>
                <p>Acesso restrito</p>
            </div>

            <form @submit.prevent="loginAdmin" class="admin-form">
                <div class="input-group">
                    <i class="fas fa-envelope"></i>
                    <input type="email" v-model="email" placeholder="E-mail" required class="input-field" />
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
                        <input type="checkbox" /> Lembrar acesso
                    </label>
                    <a href="#" class="forgot-password">Esqueceu a senha?</a>
                </div>

                <button type="submit" class="btn-login">Entrar</button>
            </form>
        </div>
    </div>
    <Footer />
</template>

<style scoped>
.admin-container {
    min-height: calc(100vh - 80px);
    background: linear-gradient(to right, #000524, #53ba83);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
}

.admin-card {
    background: #03052b;
    color: white;
    padding: 50px 40px;
    border-radius: 20px;
    max-width: 450px;
    width: 100%;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.25);
    margin-top: 5%;
}

.admin-header {
    text-align: center;
    margin-bottom: 35px;
}

.admin-header i {
    font-size: 2rem;
    color: #53ba83;
    margin-bottom: 10px;
}

.admin-header h2 {
    font-size: 1.8rem;
    margin-bottom: 8px;
    font-weight: bold;
}

.admin-header p {
    color: #53ba83;
    font-size: 0.95rem;
}

.admin-form {
    display: flex;
    flex-direction: column;
}

.input-group {
    position: relative;
    margin-bottom: 25px;
}

.input-group i {
    position: absolute;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);
    color: #666;
}

.input-field {
    width: 100%;
    padding: 14px 45px 14px 45px;
    border-radius: 14px;
    border: none;
    background: #fff;
    color: #000;
    font-size: 1rem;
}

.input-field::placeholder {
    color: #888;
}

.password-group .toggle-password {
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    color: #666;
    cursor: pointer;
}

.password-group .toggle-password:hover {
    color: #53ba83;
}

.remember-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
    color: #ccc;
    margin-bottom: 25px;
}

.remember-label {
    display: flex;
    align-items: center;
    gap: 5px;
}

.forgot-password {
    color: #53ba83;
    text-decoration: none;
}

.forgot-password:hover {
    text-decoration: underline;
}

.btn-login {
    background-color: #53ba83;
    border: none;
    border-radius: 30px;
    color: #fff;
    font-size: 1.1rem;
    font-weight: bold;
    padding: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn-login:hover {
    background-color: #3aa86d;
}
</style>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

export default {
    name: "LoginAdmin",
    components: { Navbar, Footer },
    data() {
        return {
            email: "",
            password: "",
            showPassword: false
        };
    },
    methods: {
        togglePassword() {
            this.showPassword = !this.showPassword;
        },
        loginAdmin() {
            if (this.email && this.password) {
                alert("Admin autenticado com sucesso.");
                this.$router.push("/admin/dashboard");
            } else {
                alert("E-mail ou senha inválidos.");
            }
        }
    }
};
</script>