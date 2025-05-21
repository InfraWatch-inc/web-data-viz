const componenteModel = require("../models/componenteModel");

async function cadastrarCaptura(req, res) {
  try {
    const idServidor = req.params.idServidor;
    const dados = req.body; 

    if (!Array.isArray(dados) || dados.length === 0) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    const componentes = dados[0].componentes;

    // Itera os componentes e insere cada um
    for (const comp of componentes) {
      await componenteModel.postComponente(
        idServidor,
        comp.componente,
        comp.marca,
        comp.numeracao,
        comp.modelo
      );
    }

    return res.status(200).json({ message: "Componentes cadastrados com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao cadastrar componentes" });
  }
}

module.exports = {
  cadastrarCaptura
};
