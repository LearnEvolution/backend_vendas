import dns from "dns/promises";

export const validarEmail = async (email) => {
  if (!email) return false;

  // ---- 1) Valida formato ----
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return false;

  // ---- 2) Valida domínio via DNS MX ----
  const dominio = email.split("@")[1];

  try {
    const registros = await dns.resolveMx(dominio);
    return registros && registros.length > 0;
  } catch (e) {
    return false;
  }
};
