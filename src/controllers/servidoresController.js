let servidoresModel = require("../models/servidoresModel");
let enderecoModel = require("../models/enderecoModel"); // TODO
let componenteModel = require("../models/componenteModel"); // TODO
let configuracaoMonitoramentoModel = require("../models/configuracaoMonitoramentoModel"); // TODO

function postServidor(req, res) {
    // TODO coletar todas as informações enviadas do servidor para cadastrar ele
    // ver se existe info de endereco para cadastrar - enderecoModel
    // cadastrar servidor - servidor Model
    // cadastrar componentes - componenteModel
    // cadastrar configuracao monitoramento - configuracaoMonitoramentoModel
}

function getServidores(req , res){
    servidoresModel.getServidores()
    .then((resultado) => {
        res.status(200).json(resultado);
    })
    .catch((erro) => {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    })
}

function getServidor(req, res){
    servidoresModel.getServidor(req.params.id)
    .then((resultado) => {
        res.status(200).json(resultado);
    })
    .catch((erro) => {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    })
}

function putServidor(req, res){
    // TODO coletar todas as informações enviadas do servidor para atualizar ele
    // ver se existe info de endereco para cadastrar - enderecoModel
    // cadastrar servidor - servidor Model
    // cadastrar componentes - componenteModel, verificar se já existe o componente ou tem que inserir mais um
    // cadastrar configuracao monitoramento - configuracaoMonitoramentoModel
}

function deleteServidor (req, res){
    // TODO 
    // coletar informacoes de tudo ligado ao servidor
    // deletar configuracao monitoramento
    // deletar componentes
    // deletar servidor
}

module.exports = {
    getServidores,
    getServidor,
    postServidor,
    putServidor,
    deleteServidor
};