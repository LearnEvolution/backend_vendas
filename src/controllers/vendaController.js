// src/controllers/vendaController.js  (BACK)
import Venda from "../models/Venda.js";
import Produto from "../models/Produto.js";

/**
 * Cria uma venda.
 * Body esperado:
 * {
 *   itens: [{ produto: "<produtoId>", quantidade: 2 }],
 *   formaPagamento: "cartao",
 *   cliente: "nome ou id opcional"
 * }
 */
export const criarVenda = async (req, res) => {
  try {
    const { itens, formaPagamento, cliente } = req.body;

    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ msg: "Carrinho vazio" });
    }

    const itensComDetalhes = [];
    let total = 0;

    for (const item of itens) {
      if (!item.produto || !item.quantidade || item.quantidade <= 0) {
        return res.status(400).json({ msg: "Item inválido no carrinho" });
      }

      const produtoDb = await Produto.findById(item.produto);
      if (!produtoDb) {
        return res
          .status(400)
          .json({ msg: `Produto não encontrado: ${item.produto}` });
      }

      const precoUnitario = Number(produtoDb.preco || 0);
      const quantidade = Number(item.quantidade);
      const subtotal = Number((precoUnitario * quantidade).toFixed(2));

      itensComDetalhes.push({
        produto: produtoDb._id,
        nome: produtoDb.nome || "",
        precoUnitario,
        quantidade,
        subtotal,
      });

      total += subtotal;
    }

    total = Number(total.toFixed(2));

    const venda = await Venda.create({
      itens: itensComDetalhes,
      total,
      formaPagamento: formaPagamento || "dinheiro",
      cliente: cliente || null,
      usuarioEmail: req.user.email,   // 🔥 IMPORTANTE
    });

    return res.status(201).json({ success: true, venda });
  } catch (err) {
    console.error("Erro criarVenda:", err);
    return res.status(500).json({ msg: "Erro ao criar venda" });
  }
};

/**
 * Listar vendas DO USUÁRIO LOGADO
 * GET /vendas
 */
export const listarVendas = async (req, res) => {
  try {
    const vendas = await Venda.find({ usuarioEmail: req.user.email }) // 🔥 FILTRO AQUI
      .sort({ criadoEm: -1 })
      .limit(100);

    return res.json({ success: true, vendas });
  } catch (err) {
    console.error("Erro listarVendas:", err);
    return res.status(500).json({ msg: "Erro ao listar vendas" });
  }
};
