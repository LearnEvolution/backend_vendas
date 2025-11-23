import mongoose from "mongoose";

const ClienteVendaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  telefone: { type: String },
  email: { type: String },
  cpf: { type: String },
  endereco: {
    rua: String,
    numero: String,
    cidade: String,
    estado: String,
    cep: String
  },
  criadoEm: { type: Date, default: Date.now }
});

const ClienteVenda = mongoose.model("ClienteVenda", ClienteVendaSchema);
export default ClienteVenda;
