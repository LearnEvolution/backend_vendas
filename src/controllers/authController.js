import Cliente from "../models/Cliente.js";
import { validarEmail } from "../utils/validarEmail.js";
import jwt from "jsonwebtoken";

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

    // Verifica se o email já existe
    const existingUser = await Cliente.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email já cadastrado" });
    }

    // Salva usuário
    await Cliente.create({
      nome,
      telefone,
      email,
      senha, // hash é feito no model
    });

    res.json({
      success: true,
      msg: "Usuário registrado com sucesso!"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
};


// ===== LOGIN =====
export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verifica usuário
    const user = await Cliente.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Usuário não encontrado" });
    }

    // Verifica senha
    const senhaValida = await user.comparePassword(senha);
    if (!senhaValida) {
      return res.status(400).json({ msg: "Senha incorreta" });
    }

    // Gera token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      msg: "Login realizado com sucesso!",
      token,
      user: {
        nome: user.nome,
        email: user.email,
        telefone: user.telefone
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erro no login" });
  }
};
