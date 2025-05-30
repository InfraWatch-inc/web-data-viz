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

async function postDadosProcessos(req, res){ 
    let data = {
        processoMaisCritico: undefined,
        processoMaisAtencao: undefined,
        componenteMaisConsumido: undefined,
        periodoMaisAtivo:undefined,
        dadosProcessosAlertas: [],
        dadosProcessosConsumo: {
            cpu: [],
            gpu: [],
            ram: []
        }
    };

    let isError = false;
    let idEmpresa = req.params.idEmpresa;
    let dataInicial = req.body.dataInicial;
    let dataFinal = req.body.dataFinal;

    await insightsModel.postKpisProcessos(idEmpresa, dataInicial, dataFinal)
    .then((resposta) => {
        data.processoMaisAtencao = resposta[0][0].processoMaisAtencao;
        data.processoMaisCritico = resposta[0][0].processoMaisCritico;
        data.componenteMaisConsumido = resposta[0][0].componenteMaisConsumido;
        data.periodoMaisAtivo = resposta[0][0].periodoMaisAtivo;
    })
    .catch((error) => {
        isError = true;
    })

    await insightsModel.postAlertasProcessos(idEmpresa, dataInicial, dataFinal)
    .then((resposta) => {
        data.dadosProcessosAlertas = resposta[0][0].dadosProcessosAlertas;
;
    })
    .catch((error) => {
        isError = true
    })

    await insightsModel.postConsumoProcessos(idEmpresa, dataInicial, dataFinal)
    .then((resposta) => {
        const listaConsumo = resposta[0];

        listaConsumo.forEach((info) => {
            data.dadosProcessosConsumo[info.tipo].push(info);
        });

    })
    .catch((error) => {
        isError = true;
    })

    console.log("Dados Enviar:"+ JSON.stringify(data));

    if(!isError){
        return res.status(200).json(data);
    }

    return res.status(200).json({"message":"Erro ao consultar dados."});
    
}

module.exports = {
    getAlertasComponentes,
    postDadosProcessos
}