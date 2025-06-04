<template>
    <div class="container">
        <h2>Lista de Médicos</h2>
        <div class="top-bar">
            <button @click="irParaCadastro">Adicionar Médico</button>
            <input type="text" v-model="searchTerm" placeholder="Buscar por nome, CPF ou CRM..." class="search-input" />
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
                    <th>CPF</th>
                    <th>Sexo</th>
                    <th>Tempo Consulta</th>
                    <th>Data Nasc.</th>
                    <th>Cadastro</th>
                    <th>Criado em</th>
                    <th>Atualizado em</th>
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
                    <td>{{ doctor.cpf || '-' }}</td>
                    <td>{{ doctor.sexo || '-' }}</td>
                    <td>{{ doctor.tempoConsulta ? doctor.tempoConsulta + ' min' : '-' }}</td>
                    <td>{{ formatarData(doctor.dataNascimento) }}</td>
                    <td>{{ formatarDataHora(doctor.dataCadastro) }}</td>
                    <td>{{ formatarDataHora(doctor.createdAt) }}</td>
                    <td>{{ formatarDataHora(doctor.updatedAt) }}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="edit" @click="editarMedico(doctor)">
                                <i class="fas fa-pen"></i>
                            </button>
                            <button class="delete" @click="excluirMedico(doctor.id)">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script>
import { medicoApi } from '@/services/http';

export default {
    name: 'ListaMedicos',
    data() {
        return {
            doctors: [],
            searchTerm: ""
        };
    },
    computed: {
        filteredDoctors() {
            const term = this.searchTerm.toLowerCase();
            return this.doctors.filter(doc =>
                doc.nome?.toLowerCase().includes(term) ||
                doc.cpf?.includes(term) ||
                doc.crm?.toLowerCase().includes(term)
            );
        }
    },
    methods: {
        async fetchDoctors() {
            try {
                const response = await medicoApi.get('/listar');
                this.doctors = response.data;
            } catch (error) {
                console.error('Erro ao buscar médicos:', error);
            }
        },
        irParaCadastro() {
            this.$router.push('/cadastro');
        },
        editarMedico(doctor) {
            this.$router.push({ name: 'editDoctor', params: { id: doctor.id } });
        },
        async excluirMedico(id) {
            if (confirm('Deseja realmente excluir?')) {
                try {
                    await medicoApi.delete(`/deletar/${id}`);
                    this.fetchDoctors();
                } catch (error) {
                    console.error('Erro ao excluir médico:', error);
                }
            }
        },
        formatarData(data) {
            if (!data) return '-';
            return new Date(data).toLocaleDateString('pt-BR');
        },
        formatarDataHora(dataHora) {
            if (!dataHora) return '-';
            return new Date(dataHora).toLocaleString('pt-BR');
        }
    },
    mounted() {
        this.fetchDoctors();
    }
};
</script>



<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

div {
    padding: 32px;
    max-width: 100%;

}

h2 {
    font-size: 2.4rem;
    text-align: center;
    color: #00ff9d;
}

.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
}

.search-input {
    padding: 10px 16px;
    font-size: 1rem;
    border-radius: 8px;
    border: 1px solid #007bff;
    width: 100%;
    max-width: 300px;
    background-color: white;
    color: #1a1a3c;
}

.search-input:focus {
    border-color: #00ff9d;
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 255, 157, 0.25);
}

button {
    border: none;
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: 0.2s ease-in-out;
}

button:hover {
    transform: scale(1.03);
}

button:first-of-type {
    background-color: #007bff;
    color: white;
    font-weight: 600;
    box-shadow: 0 0 6px rgba(0, 255, 157, 0.4);
}

/* Tabela */
table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    color: #1a1a3c;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    table-layout: fixed;
}

th,
td {
    padding: 12px 10px;
    text-align: left;
    border-top: 1px solid #e2e8f0;
    vertical-align: middle;
    font-size: 0.92rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

tr:hover {
    background-color: #f6f9ff;
}

th {
    background-color: #00ff9d;
    color: #1a1a3c;
    font-weight: 600;
}

/* Colunas otimizadas */
th:nth-child(1),
td:nth-child(1) {
    min-width: 130px;
}

th:nth-child(2),
td:nth-child(2) {
    min-width: 120px;
}

th:nth-child(3),
td:nth-child(3) {
    min-width: 180px;
}

th:nth-child(4),
td:nth-child(4) {
    width: 80px;
}

th:nth-child(5),
td:nth-child(5) {
    width: 110px;
}

th:nth-child(6),
td:nth-child(6) {
    width: 50px;
}

th:nth-child(7),
td:nth-child(7) {
    width: 90px;
}

th:nth-child(8),
td:nth-child(8) {
    min-width: 160px;
    white-space: normal;
    text-overflow: initial;
    overflow: visible;
}

th:nth-child(9),
td:nth-child(9) {
    width: 100px;
    text-align: center;
}

/* Dias */
ul {
    padding-left: 16px;
    margin: 0;
    list-style-type: disc;
    color: #333;
    font-size: 0.9rem;
    white-space: normal;
}

/* Botões de ação */
.action-buttons {
    display: flex;
    justify-content: center;
    gap: 8px;
}

.action-buttons button {
    padding: 6px;
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    border-radius: 6px;
    color: white;
}

.edit {
    background-color: #007bff;
}

.delete {
    background-color: #dc3545;
}

.action-buttons i {
    pointer-events: none;
}

/* Responsivo */
@media (max-width: 768px) {

    table,
    thead,
    tbody,
    th,
    td,
    tr {
        display: block;
    }

    th {
        display: none;
    }

    td {
        position: relative;
        padding-left: 50%;
        border: none;
        border-bottom: 1px solid #e2e8f0;
    }

    td::before {
        position: absolute;
        top: 12px;
        left: 12px;
        width: 45%;
        white-space: nowrap;
        font-weight: bold;
        color: #888;
    }
}
</style>