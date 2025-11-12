import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// ✅ CORS Liberado para todos os domínios HTTPS e HTTP
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false
}));

// ✅ Middleware de parsing
app.use(express.json());

// ✅ Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado!"))
  .catch(err => console.error("❌ Erro ao conectar MongoDB:", err));

// ✅ Rotas simples de teste
app.get("/", (req, res) => {
  res.json({ message: "🚀 API Sistema de Vendas online com CORS liberado!" });
});

// Exemplo: rotas de clientes e produtos
import clientesRouter from "./routes/clientes.js";
import produtosRouter from "./routes/produtos.js";

app.use("/clientes", clientesRouter);
app.use("/produtos", produtosRouter);

// ✅ Tratamento de erros genéricos
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// ✅ Porta dinâmica para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
