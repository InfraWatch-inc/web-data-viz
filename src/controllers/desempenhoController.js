var desempenhoModel = require("../models/desempenhoModel");

function getChamado(req, res) {
    desempenhoModel.getChamado()
        .then(resposta => {
            if (!resposta) {
                return res.status(500).json({ erro: "Erro ao obter chamados do Jira" });
            }
            res.status(200).json(resposta);
        })
        .catch(erro => {
            console.error("Erro no controller getChamado:", erro);
            res.status(500).json({ erro: "Erro interno ao buscar chamados" });
        });
}


module.exports = {
    getChamado
}