// ===== REGISTER =====
export const register = async (req, res) => {
  try {
    const { nome, telefone, email, senha } = req.body;

    // Validação do email
    const emailValido = await validarEmail(email);
    if (!emailValido) {
      return res.status(400).json({ msg: "Email inválido ou domínio inexistente" });
    }

    // Senha mínima
    if (!senha || senha.length < 4) {
      return res.status(400).json({ msg: "A senha deve ter pelo menos 4 caracteres" });
    }

    // Verifica se já existe
    const existingUser = await Cliente.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email já cadastrado" });
    }

    // Salva usuário (SEM hash aqui — o Model faz isso automaticamente)
    await Cliente.create({
      nome,
      telefone,
      email,
      senha,
    });

    res.json({
      success: true,
      msg: "Usuário registrado com sucesso!",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
};
