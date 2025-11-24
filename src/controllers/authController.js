// src/controllers/authController.js
import Cliente from "../models/Cliente.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

// ================================
// REGISTRAR CLIENTE
// ================================
export async function register(req, res) {
  try {
    const { nome, email, telefone, senha } = req.body;

    // 1️⃣ Verifica se já existe
    const existe = await Cliente.findOne({ email });
    if (existe) {
      return res.status(400).json({ msg: "Usuário já existe. Faça login." });
    }

    // 2️⃣ Cria usuário
    await Cliente.create({
      nome,
      email,
      telefone,
      senha, // o model já faz hash
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
