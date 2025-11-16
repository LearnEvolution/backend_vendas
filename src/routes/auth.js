// src/routes/auth.js
import express from "express";
import { registrar, login } from "../controllers/authController.js";

const router = express.Router();

// Rotas corrigidas para coincidir com o controller
router.post("/register", registrar);   // <-- note que aqui é /register
router.post("/login", login);

export default router;
