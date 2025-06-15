<template>
    <div>
        <h2>Lista de Pacientes</h2>
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Data de Nascimento</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="patient in patients" :key="patient.id">
                    <td>{{ patient.name }}</td>
                    <td>{{ patient.dob }}</td>
                    <td>
                        <button @click="editPatient(patient.id)">Editar</button>
                        <button @click="deletePatient(patient.id)">Excluir</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 12px;
    text-align: left;
    border: 1px solid #ddd;
}

button {
    padding: 8px 16px;
    margin: 5px;
    background-color: #f44336;
    color: white;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #d32f2f;
}
</style>

<script>
export default {
    data() {
        return {
            patients: [
                { id: 1, name: 'Carlos Silva', dob: '1985-02-15' },
                { id: 2, name: 'Ana Oliveira', dob: '1992-08-25' },
                // Dados simulados, que viriam de uma API
            ]
        };
    },
    methods: {
        editPatient(id) {
            this.$router.push({ name: 'editPatient', params: { id } });
        },
        deletePatient(id) {
            if (confirm('Tem certeza que deseja excluir?')) {
                this.patients = this.patients.filter(patient => patient.id !== id);
            }
        }
    }
};
</script>
