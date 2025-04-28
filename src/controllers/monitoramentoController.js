var monitoramentoModel = require("../models/monitoramentoModel");

monitoramento = {
  1:[],
};
function getCapturas(req, res) {
  const idServidor = req.params.idServidor

  if (idServidor == undefined) {
    return res.status(400).json({ "mensagem": "idServidor indefinido" })
  }

  if (monitoramento[idServidor] == undefined) {
    return res.status(404).json({ "mensagem": "Dados do idServidor não encontrado" })
  }

  dadosServidor = monitoramento[dados.idServidor]

  return res.status(200).json(dadosServidor)
}

function buscarDados(req, res) {

  const uuid = req.params.uuid

  if(uuid == undefined){
    console.log("uuid indefinido")
  }
  monitoramentoModel.getServidor(uuid).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function cadastrarCaptura(req, res) {
  /*
  {
    dadosCaptura:
    [
      {
          dadoCaptura: undefined,
          componente: undefined,
          metrica: undefined,
          unidade: undefined
      },
    ],
    dataHora: undefined,
    idServidor: undefined,
    processos: []
  }
  */
  const dados = req.body

  if(dados.dadosCaptura != undefined){
    if(monitoramento[dados.idServidor] == undefined){
      monitoramento[dados.idServidor] = []
    }

    if(monitoramento[dados.idServidor].length == 100){
      monitoramento[dados.idServidor].shift()
    }
    monitoramento[dados.idServidor].push(dados)

    return res.status(200).json(monitoramento[dados.idServidor])
  }

  return res.status(400).json({ "mensagem": "Dados da captura não encontrados" })
}

function cadastrarAlerta(req, res) {
  if (!req.body) {
    return res.status(400).json({ "mensagem": 'Dados do alerta são obrigatórios' });
  }

  /*
  {
    dadoCaptura: undefined,
    dataHora: undefined,
    fkConfiguracaoMonitoramento: undefined,
    nivel: undefined
  }
  */

  const dados = req.body;
  const processos = dados.processos;


  monitoramentoModel.cadastrarAlerta(dados.fkConfiguracaoMonitoramento, dados.dataHora, dados.dadoCaptura).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function cadastrarProcessos(req, res) {
  if (!req.body) {
    return res.status(400).json({ "mensagem": 'Dados do processo são obrigatórios' });
  }
  
  /*
  {
    idServidor: undefined,
    fkConfiguracaoMonitoramento: undefined,
    dataHora: undefined,
    processos: []
  }
  */
 let idServidor = req.body.idServidor;

  processos.forEach((processo) => {
    monitoramentoModel.cadastrarProcesso(processo.nome, processo.usoCpu, processo.usoGpu, processo.usoRam, idServidor).then((resultado) => {
      res.status(200).json(resultado);
    });
  }); 
}

module.exports = {
  buscarDados,
  cadastrarCaptura,
  cadastrarAlerta,
  getCapturas,
  cadastrarProcessos
};