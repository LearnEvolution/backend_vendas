import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const clienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefone: String,
  senha: { type: String, required: true }, // senha hashed
  dataCadastro: { type: Date, default: Date.now }
});

// Antes de salvar, hash da senha se alterada
clienteSchema.pre("save", async function (next) {
  if (!this.isModified("senha")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar senha
clienteSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.senha);
};

export default mongoose.model("Cliente", clienteSchema);
