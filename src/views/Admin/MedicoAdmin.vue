<template>
    <Navbar />
    <div class="container">
        <h2>Lista de Médicos</h2>
        <div class="top-bar">
            <button @click="abrirModalAdicionar"><i class="fas fa-user-md"></i> Adicionar Médico</button>
            <input type="text" v-model="searchTerm" placeholder="Buscar por nome, CPF ou CRM..." class="search-input" />
            <select v-model="filtroDia" class="search-input">
                <option value="">Filtrar por dia</option>
                <option value="segunda">Segunda</option>
                <option value="terca">Terça</option>
                <option value="quarta">Quarta</option>
                <option value="quinta">Quinta</option>
                <option value="sexta">Sexta</option>
                <option value="sabado">Sábado</option>
            </select>

        </div>

        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Especialidade</th>
                    <th>Email</th>
                    <th>CRM</th>
                    <th>Telefone</th>
                    <th>UF</th>
                    <th>Valor</th>
                    <th>Dias de Atendimento</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="doctor in filteredDoctors" :key="doctor.id">
                    <td>{{ doctor.nome }}</td>
                    <td>{{ doctor.especialidade }}</td>
                    <td>{{ doctor.email }}</td>
                    <td>{{ doctor.crm }}</td>
                    <td>{{ doctor.telefoneConsultorio }}</td>
                    <td>{{ doctor.uf }}</td>
                    <td>R$ {{ doctor.valorConsulta?.toFixed(2).replace('.', ',') }}</td>
                    <td>
                        <ul>
                            <li v-for="dia in doctor.diasAtendimento" :key="dia.id">
                                {{ dia.diaSemana }} - {{ dia.horario }}
                            </li>
                        </ul>
                    </td>
                    <td>
                        <button class="edit" @click="abrirModalEditar(doctor)"><i class="fas fa-pen"></i></button>
                        <button class="delete" @click="excluirMedico(doctor.id)"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Modal Adicionar Médico -->
        <div v-if="modalAdicionarVisivel" class="modal-overlay">
            <div class="modal-content">
                <h3>Cadastrar Médico</h3>
                <form @submit.prevent="salvarMedico(false)">
                    <div class="form-grid">
                        <input v-model="form.nome" placeholder="Nome Completo" required />
                        <input v-model="form.cpf" placeholder="CPF" @input="handleCPFInput" required />
                        <select v-model="form.sexo" required>
                            <option value="" disabled>Sexo</option>
                            <option value="M">Masculino</option>
                            <option value="F">Feminino</option>
                            <option value="O">Outro</option>
                        </select>
                        <input v-model="form.dataNascimento" type="date" required />
                        <input v-model="form.telefoneConsultorio" placeholder="Telefone" @input="handlePhoneInput"
                            required />
                        <input v-model="form.email" type="email" placeholder="Email" required />
                        <input v-model="form.senha" type="password" placeholder="Senha" required />
                        <input v-model="form.crm" placeholder="CRM" @input="formatCRM" required />
                        <select v-model="form.uf" required>
                            <option value="" disabled>UF</option>
                            <option v-for="estado in ufs" :key="estado" :value="estado">{{ estado }}</option>
                        </select>
                        <select v-model="form.especialidade" required>
                            <option value="" disabled>Especialidade</option>
                            <option v-for="e in especialidades" :key="e" :value="e">{{ e }}</option>
                        </select>
                        <input v-model="form.valorConsulta" placeholder="Valor da Consulta"
                            @input="formatarValorConsulta" required />
                        <select v-model="form.tempoConsulta" required>
                            <option value="" disabled>Tempo Médio</option>
                            <option value="15">15 minutos</option>
                            <option value="30">30 minutos</option>
                            <option value="45">45 minutos</option>
                            <option value="60">1 hora</option>
                        </select>
                    </div>

                    <label style="margin-top: 20px; display: block; font-weight: 600;">Dias e Horários de
                        Atendimento</label>
                    <div class="dias-atendimento">
                        <div v-for="(dia, index) in Object.entries(diasAtendimento)" :key="index">
                            <label style="font-weight: 500;">{{ dia[0] }}</label>
                            <select v-model="dia[1].inicio">
                                <option value="">Início</option>
                                <option v-for="h in horarios" :key="h" :value="h">{{ h }}</option>
                            </select>
                            <select v-model="dia[1].fim" @change="validateHorario(dia)">
                                <option value="">Fim</option>
                                <option v-for="h in horarios" :key="h" :value="h">{{ h }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="modal-actions">
                        <button type="submit"><i class="fas fa-save"></i> Salvar</button>
                        <button type="button" @click="fecharModal"><i class="fas fa-times"></i> Cancelar</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal Editar Médico -->
        <div v-if="modalEditarVisivel" class="modal-overlay">
            <div class="modal-content">
                <h3>Editar Médico</h3>
                <form @submit.prevent="salvarMedico(true)">
                    <div class="form-grid">
                        <input v-model="form.nome" placeholder="Nome Completo" required />
                        <input v-model="form.cpf" placeholder="CPF" @input="handleCPFInput" required disabled />
                        <select v-model="form.sexo" required>
                            <option value="" disabled>Sexo</option>
                            <option value="M">Masculino</option>
                            <option value="F">Feminino</option>
                            <option value="O">Outro</option>
                        </select>
                        <input v-model="form.dataNascimento" type="date" required />
                        <input v-model="form.telefoneConsultorio" placeholder="Telefone" @input="handlePhoneInput"
                            required />
                        <input v-model="form.email" type="email" placeholder="Email" required />
                        <input v-model="form.crm" placeholder="CRM" @input="formatCRM" required />
                        <select v-model="form.uf" required>
                            <option value="" disabled>UF</option>
                            <option v-for="estado in ufs" :key="estado" :value="estado">{{ estado }}</option>
                        </select>
                        <select v-model="form.especialidade" required>
                            <option value="" disabled>Especialidade</option>
                            <option v-for="e in especialidades" :key="e" :value="e">{{ e }}</option>
                        </select>
                        <input v-model="form.valorConsulta" placeholder="Valor da Consulta"
                            @input="formatarValorConsulta" required />
                        <select v-model="form.tempoConsulta" required>
                            <option value="" disabled>Tempo Médio</option>
                            <option value="15">15 minutos</option>
                            <option value="30">30 minutos</option>
                            <option value="45">45 minutos</option>
                            <option value="60">1 hora</option>
                        </select>
                    </div>

                    <label style="margin-top: 20px; display: block; font-weight: 600;">Dias e Horários de
                        Atendimento</label>
                    <div class="dias-atendimento">
                        <div v-for="(dia, index) in Object.entries(diasAtendimento)" :key="index">
                            <label style="font-weight: 500;">{{ dia[0] }}</label>
                            <select v-model="dia[1].inicio">
                                <option value="">Início</option>
                                <option v-for="h in horarios" :key="h" :value="h">{{ h }}</option>
                            </select>
                            <select v-model="dia[1].fim" @change="validateHorario(dia)">
                                <option value="">Fim</option>
                                <option v-for="h in horarios" :key="h" :value="h">{{ h }}</option>
                            </select>
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
    <Footer />
</template>


<script>
import { medicoApi } from '@/services/http';
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import {
    validarNome,
    validarCPF,
    formatarCRM,
    formatarValorConsulta,
    validarHorario,
    gerarHorarios,
    handlePhoneInput,
    handleCPFInput,
} from '@/components/validators';

export default {
    components: { Navbar, Footer },
    name: 'MedicoAdmin',
    data() {
        return {
            doctors: [],
            searchTerm: '',
            modalAdicionarVisivel: false,
            modalEditarVisivel: false,
            medicoSelecionado: null,
            valorInvalido: false,
            crmInvalido: false,
            ufs: [
                "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
                "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
                "SP", "SE", "TO"
            ],
            filtroDia: '',

            especialidades: [
                "Pediatria", "Cardiologia", "Dermatologia", "Ortopedia", "Neurologia"
            ],
            horarios: gerarHorarios("07:00", "20:00", 15),
            diasAtendimento: {
                segunda: { inicio: "", fim: "" },
                terca: { inicio: "", fim: "" },
                quarta: { inicio: "", fim: "" },
                quinta: { inicio: "", fim: "" },
                sexta: { inicio: "", fim: "" },
                sabado: { inicio: "", fim: "" }
            },
            form: {
                nome: '', cpf: '', sexo: '', dataNascimento: '', email: '', senha: '', telefoneConsultorio: '',
                crm: '', uf: '', especialidade: '', valorConsulta: 'R$ 0,00', tempoConsulta: ''
            }
        };
    },
    computed: {
        filteredDoctors() {
            const term = this.searchTerm.toLowerCase();
            return this.doctors.filter(doc => {
                const nomeMatch = doc.nome?.toLowerCase().includes(term);
                const cpfMatch = doc.cpf?.includes(term);
                const crmMatch = doc.crm?.toLowerCase().includes(term);

                const diaMatch = this.filtroDia
                    ? doc.diasAtendimento.some(d => d.diaSemana === this.filtroDia)
                    : true;

                return (nomeMatch || cpfMatch || crmMatch) && diaMatch;
            });
        }
    },
    methods: {
        async fetchDoctors() {
            try {
                const res = await medicoApi.get('/listar');
                this.doctors = res.data;
            } catch (err) {
                console.error('Erro ao buscar médicos:', err);
            }
        },
        abrirModalAdicionar() {
            this.resetarFormulario();
            this.modalAdicionarVisivel = true;
        },
        abrirModalEditar(medico) {
            this.resetarFormulario();

            const medicoEditado = { ...medico };
            medicoEditado.valorConsulta = `R$ ${medico.valorConsulta.toFixed(2).replace('.', ',')}`;

            Object.assign(this.form, medicoEditado);

            // (mantém o restante do seu código)
            this.diasAtendimento = {
                segunda: { inicio: "", fim: "" },
                terca: { inicio: "", fim: "" },
                quarta: { inicio: "", fim: "" },
                quinta: { inicio: "", fim: "" },
                sexta: { inicio: "", fim: "" },
                sabado: { inicio: "", fim: "" }
            };

            medico.diasAtendimento.forEach(dia => {
                if (!this.diasAtendimento[dia.diaSemana]) return;

                if (!this.diasAtendimento[dia.diaSemana].inicio ||
                    dia.horario < this.diasAtendimento[dia.diaSemana].inicio) {
                    this.diasAtendimento[dia.diaSemana].inicio = dia.horario;
                }

                if (!this.diasAtendimento[dia.diaSemana].fim ||
                    dia.horario > this.diasAtendimento[dia.diaSemana].fim) {
                    this.diasAtendimento[dia.diaSemana].fim = dia.horario;
                }
            });

            this.medicoSelecionado = medico;
            this.modalEditarVisivel = true;
        }
        ,
        fecharModal() {
            this.modalAdicionarVisivel = false;
            this.modalEditarVisivel = false;
            this.resetarFormulario();
            this.fetchDoctors();
        },
        validateHorario(dia) {
            const erro = validarHorario(dia);
            if (erro) {
                alert(erro);
                dia[1].fim = "";
            }
        },
        resetarFormulario() {
            this.form = {
                nome: '', cpf: '', sexo: '', dataNascimento: '', email: '', senha: '', telefoneConsultorio: '',
                crm: '', uf: '', especialidade: '', valorConsulta: 'R$ 0,00', tempoConsulta: ''
            };
            this.diasAtendimento = {
                segunda: { inicio: "", fim: "" },
                terca: { inicio: "", fim: "" },
                quarta: { inicio: "", fim: "" },
                quinta: { inicio: "", fim: "" },
                sexta: { inicio: "", fim: "" },
                sabado: { inicio: "", fim: "" }
            };
            this.valorInvalido = false;
            this.crmInvalido = false;
            this.medicoSelecionado = null;
        },
        validarNome(e) {
            this.form.nome = validarNome(e.target.value);
        },
        handleCPFInput(e) {
            this.form.cpf = handleCPFInput(e.target.value);
            if (this.form.cpf.length === 14 && !validarCPF(this.form.cpf)) {
                alert("CPF inválido.");
                this.form.cpf = "";
            }
        },
        handlePhoneInput(e) {
            this.form.telefoneConsultorio = handlePhoneInput(e.target.value);
        },
        formatCRM(e) {
            this.form.crm = formatarCRM(e.target.value);
            this.crmInvalido = this.form.crm.length < 5;
        },
        formatarValorConsulta(e) {
            this.form.valorConsulta = formatarValorConsulta(e.target.value);
            const valor = parseFloat(this.form.valorConsulta.replace(/[^\d.-]/g, ''));
            this.valorInvalido = isNaN(valor) || valor <= 0;
        },
        gerarHorariosDia(inicio, fim, duracao) {
            if (!inicio || !fim || !duracao) return [];
            const [hInicio, mInicio] = inicio.split(':').map(Number);
            const [hFim, mFim] = fim.split(':').map(Number);
            let start = new Date(0, 0, 0, hInicio, mInicio, 0);
            let end = new Date(0, 0, 0, hFim, mFim, 0);
            let horarios = [];
            while (start <= new Date(end.getTime() - duracao * 60000)) {
                horarios.push(start.toTimeString().substring(0, 5));
                start = new Date(start.getTime() + duracao * 60000);
            }
            return horarios;
        },
        async salvarMedico() {
            try {
                const valor = parseFloat(this.form.valorConsulta.replace(/[^\d,-]/g, '').replace(',', '.'));
                if (isNaN(valor) || valor <= 0) return alert("Valor da consulta inválido.");

                const dias = [];
                for (const [dia, horario] of Object.entries(this.diasAtendimento)) {
                    if (!horario.inicio || !horario.fim) continue;
                    const turnos = this.gerarHorariosDia(horario.inicio, horario.fim, Number(this.form.tempoConsulta));
                    turnos.forEach(h => dias.push({ diaSemana: dia, horario: h }));
                }

                const payload = {
                    nome: this.form.nome,
                    cpf: this.form.cpf,
                    sexo: this.form.sexo,
                    dataNascimento: this.form.dataNascimento,
                    email: this.form.email.toLowerCase(),
                    senha: this.form.senha,
                    telefoneConsultorio: this.form.telefoneConsultorio,
                    crm: this.form.crm,
                    uf: this.form.uf,
                    especialidade: this.form.especialidade,
                    valorConsulta: valor,
                    tempoConsulta: this.form.tempoConsulta,
                    diasAtendimento: dias
                };

                const isEdicao = this.modalEditarVisivel && this.medicoSelecionado;
                const url = isEdicao ? `/update/${this.medicoSelecionado.id}` : '/admin-criar';
                const method = isEdicao ? 'put' : 'post';
                await medicoApi[method](url, payload);
                alert("Médico salvo com sucesso!");
                this.fecharModal();
            } catch (err) {
                console.error('Erro ao salvar médico:', err);
                alert('Erro ao salvar médico. Verifique os dados.');
            }
        },
        async excluirMedico(id) {
            if (confirm('Deseja excluir este médico?')) {
                try {
                    await medicoApi.delete(`/deletar/${id}`);
                    this.fetchDoctors();
                } catch (err) {
                    console.error('Erro ao excluir médico:', err);
                }
            }
        }
    },
    mounted() {
        this.fetchDoctors();
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