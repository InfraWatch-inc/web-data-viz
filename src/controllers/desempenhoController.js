var desempenhoModel = require("../models/desempenhoModel");

// function getChamado(req, res) {
//     desempenhoModel.getChamado()
//         .then(resposta => {
//             if (!resposta) {
//                 return res.status(500).json({ erro: "Erro ao obter chamados do Jira" });
//             }
//             res.status(200).json(resposta);
//         })
//         .catch(erro => {
//             console.error("Erro no controller getChamado:", erro);
//             res.status(500).json({ erro: "Erro interno ao buscar chamados" });
//         });
// }

function receberChamado(req, res) {
    const dados = req.body;

    if (!dados || Object.keys(dados).length === 0) {
        return res.status(400).json({ erro: "Nenhum dado recebido" });
    }

    console.log("JSON recebido do Python:", dados);
    
    // Aqui você pode salvar no banco, enviar para outro lugar etc.

    res.status(200).json({ mensagem: "Chamado recebido com sucesso" });
}


module.exports = {
    // getChamado,
    receberChamado
}