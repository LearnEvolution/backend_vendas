// src/routes/vendas.js  (BACK)
import express from "express";
import { criarVenda, listarVendas } from "../controllers/vendaController.js";

const router = express.Router();

router.post("/", criarVenda);
router.get("/", listarVendas);

export default router;
