import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const clienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  telefone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now }
});

// Hash antes de salvar
clienteSchema.pre("save", async function (next) {
  if (!this.isModified("senha")) return next();

  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

// Comparar senha
clienteSchema.methods.comparePassword = function (senhaDigitada) {
  return bcrypt.compare(senhaDigitada, this.senha);
};

export default mongoose.model("Cliente", clienteSchema);
