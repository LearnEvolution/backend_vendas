// src/controllers/authController.js
import Cliente from "../models/Cliente.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
dotenv.config();

// REGISTRAR CLIENTE
export async function register(req, res) {
  try {
    const { nome, email, telefone, senha } = req.body;

    // Verifica se já existe
    const existe = await Cliente.findOne({ email });
    if (existe) {
      return res.status(400).json({ msg: "Usuário já existe. Faça login." });
    }

    // NÃO precisamos hashear aqui, o model já faz isso automaticamente!
    await Cliente.create({
      nome,
      email,
      telefone,
      senha, // senha pura → o schema fará o hash no pre("save")
    });

    res.status(201).json({ msg: "Cadastro realizado com sucesso!" });
  } catch (err) {
    console.error("Erro no register:", err);
    res.status(500).json({ erro: err.message });
  }
}

// LOGIN
export async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const cliente = await Cliente.findOne({ email });
    if (!cliente) {
      return res.status(400).json({ msg: "Usuário não encontrado." });
    }

    // Verifica senha com bcrypt
    const senhaOk = await bcrypt.compare(senha, cliente.senha);
    if (!senhaOk) {
      return res.status(401).json({ msg: "Senha incorreta!" });
    }

    // Gera token
    const token = jwt.sign(
      { id: cliente._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ msg: "Login bem-sucedido!", token });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ erro: err.message });
  }
}
