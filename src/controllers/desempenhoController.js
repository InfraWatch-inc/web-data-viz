let chamadosRecebidos = []
let chamadosResolvidos = [];

async function receberChamado(req, res) {
    const dados = req.body;

    if (!dados || Object.keys(dados).length === 0) {
        return res.status(400).json({ erro: "Nenhum dado recebido" });
        }

    console.log("JSON recebido do Python:", dados);

    try {
        chamadosRecebidos.push(dados);
        console.log("cu")

        return res.status(200).json({ mensagem: "Chamado recebido com sucesso" });
    } catch (erro) {
        console.error("Erro ao processar dados:", erro);
       return res.status(500).json({ erro: "Erro interno ao processar chamado" });
    }
}

async function receberConcluidos(req, res) {
    const dados = req.body;

    // Correção: length estava escrito errado
    if (!dados || Object.keys(dados).length === 0) {
        return res.status(400).json({ erro: "Nenhum dado concluído recebido" });
    }

    console.log("Concluídos Recebidos: ", dados);

    try {
        // Validar se os dados têm a estrutura esperada
        if (Array.isArray(dados)) {
            // Se Python enviar como lista [criticos, moderados]
            if (dados.length !== 2 || typeof dados[0] !== 'number' || typeof dados[1] !== 'number') {
                return res.status(400).json({ 
                    erro: "Formato inválido. Esperado: [criticos, moderados]" 
                });
            }

            
            const dadosFormatados = {
                criticos: dados[0],
                moderados: dados[1],
                timestamp: new Date().toISOString()
            };
            
            chamadosResolvidos.push(dadosFormatados);
            
        } else if (typeof dados === 'object') {
            // Se Python enviar como objeto {criticos: X, moderados: Y}
            // if (typeof dados.criticos !== 'number' || typeof dados.moderados !== 'number') {
            //     return res.status(400).json({ 
            //         erro: "Campos 'criticos' e 'moderados' devem ser números" 
            //     });
            // }
            
            const dadosFormatados = {
                ...dados,
                timestamp: new Date().toISOString()
            };
            
            chamadosResolvidos.push(dadosFormatados);
            
        } else {
            return res.status(400).json({ 
                erro: "Formato de dados inválido" 
            });
        }

        return res.status(200).json({ 
            mensagem: "Dados recebidos com sucesso",
            total_armazenado: chamadosResolvidos.length
        });
        
    } catch (erro) {
        console.error("Erro ao processar dados:", erro);
        return res.status(500).json({ 
            erro: "Erro interno ao processar chamados" 
        });
    }
}

async function buscarDadosPython(req, res) {
    res.status(200).json({
        recebidos: chamadosRecebidos.length,
        resolvidos: chamadosResolvidos.length,
      criticosResolvido: chamadosResolvidos.filter(chamado => chamado.tipo_alerta === "Critico").length,
        moderadosResolvidos: chamadosResolvidos.filter(chamado => chamado.tipo_alerta === "Moderado").length,

    })
}


async function pegarChamado(req, res) {
    try {
        res.status(200).json(chamadosRecebidos);
        console.log("dados control:", chamadosRecebidos);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao listar chamados" });
    }
}

// RESOLVIDOS

// async function receberChamadosResolvidos(req,res){
//     const resolvidos = req.body;

//     if(!resolvidos && Object.keys(resolvidos).length === 0){
//         return res.status(400).json({ erro: "Nenhum dado recebido" });
//     }

//     console.log("JSON recebido do Python:", resolvidos);

//     try {
//         chamadosResolvidos.push(resolvidos);

//         return res.status(200).json({ mensagem: "Chamado recebido com sucesso" });
//     } catch (erro) {
//         console.error("Erro ao processar dados:", erro);
//        return res.status(500).json({ erro: "Erro interno ao processar chamado" });
//     }
// }

module.exports = {
    pegarChamado,
    receberChamado,
    receberConcluidos,
    buscarDadosPython
}