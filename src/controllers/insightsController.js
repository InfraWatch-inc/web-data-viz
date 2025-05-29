var insightsModel = require("../models/insightsModel");

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

    let dataInicial = req.body.dtInicial;
    let dataFinal = req.body.dtFinal;

    insightsModel.postKpisProcessos(idEmpresa, dataInicial, dataFinal)
    .then((resposta) => {
        console.log(resposta);
    })
    .catch((error) => {
        console.log(error);
    })

    insightsModel.postAlertasProcessos(idEmpresa, dataInicial, dataFinal)
    .then((resposta) => {
        console.log(resposta);
    })
    .catch((error) => {
        console.log(error);
    })

    // TODO Organizar query em JSON
    insightsModel.postConsumoProcessos(idEmpresa, dataInicial, dataFinal)
    .then((resposta) => {
        console.log(resposta);
    })
    .catch((error) => {
        console.log(error);
    })
}

module.exports = {
    getAlertasComponentes,
    // postInsightsComponente,
    arrumarCondicao,
    arrumarContexto,
    postDadosProcessos
}