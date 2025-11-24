// src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Cliente from "../models/Cliente.js";

// ===== REGISTER =====
export const register = async (req, res) => {
  try {
    const { nome, telefone, email, senha } = req.body;

    // VALIDAÇÃO FORTE DE EMAIL
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Email inválido" });
    }

    // VALIDA SENHA (mínimo 4 caracteres)
    if (!senha || senha.length < 4) {
      return res
        .status(400)
        .json({ msg: "A senha deve ter pelo menos 4 caracteres" });
    }

    // CHECA USUÁRIO EXISTENTE
    const existingUser = await Cliente.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email já cadastrado" });
    }

    // HASH DA SENHA
    const hashedPassword = await bcrypt.hash(senha, 10);

    // SALVA NO BANCO
    await Cliente.create({
      nome,
      telefone,
      email,
      senha: hashedPassword,
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

// ===== LOGIN =====
export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await Cliente.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Usuário não encontrado" });
    }

    const validPass = await bcrypt.compare(senha, user.senha);
    if (!validPass) {
      return res.status(400).json({ msg: "Senha incorreta" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      msg: "Login realizado com sucesso!",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
};
