// src/controllers/produtoController.js
import Produto from "../models/Produto.js";

export const criarProduto = async (req, res) => {
  try {
    const novo = await Produto.create(req.body);
    res.status(201).json({ msg: "Produto criado!", produto: novo });
  } catch (err) {
    console.error("Erro ao criar produto:", err);
    res.status(500).json({ msg: "Erro ao criar produto", erro: err.message });
  }
};

export const listarProdutos = async (req, res) => {
  try {
    const lista = await Produto.find().sort({ dataCadastro: -1 });
    res.json(lista);
  } catch (err) {
    console.error("Erro ao listar produtos:", err);
    res.status(500).json({ msg: "Erro ao listar produtos", erro: err.message });
  }
};

export const excluirProduto = async (req, res) => {
  try {
    const { id } = req.params;
    await Produto.findByIdAndDelete(id);
    res.json({ msg: "Produto excluído com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir produto:", err);
    res.status(500).json({ msg: "Erro ao excluir produto", erro: err.message });
  }
};
