import express from "express";
import Cliente from "../models/Cliente.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// === LISTAR CLIENTES DO USUÁRIO LOGADO ===
router.get("/", auth, async (req, res) => {
  try {
    const usuarioEmail = req.user.email;

    const clientes = await Cliente.find({ email: usuarioEmail })
      .sort({ createdAt: -1 });

    res.json(clientes);

  } catch (err) {
    console.error("Erro ao buscar clientes:", err);
    res.status(500).json({ erro: "Erro ao buscar clientes" });
  }
});

export default router;
