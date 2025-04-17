let servidoresModel = require("../models/servidoresModel");
let enderecoModel = require("../models/enderecoModel"); // TODO
let componenteModel = require("../models/componenteModel"); // TODO
let configuracaoMonitoramentoModel = require("../models/configuracaoMonitoramentoModel"); // TODO

function validarCampos(res, corpoReq) {
    let isValido = true;
    let campos = [];// TODO

    campos.forEach((campo) => {
        if (corpoReq[campo] == undefined) { 
            isValido = false;
            return res.status(400).send(`Campo ${campo} está undefined!`); 
        }
    });

    return isValido;
}

function postServidor(req, res) {
    if(!validarCampos(req.body)){
        return;
    }

    let cep = req.body.cepServer;
    let logradouro = req.body.logradouroServer;
    let numero = req.body.numeroServer;
    let bairro = req.body.bairroServer; 
    let cidade = req.body.cidadeServer; 
    let estado = req.body.estadoServer; 
    let pais = req.body.paisServer;
    let complemento = req.body.complementoServer;

    let idEmpresa = req.body.idEmpresaServer;
    let tagName = req.body.tagNameServer;
    let tipo = req.body.tipoServer;
    let uuid = req.body.uuidServer;
    let idInstancia = req.body.idInstanciaServer;
    let so = req.body.soServer;

    // [
    //  {
    //   componente:'CPU',
    //   marca:'Intel'
    //   numeracao:1
    //   modelo:'Xeon 123'
    //   configuracao
    //  }
    // ]

    // rodar loop para ir cadastrando os componentes 
    let componentes 

    // ver se existe info de endereco para cadastrar - enderecoModel
    let idEndereco = enderecoModel.postEndereco(cep,logradouro,numero,bairro,cidade,estado,pais,complemento)
    .then(() => {
            let idServidor = servidoresModel.postServidor(idEmpresa, tagName, tipo, uuid, idInstancia, so, idEndereco)
            .then(() => {
                componentes.forEach((componente) => {
                    let nome = componente.nome;
                    let marca = componente.marca;                    
                    let numeracao = componente.numeracao;
                    let modelo = componente.modelo;
                    let configuracoes = componente.configuracoes;

                    let idComponente = componenteModel.postComponente(idServidor, nome, marca, numeracao, modelo)
                    .then(() => {
                        console.log("Componente cadastrada com sucesso!")
                    })
                    .catch((err) => {
                        res.status(500).json(err.sqlMessage) 
                    })

                    configuracoes.forEach((config) => {
                        let unidadeMedida = config.unidadeMedida;
                        let descricao = config.descricao;
                        let limiteAtencao = config.limiteAtencao; 
                        let limiteCritico = config.limiteCritico;  
                        let funcaoPython = config.funcaoPython;
                        
                        configuracaoMonitoramentoModel.postConfiguracao(idComponente, unidadeMedida, descricao, limiteAtencao, limiteCritico, funcaoPython)
                        .then(() => {
                            console.log("Configuração cadastrada com sucesso!")
                        })
                        .catch((err) => {
                            res.status(500).json(err.sqlMessage)
                        })
                    })                    
                });
            })
            .catch((err) => {
                res.status(500).json(err.sqlMessage)
            })
            
            res.status(200).json("Servidor cadastrado com sucesso!")
    })
    .catch((err) => {
        res.status(500).json(err.sqlMessage)
    })

}

function getServidores(req , res){
    let idEmpresa = req.params.idEmpresa;
    servidoresModel.getServidores(idEmpresa)
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