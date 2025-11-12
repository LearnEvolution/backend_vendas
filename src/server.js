// src/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Configuração do caminho para o .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
app.use(express.json());

// ✅ Configuração correta de CORS
app.use(
  cors({
    origin: [
      "https://sistema-vendas-react.vercel.app", // domínio principal do seu front
      "https://sistema-vendas-react-p4mbmf9sc-learnevolutions-projects.vercel.app", // domínio temporário da Vercel
      "http://localhost:5173", // ambiente local de desenvolvimento
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Teste rápido (rota raiz)
app.get("/", (req, res) => {
  res.json({ mensagem: "🚀 API do Sistema de Vendas está online!" });
});

// Rotas
import clientesRoutes from "./routes/clientes.js";
import produtosRoutes from "./routes/produtos.js";
app.use("/clientes", clientesRoutes);
app.use("/produtos", produtosRoutes);

// Conexão com o MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
