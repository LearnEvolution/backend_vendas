import axios from "axios";

export async function validateEmailReal(email) {
  const API_KEY = process.env.EMAIL_VERIFY_KEY;

  const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${API_KEY}&email=${email}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    // Se o email não existir na vida real:
    if (data.deliverability !== "DELIVERABLE") {
      return false;
    }

    return true;

  } catch (error) {
    console.error("Erro ao verificar email:", error.message);
    return false;
  }
}
