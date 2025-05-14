const suporteModel = require('../models/suporteModel');

const criarChamado = async (req, res) =>{
    try{ 
        const {assunto, descricao} = req.body;

        if(!assunto || !descricao){
            return req.status(400).json({erro: "Assunto e descrição são obrigatórios"});
        }

        const issueData = await suporteModel.criarIssue(assunto, descricao);

        if(req.file){
            const anexoData = await suporteModel.adicionarAnexo(issueData.id, req.file)
            issueData.anexo = anexoData;
        }

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Chamado criado com sucesso',
            dados: issueData
        });
    }catch (erro){
        console.error("Erro na controller ao criar o chamado: ", erro);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao criar o chamado",
            dados: erro.mensagem
        });
    }
}




module.exports = {
    criarChamado
}