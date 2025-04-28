export function validarNome(nome) {
  return nome.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
}

export function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }
  let soma = 0;
  let resto;
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) {
    return false;
  }
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) {
    return false;
  }
  return true;
}

export function formatarCRM(crm) {
  return crm.replace(/\D/g, "").slice(0, 6);
}

export function formatarValorConsulta(valor) {
  let valorFormatado = valor.replace(/\D/g, "");
  if (valor === "" || parseFloat(valor) === 0) {
    return "R$ 0,00";
  }
  return (parseFloat(valor) / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function validarHorario(dia) {
  if (dia[1].fim <= dia[1].inicio) {
    return "O horário final deve ser maior que o horário inicial.";
  }
  return null;
}

export function gerarHorarios(horaInicio, horaFim, intervaloMinutos) {
  const horarios = [];
  let [hora, minuto] = horaInicio.split(":").map(Number);
  const [fimHora, fimMinuto] = horaFim.split(":").map(Number);

  while (hora < fimHora || (hora === fimHora && minuto <= fimMinuto)) {
    const horaFormatada = `${String(hora).padStart(2, "0")}:${String(
      minuto
    ).padStart(2, "0")}`;
    horarios.push(horaFormatada);
    minuto += intervaloMinutos;
    if (minuto >= 60) {
      minuto -= 60;
      hora++;
    }
  }
  return horarios;
}
