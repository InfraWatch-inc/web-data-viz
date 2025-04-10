var insightsModel = require("../models/insightsModel");

function arrumarCondicao(corpoRequisicao, componente){
    condicao = '';
    
    print(corpoRequisicao);
  
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

function arrumarContexto(){
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

function postInsightsComponente(req, res){
    if(req.body.idEmpresa == undefined || req.body.componente == undefined ){
        return res.status(400).json({"message":"idEmpresa ou Componente indefinido!"});
    }

    let condicao = arrumarCondicao(req.body, req.params.componente);
    let contexto = arrumarContexto(req.body);

    let resposta = {
        "processos":null,
        "kpi":null,
        "grafico":null
    }

    Promise.all(insightsModel.graficoAlertas(contexto, condicao), insightsModel.processosInsights(condicao), insightsModel.kpiInsights(condicao))
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
    getAlertasComponentes,
    postInsightsComponente
}