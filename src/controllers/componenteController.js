const componenteModel = require("../models/componenteModel");

async function cadastrarCaptura(req, res) {
  try {
    const idServidor = req.params.idServidor;
    const dados = req.body; 

    if (!Array.isArray(dados) || dados.length === 0) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    const componentes = dados[0].componentes;

    // Itera os componentes e insere cada um
    for (const comp of componentes) {
      await componenteModel.postComponente(
        idServidor,
        comp.componente,
        comp.marca,
        comp.numeracao,
        comp.modelo
      );
    }

    return res.status(200).json({ message: "Componentes cadastrados com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao cadastrar componentes" });
  }
}

async function cadastrarConfiguracaoMonitoramento(req, res) {
    const configuracoes = req.body;

    if (!Array.isArray(configuracoes) || configuracoes.length === 0) {
        return res.status(400).send("Nenhuma configuração de monitoramento fornecida!");
    }

    try {
        for (const config of configuracoes) {
            const { unidadeMedida, descricao, fkComponente, limiteAtencao, limiteCritico, funcaoPython } = config;

            if (unidadeMedida === undefined) {
                return res.status(400).send(`A unidade de medida está undefined para a configuração: ${JSON.stringify(config)}`);
            } else if (descricao === undefined) {
                return res.status(400).send(`A descrição está undefined para a configuração: ${JSON.stringify(config)}`);
            } else if (fkComponente === undefined) {
                return res.status(400).send(`O ID do componente está undefined para a configuração: ${JSON.stringify(config)}`);
            } else if (limiteAtencao === undefined) {
                return res.status(400).send(`O limite de atenção está undefined para a configuração: ${JSON.stringify(config)}`);
            } else if (limiteCritico === undefined) {
                return res.status(400).send(`O limite crítico está undefined para a configuração: ${JSON.stringify(config)}`);
            } else if (funcaoPython === undefined) {
                return res.status(400).send(`A função Python está undefined para a configuração: ${JSON.stringify(config)}`);
            }

            // Chama o model passando os valores como parâmetros
            const resultado = await componenteModel.postConfiguracaoMonitoramento(
                unidadeMedida,
                descricao,
                fkComponente,
                limiteAtencao,
                limiteCritico,
                funcaoPython
            );

            if (resultado && resultado.error) {
                console.error('Erro ao cadastrar configuração:', resultado.error);
                return res.status(500).send(`Erro ao cadastrar configuração: ${resultado.error}`);
            }
        }

        res.status(201).json({ message: 'Configurações de monitoramento salvas com sucesso.' });

    } catch (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage || erro.message);
    }
}

module.exports = {
  cadastrarCaptura,
  cadastrarConfiguracaoMonitoramento
};
