// backend/sistema-vendas/src/utils/validarEmail.js
import dns from "dns/promises";

/**
 * Lista de provedores populares que consideramos "confiáveis".
 * Se o domínio for exatamente um desses, aceitamos mesmo sem MX.
 * (adicione ou remova conforme desejar)
 */
const popularDomains = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "yahoo.com",
  "yahoo.com.br",
  "icloud.com",
  "live.com",
  "msn.com",
  "aol.com",
  "gmx.com",
  "protonmail.com",
  "zoho.com",
  "mail.com",
  "edu.br" // nota: educação — se quiser remover, remova daqui
]);

/**
 * Levenshtein (distância mínima entre strings) - implementação simples.
 * Usada para detectar typos próximos a provedores populares.
 */
function levenshtein(a = "", b = "") {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const matrix = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) matrix[i][0] = i;
  for (let j = 0; j <= n; j++) matrix[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,       // deletion
        matrix[i][j - 1] + 1,       // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return matrix[m][n];
}

/**
 * Exported: validarEmail(email) -> Promise<boolean>
 *
 * Regras:
 * - checa formato básico
 * - tenta resolver MX (se existir MX -> OK)
 * - se não houver MX:
 *    - se domínio exatamente em popularDomains -> OK
 *    - se domínio for muito próximo (dist <= 1) de um popularDomain -> REJEITA (provável typo)
 *    - caso contrário -> REJEITA (conservador)
 */
export async function validarEmail(email) {
  if (!email || typeof email !== "string") return false;

  // 1) formato básico
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!regex.test(email.trim())) return false;

  const domain = email.trim().split("@").pop().toLowerCase();

  // segurança: domain deve ter pelo menos uma '.' (ex: example.com)
  if (!domain.includes(".")) return false;

  // 2) tenta MX
  try {
    const mx = await dns.resolveMx(domain);
    if (mx && mx.length > 0) {
      return true;
    }
    // se não retornou MX, caímos para a checagem de provedores populares
  } catch (err) {
    // se houver erro de DNS (ex.: bloqueio), não aceitamos automaticamente,
    // mas vamos verificar a lista de provedores populares.
    // console.error("DNS MX error:", err && err.code ? err.code : err);
  }

  // 3) domínio popular (aceita mesmo sem MX)
  if (popularDomains.has(domain)) {
    return true;
  }

  // 4) detectar typos para domínios populares: se domain estiver a distancia <= 1
  //    de algum provedor popular, consideramos provável DIGITAÇÃO ERRADA e REJEITAMOS.
  for (const pd of popularDomains) {
    const dist = levenshtein(domain, pd);
    if (dist <= 1) {
      // domínio muito próximo de um popular (ex: gmai.com) -> recusar
      return false;
    }
  }

  // 5) caso não resolva MX e não seja popular -> conservador: rejeitar
  return false;
}

