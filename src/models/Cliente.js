// src/models/Cliente.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const clienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefone: String,
  password: { type: String, required: true }, // senha hashed
  dataCadastro: { type: Date, default: Date.now }
});

// Antes de salvar, hash da senha se alterada
clienteSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar senha
clienteSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model("Cliente", clienteSchema);
