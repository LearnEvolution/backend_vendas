import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ===== REGISTER =====
export const register = async (req, res) => {
  try {
    const { name, cpf, email, password } = req.body;

    // VALIDAÇÃO FORTE DE EMAIL
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Email inválido" });
    }

    // VALIDA SENHA (mínimo 4 caracteres)
    if (!password || password.length < 4) {
      return res
        .status(400)
        .json({ error: "A senha deve ter pelo menos 4 caracteres" });
    }

    // CHECA USUÁRIO EXISTENTE
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    // HASH DA SENHA
    const hashedPassword = await bcrypt.hash(password, 10);

    // SALVA NO BANCO
    await User.create({
      name,
      cpf,
      email,
      password: hashedPassword,
    });

    res.json({
      success: true,
      message: "Usuário registrado com sucesso!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro no servidor" });
  }
};

// ===== LOGIN =====
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).json({ error: "Senha incorreta" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      message: "Login realizado com sucesso!",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro no servidor" });
  }
};
