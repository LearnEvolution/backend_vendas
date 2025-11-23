// src/controllers/produtoController.js
import Produto from "../models/Produto.js";

// Criar produto
export const criarProduto = async (req, res) => {
  try {
    const { nome, preco, usuarioEmail } = req.body;

    if (!usuarioEmail) {
      return res.status(400).json({ msg: "Email do usuário é obrigatório." });
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

// Listar produtos APENAS do usuário logado
export const listarProdutos = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ msg: "Email é obrigatório na consulta." });
    }

    const lista = await Produto.find({ usuarioEmail: email }).sort({
      dataCadastro: -1,
    });

    res.json(lista);
  } catch (err) {
    console.error("Erro ao listar produtos:", err);
    res.status(500).json({ msg: "Erro ao listar produtos", erro: err.message });
  }
};

// Excluir produto
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
