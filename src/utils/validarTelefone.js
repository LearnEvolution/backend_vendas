// Aceita somente números com 10 ou 11 dígitos
export const validarTelefone = (telefone) => {
  // remove tudo, só números
  const numeros = telefone.replace(/\D/g, "");

  // 10 dígitos = fixo | 11 dígitos = celular
  return numeros.length === 10 || numeros.length === 11;
};

export const formatarTelefone = (telefone) => {
  const numeros = telefone.replace(/\D/g, "");

  const ddd = numeros.substring(0, 2);

  // Se tiver 10 dígitos → fixo / 11 dígitos → celular
  const parte1 =
    numeros.length === 10
      ? numeros.substring(2, 6)
      : numeros.substring(2, 7);

  const parte2 =
    numeros.length === 10
      ? numeros.substring(6)
      : numeros.substring(7);

  return `(${ddd}) ${parte1}-${parte2}`;
};
