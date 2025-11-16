import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();

// --- CORS ---
const allowedOrigins = [
  "https://sistema-vendas-react.vercel.app", // seu frontend em produção
  "http://localhost:5173",                   // seu frontend local (Vite)
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // permitir Postman ou backend sem origem
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `Acesso negado pela política de CORS: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// --- Body parser ---
app.use(express.json());

// --- Rotas ---
app.use("/auth", authRoutes);

// --- MongoDB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado!"))
  .catch(err => console.error("❌ Erro ao conectar MongoDB:", err));

// --- Teste ---
app.get("/", (req, res) => res.json({ message: "🚀 API Sistema de Vendas online!" }));

// --- Servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
