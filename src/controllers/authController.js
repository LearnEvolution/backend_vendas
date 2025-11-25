// src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Cliente from "../models/Cliente.js";
import fetch from "node-fetch";

// ===== FUNÇÃO PARA VALIDAR EMAIL REAL =====
async function validarEmailReal(email) {
  try {
    const apiKey = process.env.ABSTRACT_EMAIL_API_KEY;

    const response = await fetch(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`
    );

    const data = await response.json();

    // Se o serviço não conseguir validar, ou se marcar como inválido
    if (!data.is_valid_format.value || data.deliverability === "UNDELIVERABLE") {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erro ao validar email real:", error);
    return false;
  }
}

// ===== REGISTER =====
export const register = async (req, res) => {
  try {
    const { nome, telefone, email, senha } = req.body;

    // 1️⃣ VALIDAÇÃO SIMPLES DE FORMATO (regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Formato de email inválido" });
    }

    // 2️⃣ VALIDAÇÃO REAL DO EMAIL (API)
    const emailReal = await validarEmailReal(email);
    if (!emailReal) {
      return res.status(400).json({ msg: "Email não é real ou não existe" });
    }

    // Senha mínima
    if (!senha || senha.length < 4) {
      return res
        .status(400)
        .json({ msg: "A senha deve ter pelo menos 4 caracteres" });
    }

    // Usuário já existe?
    const existingUser = await Cliente.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email já cadastrado" });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criar usuário
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

