// Validação simples de email — sem API externa
const validarEmail = async (email) => {
  if (!email) return false;

  // Regex simples e segura para formato de email
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email);
};

export default validarEmail;
