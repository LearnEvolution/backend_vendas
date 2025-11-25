export const validarTelefone = (telefone) => {
  const regex = /^(\+55\s?)?\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
  return regex.test(telefone);
};

export const formatarTelefone = (telefone) => {
  // Remove tudo que não for número
  const numeros = telefone.replace(/\D/g, "");

  // Pega as partes
  const ddd = numeros.substring(0, 2);
  const parte1 = numeros.length === 10
    ? numeros.substring(2, 6)
    : numeros.substring(2, 7); // 4 dígitos fixo | 5 dígitos celular

  const parte2 = numeros.length === 10
    ? numeros.substring(6)
    : numeros.substring(7);

  return `(${ddd}) ${parte1}-${parte2}`;
};
