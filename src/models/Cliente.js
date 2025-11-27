import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  telefone: { type: String, required: true },
  email: { type: String }, // email do cliente (opcional)
  usuarioEmail: { type: String, required: true }, // dono do cliente
  dataCadastro: { type: Date, default: Date.now }
});

export default mongoose.model("Cliente", clienteSchema);
