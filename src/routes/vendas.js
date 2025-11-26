// src/routes/vendas.js  (BACK)
import express from "express";
import { criarVenda, listarVendas } from "../controllers/vendaController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Criar venda (precisa estar logado)
router.post("/", auth, criarVenda);

// Listar vendas (precisa estar logado)
router.get("/", auth, listarVendas);

export default router;
