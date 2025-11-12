import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ CONFIGURAÇÃO DO CORS (PERMITE FRONTEND DA VERCEL)
app.use(cors({
  origin: [
    "https://sistema-vendas-react-8mm87gdz7-learnevolutions-projects.vercel.app", // seu site na Vercel
    "http://localhost:5173" // para testes locais
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ✅ CONEXÃO COM O BANCO MONGODB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado!"))
  .catch(err => console.error("❌ Erro ao conectar no MongoDB:", err));

// ✅ ROTAS DE CLIENTES
import clientesRouter from "./routes/clientes.js";
app.use("/clientes", clientesRouter);

// ✅ ROTAS DE PRODUTOS
import produtosRouter from "./routes/produtos.js";
app.use("/produtos", produtosRouter);

// ✅ ROTA PADRÃO
app.get("/", (req, res) => {
  res.send("API do Sistema de Vendas está online 🚀");
});

// ✅ PORTA DO SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
