import ClienteVenda from "../models/ClienteVenda.js";

export const criarClienteVenda = async (req, res) => {
  try {
    const novoCliente = new ClienteVenda(req.body);
    await novoCliente.save();

    return res.status(201).json({
      message: "Cliente criado com sucesso",
      cliente: novoCliente
    });

  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return res.status(500).json({
      message: "Erro ao criar cliente",
      error: error.message
    });
  }
};
