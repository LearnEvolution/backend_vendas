// src/controllers/produtoController.js
import Produto from "../models/Produto.js";

// Criar produto – pega email do token (req.user.email)
export const criarProduto = async (req, res) => {
  try {
    const usuarioEmail = req.user.email; // 👈 agora sempre confiável

    const { nome, preco } = req.body;

    if (!nome || !preco) {
      return res.status(400).json({ msg: "Nome e preço são obrigatórios." });
    }

    const novo = await Produto.create({
      nome,
      preco,
      usuarioEmail
    });

    res.status(201).json({ msg: "Produto criado!", produto: novo });

  } catch (err) {
    console.error("Erro ao criar produto:", err);
    res.status(500).json({ msg: "Erro ao criar produto", erro: err.message });
  }
};

// Listar produtos – lista somente do usuário logado
export const listarProdutos = async (req, res) => {
  try {
    const usuarioEmail = req.user.email;

    const lista = await Produto.find({ usuarioEmail }).sort({
      dataCadastro: -1,
    });

    res.json(lista);

  } catch (err) {
    console.error("Erro ao listar produtos:", err);
    res.status(500).json({ msg: "Erro ao listar produtos", erro: err.message });
  }
};

// Excluir produto – garante que só exclui produto do usuário logado
export const excluirProduto = async (req, res) => {
  try {
    const usuarioEmail = req.user.email;
    const { id } = req.params;

    // Garante que só exclui produtos do dono
    const encontrado = await Produto.findOne({ _id: id, usuarioEmail });
    if (!encontrado) {
      return res.status(404).json({ msg: "Produto não encontrado ou não pertence ao usuário." });
    }

    await Produto.findByIdAndDelete(id);

    res.json({ msg: "Produto excluído com sucesso" });

  } catch (err) {
    console.error("Erro ao excluir produto:", err);
    res.status(500).json({ msg: "Erro ao excluir produto", erro: err.message });
  }
};
