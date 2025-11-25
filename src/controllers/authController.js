// src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Cliente from "../models/Cliente.js";
import axios from "axios";

// Função para validar e-mail via Abstract API (somente domínio / formato)
async function validarEmail(email) {
  const apiKey = process.env.ABSTRACT_EMAIL_API_KEY;

  try {
    const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;
    const response = await axios.get(url);
    const data = response.data;

    // 1. Formato inválido → BLOQUEIA
    if (!data.is_valid_format.value) {
      return false;
    }

    // 2. Domínio inválido → BLOQUEIA
    if (!data.is_valid_domain.value) {
      return false;
    }

    // 3. SMTP falhou → NÃO bloqueia (provedores grandes sempre bloqueiam)
    return true;

  } catch (error) {
    console.error("Erro ao validar e-mail:", error);
    // Se a API cair, NÃO bloquear o usuário
    return true;
  }
}

// ===== REGISTER =====
export const register = async (req, res) => {
  try {
    const { nome, telefone, email, senha } = req.body;

    // ========= VALIDAÇÃO DE E-MAIL =========
    const emailValido = await validarEmail(email);
    if (!emailValido) {
      return res.status(400).json({ msg: "Email inválido ou domínio inexistente" });
    }

    // ========= VALIDAÇÃO DE SENHA =========
    if (!senha || senha.length < 4) {
      return res
        .status(400)
        .json({ msg: "A senha deve ter pelo menos 4 caracteres" });
    }

    // ========= CHECA SE O EMAIL JÁ EXISTE NO BANCO =========
    const existingUser = await Cliente.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email já cadastrado" });
    }

    // ========= HASH DA SENHA =========
    const hashedPassword = await bcrypt.hash(senha, 10);

    // ========= SALVA NO BANCO =========
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

    const validPass = await bcrypt.compare(senha, user.senha);
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
