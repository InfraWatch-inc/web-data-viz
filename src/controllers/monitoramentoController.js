var monitoramentoModel = require("../models/monitoramentoModel");

function buscarDadosTempoReal(req, res) {
    const idServidor = req.params.idServidor;
    
    if (!idServidor) {
      return res.status(400).json({ erro: 'ID do servidor é obrigatório' });
    }
  
    monitoramentoModel.tempoReal(idServidor)
      .then(dadosTempoReal => {
        if (dadosTempoReal.length === 0) {
          return res.status(404).json({ erro: 'Dados não encontrados para este servidor' });
        }
  
        const dados = dadosTempoReal[0];
        
        // Converte strings JSON em objetos.
        if (typeof dados.processosMonitorados === 'string') {
          dados.processosMonitorados = JSON.parse(dados.processosMonitorados);
        }
        
        if (typeof dados.dadosGraficosLinhas === 'string') {
          dados.dadosGraficosLinhas = JSON.parse(dados.dadosGraficosLinhas);
        }
  
        return res.status(200).json(dados);
      })
      .catch(erro => {
        console.error(`Erro no controller de tempo real: ${erro.message}`);
        return res.status(500).json({ erro: 'Erro interno do servidor' });
      });
  }
  
  module.exports = {
    buscarDadosTempoReal
  };