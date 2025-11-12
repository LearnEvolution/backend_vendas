import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// ✅ CORS liberado para qualquer origem (resolve erro do navegador)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// ✅ Conexão MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado!"))
  .catch(err => console.error("❌ Erro ao conectar ao MongoDB:", err));

// ✅ Importa e usa as rotas
import clientesRouter from "./routes/clientes.js";
import produtosRouter from "./routes/produtos.js";

app.use("/clientes", clientesRouter);
app.use("/produtos", produtosRouter);

// ✅ Rota inicial (teste)
app.get("/", (req, res) => {
  res.send("🚀 API do Sistema de Vendas online e com CORS liberado!");
});

// ✅ Inicia servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Servidor rodando na porta ${PORT}`));
