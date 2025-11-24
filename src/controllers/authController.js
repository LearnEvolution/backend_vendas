// src/controllers/authController.js
import Cliente from "../models/Cliente.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

// Função simples para validar email (regex segura)
function emailValido(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// ================================
// REGISTRAR CLIENTE
// ================================
export async function register(req, res) {
  try {
    const { nome, email, telefone, senha } = req.body;

    // 1️⃣ valida email
    if (!emailValido(email)) {
      return res.status(400).json({ msg: "E-mail inválido." });
    }

    // 2️⃣ valida senha (mínimo 4 caracteres)
    if (!senha || senha.length < 4) {
      return res.status(400).json({ msg: "A senha deve ter no mínimo 4 caracteres." });
    }

    // 3️⃣ verifica se já existe
    const existe = await Cliente.findOne({ email });
    if (existe) {
      return res.status(400).json({ msg: "Usuário já existe. Faça login." });
    }

    // 4️⃣ cria usuário
    await Cliente.create({
      nome,
      email,
      telefone,
      senha,
    });

    return res.status(201).json({ msg: "Cadastro realizado com sucesso!" });

  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

// ================================
// LOGIN
// ================================
export async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const cliente = await Cliente.findOne({ email });
    if (!cliente) {
      return res.status(400).json({ msg: "Usuário não encontrado." });
    }

    const senhaOk = await bcrypt.compare(senha, cliente.senha);
    if (!senhaOk) {
      return res.status(401).json({ msg: "Senha incorreta!" });
    }

    const token = jwt.sign(
      { id: cliente._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ msg: "Login bem-sucedido!", token });

  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

