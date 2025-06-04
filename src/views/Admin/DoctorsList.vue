<template>
    <div>
        <h2>Lista de Médicos</h2>
        <button @click="irParaCadastro">Adicionar Médico</button>

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
                <tr v-for="doctor in doctors" :key="doctor.id">
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
                        <button @click="editarMedico(doctor)">Editar</button>
                        <button @click="excluirMedico(doctor.id)">Excluir</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { medicoApi } from '@/services/http';

export default {
    data() {
        return {
            doctors: []
        };
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
        }
    },
    mounted() {
        this.fetchDoctors();
    }
};
</script>

<style scoped>
div {
    padding: 24px;
    max-width: 1280px;
    margin: auto;
    font-family: 'Segoe UI', sans-serif;
    color: #333;
}

h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 20px;
    text-align: center;
    color: #007bff;
}

button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    margin: 10px 5px;
    transition: 0.3s ease-in-out;
}

button:hover {
    background-color: #0056b3;
    transform: scale(1.03);
}

table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
    margin-top: 20px;
    table-layout: fixed;
}

th,
td {
    padding: 16px 14px;
    text-align: left;
    border-top: 1px solid #dee2e6;
    vertical-align: top;
    word-wrap: break-word;
}

th {
    background-color: #f0f4f8;
    font-weight: bold;
    color: #495057;
}

/* Definindo largura mínima por coluna */
th:nth-child(1),
td:nth-child(1) {
    min-width: 160px;
}

th:nth-child(2),
td:nth-child(2) {
    min-width: 150px;
}

th:nth-child(3),
td:nth-child(3) {
    min-width: 200px;
}

th:nth-child(4),
td:nth-child(4) {
    min-width: 100px;
}

th:nth-child(5),
td:nth-child(5),
th:nth-child(6),
td:nth-child(6),
th:nth-child(7),
td:nth-child(7) {
    min-width: 110px;
}

th:nth-child(8),
td:nth-child(8) {
    min-width: 200px;
}

th:nth-child(9),
td:nth-child(9) {
    min-width: 160px;
}

td button {
    background-color: #6c757d;
    margin-right: 8px;
}

td button:last-child {
    background-color: #dc3545;
}

td button:hover {
    opacity: 0.9;
}

/* Responsividade */
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
