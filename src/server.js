import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import clienteVendaRoutes from "./routes/clienteVendaRoutes.js";
import clientesRoutes from "./routes/clientes.js";
import produtosRoutes from "./routes/produtos.js";

dotenv.config();
const app = express();

// ---------------------
// CORS
// ---------------------
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ---------------------
// BODY PARSER
// ---------------------
app.use(express.json());

// ---------------------
// ROTAS DA API
// ---------------------
app.use("/auth", authRoutes);
app.use("/clientes", clientesRoutes);
app.use("/produtos", produtosRoutes);
app.use("/cliente-venda", clienteVendaRoutes);

// ---------------------
// MONGO DB
// ---------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado!"))
  .catch((err) => console.error("❌ Erro ao conectar MongoDB:", err));

// ---------------------
// ROTA RAIZ
// ---------------------
app.get("/", (req, res) =>
  res.json({ message: "🚀 API Sistema de Vendas online!" })
);

// ---------------------
// SERVIDOR
// ---------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
);
