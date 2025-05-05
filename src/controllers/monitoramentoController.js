var monitoramentoModel = require("../models/monitoramentoModel");

monitoramento = {
  1:[],
};
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

  monitoramentoModel.cadastrarAlerta(dados.fkConfiguracaoMonitoramento, dados.nivel, dados.dataHora, dados.dadoCaptura).then((resultado) => {
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
    dataHora: undefined,
    processos: []
  }
  */
  let idServidor = req.body.idServidor;
  let processos = req.body.processos;
  let dataHora = req.body.dataHora;

  console.log("processos", processos);

  processos.forEach((processo) => {
    monitoramentoModel.cadastrarProcesso(processo.nome, processo["uso_cpu"], processo["uso_gpu"], processo["uso_ram"], idServidor, dataHora).then(() => {});
  });

  res.status(200).json({ "mensagem": "Processos cadastrados com sucesso" });
}

module.exports = {
  buscarDados,
  cadastrarCaptura,
  cadastrarAlerta,
  getCapturas,
  cadastrarProcessos,
  monitoramento
};