import express from "express";
import Cliente from "../models/Cliente.js";

const router = express.Router();

// === LISTAR CLIENTES ===
router.get("/", async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (err) {
    console.error("Erro ao buscar clientes:", err);
    res.status(500).json({ erro: "Erro ao buscar clientes" });
  }
});

// 🚫 REMOVIDO: nada de cadastro aqui.
// O cadastro deve ser feito em /auth/register

export default router;
