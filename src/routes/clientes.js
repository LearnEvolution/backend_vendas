import express from "express";
import Cliente from "../models/Cliente.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/**
 * CRIAR CLIENTE
 * POST /clientes
 * body: { nome, telefone }
 * usa req.user.email como dono (usuarioEmail)
 */
router.post("/", auth, async (req, res) => {
  try {
    const usuarioEmail = req.user.email;
    const { nome, telefone } = req.body;

    if (!nome || !telefone) {
      return res.status(400).json({ msg: "Nome e telefone são obrigatórios" });
    }

    const cliente = await Cliente.create({
      nome,
      telefone,
      usuarioEmail,
    });

    res.status(201).json({
      msg: "Cliente criado!",
      cliente,
    });

  } catch (err) {
    console.error("Erro ao criar cliente:", err);
    res.status(500).json({ erro: "Erro ao criar cliente" });
  }
});

/**
 * LISTAR CLIENTES
 * GET /clientes
 * retorna somente os clientes do usuário logado
 */
router.get("/", auth, async (req, res) => {
  try {
    const usuarioEmail = req.user.email;

    const clientes = await Cliente.find({
      usuarioEmail
    }).sort({ dataCadastro: -1 });

    res.json(clientes);

  } catch (err) {
    console.error("Erro ao buscar clientes:", err);
    res.status(500).json({ erro: "Erro ao buscar clientes" });
  }
});

export default router;
