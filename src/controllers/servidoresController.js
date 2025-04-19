let servidoresModel = require("../models/servidoresModel");
let enderecoModel = require("../models/enderecoModel");
let componenteModel = require("../models/componenteModel");
let configuracaoMonitoramentoModel = require("../models/configuracaoMonitoramentoModel");

function validarCampos(res, corpoReq, campos) {
    let isValido = true;

    campos.forEach((campo) => {
        if (corpoReq[campo] == undefined) { 
            isValido = false;
            return res.status(400).send(`Campo ${campo} está undefined!`); 
        }
    });

    return isValido;
}

function postServidor(req, res) {
    let campos = ["cepServer", "logradouroServer", "numeroServer", "bairroServer", "cidadeServer", "estadoServer", "paisServer", "complementoServer",
        "idEmpresaServer", "tagNameServer", "tipoServer", "uuidServer", "idInstanciaServer", "soServer", "componentesServer"];
    if(!validarCampos(res, req.body, campos)){
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
    
    let componentes = req.body.componentesServer; 

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
    let campos = ["idServidor","tagName", "tipo", "uuid", "idInstancia", "so", "componentes"];
    if(!validarCampos(res, req.body, campos)){
        return;
    }

    let idEmpresa = req.body.idEmpresaServer;
    let tagName = req.body.tagNameServer;
    let tipo = req.body.tipoServer;
    let uuid = req.body.uuidServer;
    let idInstancia = req.body.idInstanciaServer;
    let so = req.body.soServer;
    
    let componentes = req.body.componentesServer;

    servidoresModel.putServidor(idServidor, idEmpresa, tagName, tipo, uuid, idInstancia, so)
    .then(() => {
        console.log("Servidor atualizado com sucesso!")
    })
    .catch((err) => {  
        res.status(500).json(err.sqlMessage) 
    })
    
    componenteModel.getComponentesServidor(idServidor)
    .then((resultado) => {
        resultado.json((resultado) => {  
            let idComponentes = resultado.map((componente) => { 
                return componente.idComponente;
            })

            componentes.forEach((componente) => {
                let nome = componente.nome;
                let marca = componente.marca;                    
                let numeracao = componente.numeracao;
                let modelo = componente.modelo;
                let configuracoes = componente.configuracoes;
                
                if(!idComponentes.includes(componente.idComponente)){
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
                } else{
                    componenteModel.putComponente(componente.idComponente, nome, marca, numeracao, modelo)
                    .then(() => {
                        console.log("Componente atualizado com sucesso!")
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
                        
                        configuracaoMonitoramentoModel.putConfiguracao(config.idConfiguracao, unidadeMedida, descricao, limiteAtencao, limiteCritico, funcaoPython)
                        .then(() => {
                            console.log("Configuração atualizada com sucesso!")
                        })
                        .catch((err) => {
                            res.status(500).json(err.sqlMessage)
                        })
                    })
                }
            })
        })
    })
    .catch((err) => {
        res.status(500).json(err.sqlMessage) 
    })
}

function deleteServidor(req, res){
    let idServidor = req.params.idServidor;

    let idComponentes = null;
    let idConfiguracoes = null;

    componenteModel.getComponentesServidor(idServidor)
    .then((resultado) => {
        resultado.json((resultado) => {  
            idComponentes = resultado.map((componente) => { 
                return componente.idComponente;
            })

            // buscar configuracoes componentes 
            idComponentes.forEach((idComponente) => {
                configuracaoMonitoramentoModel.getConfiguracoesComponente(idComponente)
                .then((resultado) => {
                    resultado.json((resultado) => {
                        idConfiguracoes = resultado.map((config) => { 
                            return config.idConfiguracaoMonitoramento;
                        });
                    })
                    .catch((err) => {
                        res.status(500).json(err.sqlMessage)
                    })
                })
                .catch((err) => {
                    res.status(500).json(err.sqlMessage)
                })
            })
        })
    })
    .catch((err) => {
        res.status(500).json(err.sqlMessage)
    })

    idConfiguracoes.forEach((idConfiguracao) => {
        configuracaoMonitoramentoModel.deleteConfiguracao(idConfiguracao)
        .then(() => {
            console.log("Configuração deletada com sucesso!")
        })
        .catch((err) => {
            res.status(500).json(err.sqlMessage)
        })
    })

    idComponentes.forEach((idComponente) => {
        componenteModel.deleteComponente(idComponente)
        .then(() => {
            console.log("Componente deletada com sucesso!")
        })
        .catch((err) => {
            res.status(500).json(err.sqlMessage)
        })
    })

    servidoresModel.deleteServidor(idServidor)
    .then(() => {
        res.status(200).json("Servidor deletado com sucesso!");
    })
    .catch((err) => {
        res.status(500).json(err.sqlMessage);
    })
}

module.exports = {
    getServidores,
    getServidor,
    postServidor,
    putServidor,
    deleteServidor
};