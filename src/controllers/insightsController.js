var insightsModel = require("../models/insightsModel");

async function getAlertasComponentes(req, res) {
    let periodo = req.params.periodo;
    let idEmpresa = req.params.idEmpresa;

    let data = {
        totalAlertasProcessamento:0,
        totalAlertasMemoria: 0,
        componentes:["CPU", "GPU", "RAM", "Disco"],
        dadosCriticos:[0, 0, 0, 0],
        dadosModerados:[0, 0, 0, 0]
    }

    await insightsModel.getAlertasComponentes(periodo, idEmpresa)
    .then((resposta) =>{
        console.log(resposta);
        resposta.forEach((tupla)=>{
            // dados moderados
            data.totalAlertasProcessamento += Number(tupla.qtdCpuModerado);
            data.dadosModerados[0] += Number(tupla.qtdCpuModerado);

            data.totalAlertasProcessamento += Number(tupla.qtdGpuModerado);
            data.dadosModerados[1] += Number(tupla.qtdGpuModerado);

            data.totalAlertasMemoria += Number(tupla.qtdRamModerado);
            data.dadosModerados[2] += Number(tupla.qtdRamModerado);

            data.totalAlertasMemoria += Number(tupla.qtdHdModerado);
            data.dadosModerados[3] += Number(tupla.qtdHdModerado);

            data.totalAlertasMemoria += Number(tupla.qtdSsdModerado);
            data.dadosModerados[3] += Number(tupla.qtdSsdModerado);

            // dados criticos
            data.totalAlertasProcessamento += Number(tupla.qtdCpuCritico);
            data.dadosCriticos[0] += Number(tupla.qtdCpuCritico);

            data.totalAlertasProcessamento += Number(tupla.qtdGpuCritico);
            data.dadosCriticos[1] += Number(tupla.qtdGpuCritico);

            data.totalAlertasMemoria += Number(tupla.qtdRamCritico);
            data.dadosCriticos[2] += Number(tupla.qtdRamCritico);

            data.totalAlertasMemoria += Number(tupla.qtdHdCritico);
            data.dadosCriticos[3] += Number(tupla.qtdHdCritico);

            data.totalAlertasMemoria += Number(tupla.qtdSsdCritico);
            data.dadosCriticos[3] += Number(tupla.qtdSsdCritico);
        })

        return res.status(200).send(data);
    })
    .catch((error)=>{
        res.status(200).send({"message":"Deu erro"})
        return
    })
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
        data.dadosProcessosAlertas = resposta[0][0].dadosProcessosAlertas.sort((a, b) => (b.alertasAtencao + b.alertasCritico) - (a.alertasAtencao + a.alertasCritico)).slice(0,5);
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

        data.dadosProcessosConsumo.cpu.sort((a, b) => (b.manha + b.tarde + b.noite) - (a.manha + a.tarde + a.noite));
        data.dadosProcessosConsumo.gpu.sort((a, b) => (b.manha + b.tarde + b.noite) - (a.manha + a.tarde + a.noite));
        data.dadosProcessosConsumo.ram.sort((a, b) => (b.manha + b.tarde + b.noite) - (a.manha + a.tarde + a.noite));

        data.dadosProcessosConsumo.cpu = data.dadosProcessosConsumo.cpu.slice(0, 5);
        data.dadosProcessosConsumo.gpu = data.dadosProcessosConsumo.gpu.slice(0, 5);
        data.dadosProcessosConsumo.ram = data.dadosProcessosConsumo.ram.slice(0, 5);

    })
    .catch((error) => {
        isError = true;
    })


    if(!isError){
        return res.status(200).json(data);
    }

    return res.status(500).json({"message":"Erro ao consultar dados."});
    
}

module.exports = {
    getAlertasComponentes,
    postDadosProcessos
}   