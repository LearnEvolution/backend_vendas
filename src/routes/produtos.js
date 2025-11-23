// src/routes/produtos.js
import express from "express";
import {
  criarProduto,
  listarProdutos,
  excluirProduto
} from "../controllers/produtoController.js";

const router = express.Router();

// Listar produtos
router.get("/", listarProdutos);

// Criar produto
router.post("/", criarProduto);

// Excluir produto
router.delete("/:id", excluirProduto);

export default router;
