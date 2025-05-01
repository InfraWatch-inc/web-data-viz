var database = require("../database/config");

function getServidor(uuid){
    var instrucaoSql = `
    SELECT * FROM viewGetServidor where uuidPlacaMae = "${uuid}";`;

    return database.executar(instrucaoSql);
}

function cadastrarAlerta(fkConfiguracaoMonitoramento, nivel, dataHora, valor){

    var instrucaoSql =`
    INSERT INTO Alerta(fkConfiguracaoMonitoramento, nivel, dataHora, valor) VALUES (${fkConfiguracaoMonitoramento}, ${nivel}, '${dataHora}', ${valor});
    `;

    return database.executar(instrucaoSql);
}

function cadastrarProcesso(nome, usoCpu, usoGpu, usoRam, fkServidor, dataHora){
    var instrucaoSql = `
    INSERT INTO Processo(nomeProcesso, usoCpu, usoGpu, usoRam, fkServidor, dataHora) VALUES ('${nome}', ${usoCpu}, ${usoGpu}, ${usoRam}, ${fkServidor}, '${dataHora}');`;

    return database.executar(instrucaoSql);
}

module.exports = {
    getServidor,
    cadastrarAlerta,
    cadastrarProcesso
}