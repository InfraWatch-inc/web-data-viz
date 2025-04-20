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

async function postServidor(req, res) {
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

    try{
        const endereco = await enderecoModel.postEndereco(cep, logradouro, numero, bairro, cidade, estado, pais, complemento);
        const idEndereco = endereco.insertId;

        const servidor = await servidoresModel.postServidor(idEmpresa, tagName, tipo, uuid, idInstancia, so, idEndereco);
        const idServidor = servidor.insertId;

        for (const componente of componentes) {
            const { nome, marca, numeracao, modelo, configuracoes } = componente;

            const comp = await componenteModel.postComponente(idServidor, nome, marca, numeracao, modelo);
            const idComponente = comp.insertId;

            for (const config of configuracoes) {
                const { unidadeMedida, descricao, limiteAtencao, limiteCritico, funcaoPython } = config;

                await configuracaoMonitoramentoModel.postConfiguracao(
                    idComponente, unidadeMedida, descricao, limiteAtencao, limiteCritico, funcaoPython
                );
            }
        }

        return res.status(200).json("Servidor cadastrado com sucesso!");
    } catch (err) {
        console.error("Erro ao cadastrar servidor:", err);
        return res.status(500).json(err.sqlMessage || err.message);
    }
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

async function putServidor(req, res){
    let campos = ["tagNameServer", "tipoServer", "uuidServer", "idInstanciaServer", "soServer", "componentesServer"];
    if(!validarCampos(res, req.body, campos)){
        return;
    }

    let idServidor = req.params.id;
    let tagName = req.body.tagNameServer;
    let tipo = req.body.tipoServer;
    let uuid = req.body.uuidServer;
    let idInstancia = req.body.idInstanciaServer;
    let so = req.body.soServer;
    
    let componentes = req.body.componentesServer;

    try{
        await servidoresModel.putServidor(idServidor, tagName, tipo, uuid, idInstancia, so);
        console.log("Servidor atualizado com sucesso!");

        let componentesExistentes = await componenteModel.getComponentesServidor(idServidor);
        let idComponentesExistentes = componentesExistentes.map(c => c.idComponente);

        for (const componente of componentes) {
            const { idComponente, nome, marca, numeracao, modelo, configuracoes } = componente;

            if (!idComponentesExistentes.includes(idComponente)) {
                const novoComp = await componenteModel.postComponente(idServidor, nome, marca, numeracao, modelo);
                const idNovoComponente = novoComp.insertId;
                console.log("Componente criado:", idNovoComponente);

                for (const config of configuracoes) {
                    const { unidadeMedida, descricao, limiteAtencao, limiteCritico, funcaoPython } = config;
                    await configuracaoMonitoramentoModel.postConfiguracao(
                        idNovoComponente, unidadeMedida, descricao, limiteAtencao, limiteCritico, funcaoPython
                    );
                    console.log("Configuração criada");
                }
            } else {
                await componenteModel.putComponente(idComponente, nome, marca, numeracao, modelo);
                console.log("Componente atualizado:", idComponente);

                for (const config of configuracoes) {
                    const { idConfiguracao, unidadeMedida, descricao, limiteAtencao, limiteCritico, funcaoPython } = config;
                    await configuracaoMonitoramentoModel.putConfiguracao(
                        idConfiguracao, unidadeMedida, descricao, limiteAtencao, limiteCritico, funcaoPython
                    );
                    console.log("Configuração atualizada:", idConfiguracao);
                }
            }
        }

        return res.status(200).json("Servidor e componentes atualizados com sucesso!");

    } catch (err) {
        console.error("Erro ao atualizar servidor:", err);
        return res.status(500).json(err.sqlMessage || err.message);
    }
}

async function deleteServidor(req, res){
    let idServidor = req.params.id;

    try {
        const componentes = await componenteModel.getComponentesServidor(idServidor);

        for (const componente of componentes) {
            const idComponente = componente.idComponente;

            const configuracoes = await configuracaoMonitoramentoModel.getConfiguracoesComponente(idComponente);
            for (const config of configuracoes) {
                await configuracaoMonitoramentoModel.deleteConfiguracao(config.idConfiguracaoMonitoramento);
                console.log(`Configuração ${config.idConfiguracaoMonitoramento} deletada com sucesso!`);
            }

            await componenteModel.deleteComponente(idComponente);
            console.log(`Componente ${idComponente} deletado com sucesso!`);
        }

        await servidoresModel.deleteServidor(idServidor);
        console.log(`Servidor ${idServidor} deletado com sucesso!`);
        res.status(200).json("Servidor deletado com sucesso!");

    } catch (err) {
        res.status(500).json(err.sqlMessage || err.message);
    }
}

module.exports = {
    getServidores,
    getServidor,
    postServidor,
    putServidor,
    deleteServidor
};