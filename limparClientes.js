// limparClientes.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Cliente from "./src/models/Cliente.js";

// Carrega o .env que está DENTRO de /src
dotenv.config({ path: "./src/.env" });

async function limparClientes() {
  try {
    console.log("🔄 Conectando ao MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);

    console.log("🗑️ Apagando todos os clientes...");
    await Cliente.deleteMany({});

    console.log("✅ Todos os clientes foram removidos com sucesso!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erro ao apagar clientes:", err);
    process.exit(1);
  }
}

limparClientes();
