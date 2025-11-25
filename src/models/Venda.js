// src/models/Venda.js  (BACK)
import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  produto: { type: mongoose.Schema.Types.ObjectId, ref: "Produto", required: true },
  nome: { type: String, required: true },
  precoUnitario: { type: Number, required: true }, // preço no momento da venda
  quantidade: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true } // precoUnitario * quantidade
});

const VendaSchema = new mongoose.Schema({
  itens: { type: [ItemSchema], required: true },
  total: { type: Number, required: true },
  formaPagamento: { type: String, default: "dinheiro" }, // opcional
  cliente: { type: String, default: null },
  criadoEm: { type: Date, default: Date.now }
});

export default mongoose.model("Venda", VendaSchema);
