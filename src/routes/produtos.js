// back: src/routes/produtos.js
import express from "express";
import {
  criarProduto,
  listarProdutos,
  excluirProduto
} from "../controllers/produtoController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Todas as rotas de produtos ficam protegidas pelo token JWT
router.get("/", auth, listarProdutos);
router.post("/", auth, criarProduto);
router.delete("/:id", auth, excluirProduto);

export default router;
