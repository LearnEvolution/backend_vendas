import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();

// --- CORS CORRIGIDO ---

// --- CORS ---
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://sistema-vendas-react.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  
}));


// --- Body Parser ---
app.use(express.json());

// --- Rotas ---
app.use("/auth", authRoutes);

// --- MongoDB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado!"))
  .catch(err => console.error("❌ Erro ao conectar MongoDB:", err));

// --- Rota raiz ---
app.get("/", (req, res) =>
  res.json({ message: "🚀 API Sistema de Vendas online!" })
);

// --- Servidor ---
const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
);
