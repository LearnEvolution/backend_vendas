// src/controllers/authController.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Cliente from "../models/Cliente.js";
import axios from "axios";

// Função para validar e-mail via Abstract API (apenas formato/domínio)
async function validarEmail(email) {
  const apiKey = process.env.ABSTRACT_EMAIL_API_KEY;

  try {
    const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;
    const response = await axios.get(url);
    const data = response.data;

    // Formato inválido → BLOQUEIA
    if (!data.is_valid_format.value) return false;

    // Domínio inválido → BLOQUEIA
    if (!data.is_valid_domain.value) return false;

    // SMTP falhou → NÃO bloquear (Google, Microsoft bloqueiam)
    return true;

  } catch (error) {
    console.error("Erro ao validar e-mail:", error);
    return true; // Se API cair → não bloquear
  }
}

// ===== REGISTER =====
export const register = async (req, res) => {
  try {
    const { nome, telefone, email, senha } = req.body;

    // Validação do email
    const emailValido = await validarEmail(email);
    if (!emailValido) {
      return res.status(400).json({ msg: "Email inválido ou domínio inexistente" });
    }

    // Senha mínima
    if (!senha || senha.length < 4) {
      return res.status(400).json({ msg: "A senha deve ter pelo menos 4 caracteres" });
    }

    // Verifica se já existe
    const existingUser = await Cliente.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email já cadastrado" });
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Salva usuário
    await Cliente.create({
      nome,
      telefone,
      email,
      senha: hashedPassword,
    });

    res.json({
      success: true,
      msg: "Usuário registrado com sucesso!",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
};

// ===== LOGIN =====
export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await Cliente.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Usuário não encontrado" });
    }

    // Detecta se senha no banco é hash ou texto puro
    const senhaEhHash =
      user.senha.startsWith("$2a$") || user.senha.startsWith("$2b$");

    let validPass = false;

    if (!senhaEhHash) {
      // Senha antiga (texto puro)
      validPass = senha === user.senha;

      // Se senha antiga estiver correta → converter para hash
      if (validPass) {
        const novaHash = await bcrypt.hash(senha, 10);
        user.senha = novaHash;
        await user.save();
      }
    } else {
      // Senha nova (bcrypt)
      validPass = await bcrypt.compare(senha, user.senha);
    }

    if (!validPass) {
      return res.status(400).json({ msg: "Senha incorreta" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      msg: "Login realizado com sucesso!",
      token,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
};

