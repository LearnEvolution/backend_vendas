import mongoose from "mongoose";

const produtoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  estoque: { type: Number, default: 0 },
  dataCadastro: { type: Date, default: Date.now },
});

export default mongoose.model("Produto", produtoSchema);

