// const { result } = require("lodash");
var monitoramentoModel = require("../models/monitoramentoModel");

monitoramento = {};

monitoramentoInstancia = [];

const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });

function getCapturas(req, res) {
  const idServidor = req.params.idServidor;

  if (idServidor == undefined) {
    return res.status(400).json({ "mensagem": "idServidor indefinido" });
  }

  if (monitoramento[idServidor] == undefined) {
    return res.status(404).json({ "mensagem": "Dados do idServidor não encontrado" });
  }

  console.log("monitoramento", monitoramento);

  let dadosServidor = monitoramento[`${idServidor}`];

  return res.status(200).json(dadosServidor);
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

function buscarDadosComponente(req, res) {

  const uuid = req.params.uuid

  if(uuid == undefined){
    console.log("uuid indefinido")
  }
  monitoramentoModel.getServidorComponente(uuid).then((resultado) => {
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

  const dados = req.body;

  monitoramentoModel.cadastrarAlerta(dados.fkConfiguracaoMonitoramento, dados.nivel, dados.dataHora, dados.dadoCaptura).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function cadastrarProcessos(req, res) {
  if (!req.body) {
    return res.status(400).json({ "mensagem": 'Dados do processo são obrigatórios' });
  }

  let idServidor = req.body.idServidor;
  let processos = req.body.processos;
  let dataHora = req.body.dataHora;
  let fkAlerta = req.body.idAlerta;

  console.log("processos", processos);

  processos.forEach((processo) => {
    monitoramentoModel.cadastrarProcesso(processo.nome, processo["uso_cpu"], processo["uso_gpu"], processo["uso_ram"], idServidor, dataHora, fkAlerta).then(() => {});
  });

  res.status(200).json({"mensagem": "Processos cadastrados com sucesso" });
}

function listagemServidores(req, res){
  if(!req.params){
    return res.status(400).json("id da empresa indefinido.")
  }

  let idEmpresa = parseInt(req.params.idEmpresa);
  console.log("id controller ", idEmpresa)

  monitoramentoModel.listagemServidores(idEmpresa).then(resultado => {  
    console.log("Resultado da model. ", resultado ? resultado:0, "vazio")
    if(resultado && resultado.length > 0){
      console.log("here")
      res.status(200).json(resultado);
    }else {
      console.log("aqui")
      res.status(404).json([]);
    }
  })
  .catch((erro) => {
    res.status(500).json({ erro: "Erro ao buscar servidores", mensagem: erro.mensagem })
  })  
}

function abrirChamado(req, res){
  if(!req.body){
    return res.status(404).json({"mensagem": "Dados para o chamado não encontrado"})
  }

  const info = req.body;

  monitoramentoModel.abrirChamado(info.idAlerta, info.idServidor,info.nivel, info.dataHora, info.componente, info.metrica, info.valor).then(resultado =>{
    res.status(200).json(resultado);
  })
}

function getTodosServidores(req, res){
  if(Object.keys(monitoramento).length == 0){
    return res.status(404).json({"mensagem": "Nenhum servidor monitorado"})
  }
  return res.status(200).json(monitoramento);

}

function postDadoInstancia(req, res) {
  const dado = req.body;

  if (!dado) {
    return res.status(400).json({ "mensagem": "Dados inválidos" });
  }

  if(monitoramentoInstancia.length == 100){
    monitoramentoInstancia.shift();
  }

  monitoramentoInstancia.push(dado);

  return res.status(200).json({ "mensagem": "Dado de instância cadastrado com sucesso" });
}

function getDadosInstancia(req, res) {
  let isFirstTime = req.params.isPrimeiroConsumo;
  if (monitoramentoInstancia.length == 0) {
    return res.status(404).json({ "mensagem": "Nenhum dado de instância encontrado" });
  }

  if(isFirstTime){
    return res.status(200).json(monitoramentoInstancia);
  }

  let ultimoDado = monitoramentoInstancia[monitoramentoInstancia.length - 1];

  return res.status(200).json(ultimoDado);
  
}

async function getLogs(req, res){
  const lambda = new AWS.Lambda();
  const cloudwatchlogs = new AWS.CloudWatchLogs();

  const blacklist = ["MainMonitoringFunction", "ModLabRole"];
  const keywords = ["ERROR", "Exception", "Traceback"];

  let functions = [];
    let Marker;

    do {
      const response = await lambda.listFunctions({ Marker }).promise();
      functions.push(...response.Functions);
      Marker = response.NextMarker;
    } while (Marker);

  functions = functions.map(f => f.FunctionName).filter(name => !blacklist.includes(name));

  const allErrors = [];

  for (const lambdaName of lambdaNames) {
    const logGroupName = `/aws/lambda/${lambdaName}`;
    const streams = await getLogStreams(logGroupName); // TODO

    for (const streamName of streams) {
      const events = await getErrorEvents(logGroupName, streamName); // TODO
      for (const event of events) {
        allErrors.push({
          function: lambdaName,
          date: new Date(event.timestamp).toISOString(),
          message: event.message.trim()
        });
      }
    }
  }

  if (allErrors.length === 0) {
    console.log("✅ Nenhum erro encontrado nas Lambdas analisadas.");
    // TODO retornar que está tudo bem
  } else {
    // TODO retornar erros encontrados
      console.log("🚨 Erros encontrados:");
      allErrors.forEach(err => {
          console.log(`---`);
          console.log(`📛 Lambda: ${err.function}`);
          console.log(`📅 Data:   ${err.date}`);
          console.log(`📝 Erro:   ${err.message}`);
      });
  }
}

module.exports = {
  buscarDados,
  cadastrarCaptura,
  cadastrarAlerta,
  getCapturas,
  cadastrarProcessos,
  monitoramento,
  listagemServidores,
  abrirChamado,
  buscarDadosComponente,
  getTodosServidores,
  postDadoInstancia,
  getDadosInstancia,
  getLogs
};