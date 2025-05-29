var insightsModel = require("../models/insightsModel");
// TODO
function arrumarCondicao(corpoRequisicao, componente){
    condicao = '';
  
    condicao += `idEmpresa = ${corpoRequisicao.idEmpresa} `;
    condicao += `AND componente = '${componente}' `;

    if(corpoRequisicao.nivelAlerta != 3){
        condicao += `AND a.nivel = ${corpoRequisicao.nivelAlerta} `;
    }
    
    if(corpoRequisicao.metrica != undefined){
        condicao += `AND metrica = '${corpoRequisicao.metrica}' `;
    } 

    if(corpoRequisicao.dtInicio != undefined){
        condicao += `AND dataHora >= '${corpoRequisicao.dtInicio}' `
    } 

    if(corpoRequisicao.dtFinal != undefined){
        condicao += `AND dataHora < '${corpoRequisicao.dtInicio}' `;
    }

    return condicao;
}

function arrumarContexto(corpoRequisicao, componente){
    contexto = '';
    if(corpoRequisicao.modelo != undefined){
        contexto =  `${corpoRequisicao.modelo}`
    }

    if(corpoRequisicao.localizacao != undefined){
        contexto +=  `${corpoRequisicao.localizacao}`
    }

    if(corpoRequisicao.fatorTemporal != undefined){
        contexto =  `${corpoRequisicao.fatorTemporal}`
    }

    return contexto;
}

function getAlertasComponentes(req, res) {

    insightsModel.alertasComponentes()
    .then(function (resultado) {
        res.status(200).json(resultado) 
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar os insightss: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function postDadosProcessos(req, res){
    // TODO 
    let idEmpresa = req.params.idEmpresa;

    insightsModel.postDadosProcessos()
    .then()
    .catch()

    console.log(req.body);
}

module.exports = {
    getAlertasComponentes,
    postInsightsComponente,
    postDadosProcessos
}