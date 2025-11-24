// ================================
// REGISTRAR CLIENTE
// ================================
export async function register(req, res) {
  try {
    const { nome, email, telefone, senha } = req.body;

    // 1️⃣ Validação simples de e-mail (aceita Gmail, Hotmail, etc)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Formato de e-mail inválido." });
    }

    // 2️⃣ Verifica se já existe no banco
    const existe = await Cliente.findOne({ email });
    if (existe) {
      return res.status(400).json({ msg: "Usuário já existe. Faça login." });
    }

    // 3️⃣ Cria usuário
    await Cliente.create({
      nome,
      email,
      telefone,
      senha, // o model faz o hash automaticamente
    });

    return res.status(201).json({ msg: "Cadastro realizado com sucesso!" });

  } catch (err) {
    console.error("Erro no register:", err);
    return res.status(500).json({ erro: err.message });
  }
}
