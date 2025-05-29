let chamadosRecebidos = []

async function receberChamado(req, res) {
    const dados = req.body;

    if (!dados || Object.keys(dados).length === 0) {
        return res.status(400).json({ erro: "Nenhum dado recebido" });
    }

    console.log("JSON recebido do Python:", dados);

    try {
        chamadosRecebidos.push(dados);

        res.status(200).json({ mensagem: "Chamado recebido com sucesso" });
    } catch (erro) {
        console.error("Erro ao processar dados:", erro);
        res.status(500).json({ erro: "Erro interno ao processar chamado" });
    }
}

// Rota para o front pegar os chamados
async function pegarChamado(req, res) {
    try {
        res.status(200).json(chamadosRecebidos);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao listar chamados" });
    }
}




module.exports = {
    pegarChamado,
    receberChamado
}