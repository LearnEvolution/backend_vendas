// Validação forte de e-mail (não aceita email@email.com.com)
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

// Validação de senha (mínimo 4 chars)
function isValidPassword(password) {
  return password && password.length >= 4;
}

export async function register(req, res) {
  try {
    const { name, phone, email, password } = req.body;

    // ---- VALIDAR E-MAIL ----
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "E-mail inválido!" });
    }

    // ---- VALIDAR SENHA ----
    if (!isValidPassword(password)) {
      return res
        .status(400)
        .json({ message: "A senha deve ter no mínimo 4 caracteres." });
    }

    // ---- VALIDAR TELEFONE ----
    if (!/^\d{10,11}$/.test(phone)) {
      return res.status(400).json({ message: "Telefone inválido!" });
    }

    // ---- VALIDAR NOME ----
    if (!name || name.length < 3) {
      return res.status(400).json({ message: "Nome inválido!" });
    }

    // Continua o cadastro (como já estava no seu código)
    const user = await User.create({ name, phone, email, password });

    return res.status(201).json(user);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
}
