// src/routes/auth.js
import express from "express";
import Cliente from "../models/Cliente.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "troque_essa_chave_prod";

// Registro
router.post("/register", async (req, res) => {
  try {
    const { nome, email, telefone, password } = req.body;
    if (!nome || !email || !password)
      return res.status(400).json({ erro: "nome, email e password são obrigatórios" });

    // se já existe
    const existente = await Cliente.findOne({ email });
    if (existente) return res.status(409).json({ erro: "Email já cadastrado" });

    const cliente = new Cliente({ nome, email, telefone, password });
    await cliente.save();

    return res.status(201).json({ mensagem: "Cadastro realizado com sucesso!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: "Erro ao cadastrar usuário" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ erro: "email e password necessários" });

    const cliente = await Cliente.findOne({ email });
    if (!cliente) return res.status(401).json({ erro: "Credenciais inválidas" });

    const ok = await cliente.comparePassword(password);
    if (!ok) return res.status(401).json({ erro: "Credenciais inválidas" });

    // gerar token simples
    const token = jwt.sign({ id: cliente._id, email: cliente.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ mensagem: "Login ok", token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: "Erro no login" });
  }
});

export default router;
