<template>
    <div class="container">
        <h2>Lista de Pacientes</h2>
        <div class="top-bar">
            <button @click="abrirModalAdicionar"><i class="fas fa-user-plus"></i> Adicionar Paciente</button>
            <input type="text" v-model="searchTerm" placeholder="Buscar por nome, CPF ou plano..."
                class="search-input" />
        </div>

        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>CPF</th>
                    <th>Telefone</th>
                    <th>Data de Nascimento</th>
                    <th>Plano de Saúde</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="paciente in pacientesFiltrados" :key="paciente.id">
                    <td>{{ paciente.nomeCompleto }}</td>
                    <td>{{ paciente.email }}</td>
                    <td>{{ paciente.cpf }}</td>
                    <td>{{ paciente.telefone }}</td>
                    <td>{{ paciente.dataNascimento }}</td>
                    <td>{{ paciente.planoSaude || 'Nenhum' }}</td>
                    <td>
                        <button class="edit" @click="abrirModalEditar(paciente)"><i class="fas fa-pen"></i></button>
                        <button class="delete" @click="excluirPaciente(paciente.id)"><i
                                class="fas fa-trash"></i></button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Modal Adicionar Paciente -->
        <div v-if="modalAdicionarVisivel" class="modal-overlay">
            <div class="modal-content">
                <h3>Cadastrar Paciente</h3>
                <form @submit.prevent="salvarPaciente(false)">
                    <div class="form-grid">
                        <input v-model="form.nomeCompleto" placeholder="Nome Completo" class="form-control" required />
                        <input v-model="form.cpf" placeholder="CPF" @input="handleCPFInput" class="form-control"
                            required />
                        <input v-model="form.telefone" placeholder="Telefone" @input="handlePhoneInput"
                            class="form-control" required />
                        <input v-model="form.email" type="email" placeholder="Email" class="form-control" required />
                        <input v-model="form.senha" type="password" placeholder="Senha" class="form-control" required />
                        <input v-model="form.dataNascimento" type="date" class="form-control" required />

                        <select v-model="form.planoSaude" class="form-select">
                            <option value="">Selecione um plano</option>
                            <option v-for="plano in planos" :key="plano" :value="plano">{{ plano }}</option>
                            <option value="Outro">Outro</option>
                        </select>

                        <div v-if="form.planoSaude === 'Outro'">
                            <input v-model="form.planoSaude" placeholder="Informe o nome do plano" class="form-control"
                                required />
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button type="submit"><i class="fas fa-save"></i> Salvar</button>
                        <button type="button" @click="fecharModal"><i class="fas fa-times"></i> Cancelar</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal Editar Paciente -->
        <div v-if="modalEditarVisivel" class="modal-overlay">
            <div class="modal-content">
                <h3>Editar Paciente</h3>
                <form @submit.prevent="salvarPaciente(true)">
                    <div class="form-grid">
                        <input v-model="form.nomeCompleto" placeholder="Nome Completo" class="form-control" required />
                        <input v-model="form.cpf" placeholder="CPF" @input="handleCPFInput" required />
                        <input v-model="form.telefone" placeholder="Telefone" @input="handlePhoneInput"
                            class="form-control" required />
                        <input v-model="form.email" type="email" placeholder="Email" required />
                        <input v-model="form.dataNascimento" type="date" class="form-control" required />

                        <select v-model="form.planoSaude" class="form-select">
                            <option value="">Selecione um plano</option>
                            <option v-for="plano in planos" :key="plano" :value="plano">{{ plano }}</option>
                            <option value="Outro">Outro</option>
                        </select>

                        <div v-if="form.planoSaude === 'Outro'">
                            <input v-model="form.planoSaude" placeholder="Informe o nome do plano" class="form-control"
                                required />
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button type="submit"><i class="fas fa-save"></i> Atualizar</button>
                        <button type="button" @click="fecharModal"><i class="fas fa-times"></i> Cancelar</button>
                    </div>
                </form>
            </div>
        </div>

    </div>
</template>

<script>
import { pacienteApi } from '@/services/http';
import {
    validarNome,
    validarCPF,
    handlePhoneInput,
    handleCPFInput
} from "@/components/validators";

export default {
    name: 'PacienteAdmin',
    data() {
        return {
            pacientes: [],
            searchTerm: '',
            modalAdicionarVisivel: false,
            modalEditarVisivel: false,
            pacienteSelecionado: null,
            planos: [
                "Amil", "Bradesco Saúde", "Hapvida", "Unimed", "SulAmérica",
                "NotreDame Intermédica", "Porto Seguro", "São Francisco Saúde", "Prevent Senior"
            ],
            form: {
                nomeCompleto: '',
                cpf: '',
                telefone: '',
                email: '',
                senha: '',
                dataNascimento: '',
                planoSaude: ''
            }
        };
    },
    computed: {
        pacientesFiltrados() {
            const term = this.searchTerm.toLowerCase();
            return this.pacientes.filter(p =>
                p.nomeCompleto.toLowerCase().includes(term) ||
                p.cpf.includes(term) ||
                (p.planoSaude && p.planoSaude.toLowerCase().includes(term))
            );
        }
    },
    methods: {
        async fetchPacientes() {
            try {
                const res = await pacienteApi.get('/listar');
                this.pacientes = res.data;
            } catch (err) {
                console.error('Erro ao buscar pacientes:', err);
            }
        },
        abrirModalAdicionar() {
            this.resetarFormulario();
            this.modalAdicionarVisivel = true;
        },
        abrirModalEditar(paciente) {
            this.resetarFormulario();
            Object.assign(this.form, { ...paciente });
            this.pacienteSelecionado = paciente;
            this.modalEditarVisivel = true;
        },
        fecharModal() {
            this.modalAdicionarVisivel = false;
            this.modalEditarVisivel = false;
            this.resetarFormulario();
            this.fetchPacientes();
        },
        resetarFormulario() {
            this.form = {
                nomeCompleto: '', cpf: '', telefone: '', email: '', senha: '', dataNascimento: '', planoSaude: ''
            };
            this.pacienteSelecionado = null;
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

        async salvarPaciente(isEdicao) {
            try {
                const payload = { ...this.form };
                const url = isEdicao ? `/update/${this.pacienteSelecionado.id}` : '/admin-criar';
                const method = isEdicao ? 'put' : 'post';
                await pacienteApi[method](url, payload);
                alert('Paciente salvo com sucesso!');
                this.fecharModal();
            } catch (err) {
                console.error('Erro ao salvar paciente:', err);
                alert('Erro ao salvar paciente. Verifique os dados.');
            }
        },
        async excluirPaciente(id) {
            if (confirm('Deseja excluir este paciente?')) {
                try {
                    await pacienteApi.delete(`/deletar/${id}`);
                    this.fetchPacientes();
                } catch (err) {
                    console.error('Erro ao excluir paciente:', err);
                }
            }
        }
    },
    mounted() {
        this.fetchPacientes();
    }
};
</script>


<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.container {
    padding: 32px;
    max-width: 100%;
    background-color: white;
}

h2 {
    font-size: 2rem;
    color: #03052b;
    margin-bottom: 20px;
    font-weight: 700;
}

.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

button {
    margin: 5px;
    border: none;
    padding: 10px 14px;
    border-radius: 6px;
    font-size: 0.95rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    transition: background-color 0.2s;
}

button.edit {
    color: #53ba83;
}

button.delete {
    color: #d32f2f;
}

button i {
    pointer-events: none;
    font-size: 1rem;

}

.search-input {
    padding: 10px 16px;
    font-size: 0.95rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    max-width: 300px;
    width: 100%;
    background: white;
}

table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin-top: 16px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

th,
td {
    padding: 14px 12px;
    text-align: left;
    font-size: 0.95rem;
    border-bottom: 1px solid #f0f0f0;
}

th {
    background-color: #f9fafb;
    color: #03052b;
    font-weight: 600;
}

tr:hover {
    background-color: #f1fdf6;
}

ul {
    padding-left: 16px;
    margin: 0;
    font-size: 0.9rem;
    color: #333;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 80px;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 24px;
    border-radius: 12px;
    width: 95%;
    max-width: 960px;
    max-height: 95vh;
    overflow-y: auto;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.modal-content h3 {
    font-size: 1.6rem;
    color: #03052b;
    margin-bottom: 16px;
    text-align: center;
    font-weight: 700;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

.modal-content input,
.modal-content select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 0.95rem;
    background-color: #fff;
    color: #03052b;
}

.dias-atendimento {
    margin-top: 16px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 12px;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
    gap: 10px;
}

.modal-actions button {
    min-width: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background-color: #53ba83;
    color: white;
    font-weight: bold;
}

.modal-actions button:hover {
    background-color: #03052b;
}
</style>
