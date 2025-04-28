var monitoramentoModel = require("../models/monitoramentoModel");

monitoramento = {
  1:[],
};
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
      {
          dadoCaptura: undefined,
          componente: undefined,
          metrica: undefined,
          unidade: undefined
      },
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
    } else {

      if(dados.idServidor == undefined){
        res.status(400).json({ "mensagem": "idServidor indefinido" })
      }

      dadosServidor = monitoramento[dados.idServidor]

      return res.status(200).json(dadosServidor)
    }
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
      nivel: undefined,
      processos: []
    }
    */

    const dados = req.body;
    const processos = dados.processos;


    monitoramentoModel.cadastrarAlerta(dados.fkConfiguracaoMonitoramento, dados.dataHora, dados.dadoCaptura).then((resultado) => {
      res.status(200).json(resultado);
    });

    processos.forEach((processo) => {
      monitoramentoModel.cadastrarProcesso(dados.fkConfiguracaoMonitoramento, dados.dataHora, processo).then((resultado) => {
        res.status(200).json(resultado);
      });
    });
  }
  module.exports = {
    buscarDados,
    cadastrarCaptura,
    cadastrarAlerta
  };