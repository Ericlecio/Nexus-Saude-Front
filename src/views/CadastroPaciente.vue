<template>
    <div>
        <Navbar />
        <div class="container py-5 mt-5">
            <div class="row justify-content-center">
                <div class="col-md-10">
                    <div class="card shadow-lg border-0 rounded-4 p-5 bg-white">
                        <div class="text-center mb-4">
                            <img src="@/assets/img/NexusSaude_vertical.png" alt="Logo Nexus Saúde"
                                class="logo-small mb-3" />
                            <h1 class="text-primary fw-bold">Cadastro de Paciente</h1>
                        </div>

                        <form @submit.prevent="submitForm">
                            <div class="row g-4">
                                <div class="col-md-6">
                                    <label class="form-label">Nome Completo</label>
                                    <input v-model="form.nomeCompleto" type="text" class="form-control"
                                        @input="validarNome" required />
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">CPF</label>
                                    <input v-model="form.cpf" type="text" class="form-control" @input="handleCPFInput"
                                        required />
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Data de Nascimento</label>
                                    <input v-model="form.dataNascimento" type="date" class="form-control" required />
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Telefone</label>
                                    <input v-model="form.telefone" type="text" class="form-control"
                                        @input="handlePhoneInput" required />
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">E-mail</label>
                                    <input v-model="form.email" type="email" class="form-control" required />
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Plano de Saúde</label>
                                    <select v-model="planoSelecionado" class="form-select" required>
                                        <option value="" disabled>Selecione um plano</option>
                                        <option v-for="plano in planos" :key="plano" :value="plano">{{ plano }}</option>
                                        <option value="Outro">Outro</option>
                                    </select>
                                </div>

                                <div class="col-md-12" v-if="planoSelecionado === 'Outro'">
                                    <label class="form-label">Informe o nome do plano</label>
                                    <input v-model="form.planoSaude" type="text" class="form-control" required />
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Senha</label>
                                    <input v-model="form.senha" type="password" class="form-control" required />
                                </div>
                            </div>

                            <div class="text-end mt-4">
                                <button type="submit" class="btn btn-success btn-lg px-5">Cadastrar Paciente</button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import { pacienteApi } from '@/services/http';
import {
    validarNome,
    validarCPF,
    handlePhoneInput,
    handleCPFInput
} from "@/components/validators";

export default {
    components: { Navbar, Footer },
    data() {
        return {
            planos: [
                "Amil", "Bradesco Saúde", "Hapvida", "Unimed", "SulAmérica",
                "NotreDame Intermédica", "Porto Seguro", "São Francisco Saúde", "Prevent Senior"
            ],
            planoSelecionado: "",
            form: {
                nomeCompleto: "",
                cpf: "",
                dataNascimento: "",
                telefone: "",
                email: "",
                planoSaude: "",
                senha: ""  // Campo para senha
            }
        };
    },
    methods: {
        validarNome(e) {
            this.form.nomeCompleto = validarNome(e.target.value);
        },
        handleCPFInput(e) {
            this.form.cpf = handleCPFInput(e.target.value);
            if (this.form.cpf.length === 14 && !validarCPF(this.form.cpf)) {
                alert("CPF inválido.");
                this.form.cpf = "";
            }
        },
        handlePhoneInput(e) {
            this.form.telefone = handlePhoneInput(e.target.value);
        },
        async submitForm() {
            // Validações antes de enviar os dados
            if (this.planoSelecionado !== "Outro") {
                this.form.planoSaude = this.planoSelecionado;
            }

            if (!this.form.planoSaude) {
                alert("Informe o plano de saúde.");
                return;
            }

            if (!this.form.senha) {
                alert("Informe uma senha.");
                return;
            }

            try {
                // Enviar a requisição para o backend com os dados do formulário
                const response = await pacienteApi.post("/registrar", {
                    ...this.form,
                    dataCadastro: new Date().toISOString()  // Garantindo que a data seja enviada corretamente
                });

                alert("Paciente cadastrado com sucesso!");
                console.log(response.data);
                this.resetForm();  // Limpa o formulário após o cadastro
            } catch (error) {
                console.error("Erro ao cadastrar paciente:", error);
                alert("Erro ao cadastrar paciente.");
            }
        },

        resetForm() {
            // Função para resetar o formulário após o envio
            this.form = {
                nomeCompleto: "",
                cpf: "",
                dataNascimento: "",
                telefone: "",
                email: "",
                planoSaude: "",
                senha: ""
            };
            this.planoSelecionado = "";
        }
    }
};
</script>


<style scoped>
/* Animação de entrada suave */
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

/* Estilização geral da logo */
.logo-small {
    max-width: 120px;
    height: auto;
    margin-top: 10px;
    margin-bottom: 16px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    background-color: transparent;
    box-shadow: none;
    border-radius: 12px;
    animation: fadeIn 0.8s ease-in-out;
}

/* Container principal do formulário */
.card {
    border-radius: 1.5rem;
    background-color: #ffffff;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    padding: 2.5rem;
}

/* Inputs e selects */
.form-control,
.form-select {
    border-radius: 12px;
    border: 1px solid #ccc;
    font-size: 0.95rem;
    padding: 10px 14px;
    box-shadow: none;
    transition: border-color 0.3s ease;
}

.form-control:focus,
.form-select:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
}

/* Labels */
.form-label {
    font-weight: 600;
    margin-bottom: 4px;
    color: #333;
}

/* Botões */
button {
    transition: all 0.3s ease-in-out;
    border-radius: 0.6rem;
}

button:hover {
    transform: scale(1.03);
}

/* Botão principal */
.btn-success {
    background-color: #28a745;
    border-color: #28a745;
    color: #fff;
}

.btn-success:hover {
    background-color: #218838;
    border-color: #1e7e34;
}

/* Responsividade */
@media (max-width: 768px) {
    .card {
        padding: 1.5rem;
    }

    .logo-small {
        max-width: 90px;
        margin-bottom: 12px;
    }

    .btn-success {
        width: 100%;
    }
}
</style>
