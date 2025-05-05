<template>
    <div>
        <h2>Lista de Médicos</h2>
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Especialidade</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="doctor in doctors" :key="doctor.id">
                    <td>{{ doctor.name }}</td>
                    <td>{{ doctor.specialty }}</td>
                    <td>
                        <button @click="editDoctor(doctor.id)">Editar</button>
                        <button @click="deleteDoctor(doctor.id)">Excluir</button>
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
            doctors: [
                { id: 1, name: 'Dr. João Silva', specialty: 'Cardiologia' },
                { id: 2, name: 'Dra. Maria Souza', specialty: 'Dermatologia' },
                // Dados simulados, que viriam de uma API
            ]
        };
    },
    methods: {
        editDoctor(id) {
            this.$router.push({ name: 'editDoctor', params: { id } });
        },
        deleteDoctor(id) {
            if (confirm('Tem certeza que deseja excluir?')) {
                this.doctors = this.doctors.filter(doctor => doctor.id !== id);
            }
        }
    }
};
</script>
