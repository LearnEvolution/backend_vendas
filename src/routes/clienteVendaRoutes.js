import express from "express";
import { criarClienteVenda } from "../controllers/clienteVendaController.js";

const router = express.Router();

// Criar cliente de venda
router.post("/", criarClienteVenda);

export default router;
