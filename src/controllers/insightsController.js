var insightsModel = require("../models/insightsModel");

function arrumarCondicao(corpoRequisicao, componente=undefined){
    
    //{
    //    idEmpresa:idEmpresa,
    //    dtInicio:dtInicio,
    //    dtFinal:dtFinal,
    //    modelo: modelo
    //    
    //} 
    
    // TODO preparar todos os filtros para colocar na condição WHERE do model
    // olhar figma para saber todos os filtros
    condicao = ''
    corpoRequisicao.forEach((elemento) =>{
        print(elemento);
    });

    if(componente != undefined){
        
    }

    return condicao;
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

function postInsightsComponente(req, res){
    let condicao = arrumarCondicao(req.body, req.params.componente);

    let resposta = {
        "processos":null,
        "kpi":null,
        "grafico":null
    }

    Promise.all(insightsModel.graficoAlertas(condicao), insightsModel.processosInsights(condicao), insightsModel.kpiInsights(condicao))
    .then(function (resultado) {
        print(resultado);
        resposta = resultado;
        res.status(200).json(resposta);
    })
    .catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar os insightss: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
    postAlertasComponentes,
    postInsightsComponente
}