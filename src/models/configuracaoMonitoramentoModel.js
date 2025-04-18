var database = require("../database/config")

function getConfiguracoes(){ // TODO
    var instrucaoSql = ``;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getConfiguracoesServidor(idServidor){ // TODO
    var instrucaoSql = ``;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function postConfiguracao(idComponente, unidadeMedida, descricao, limiteAtencao, limiteCritico, funcaoPython){ // TODO
    var instrucaoSql = `INSERT INTO ConfiguracaoMonitoramento (unidadeMedida, descricao, fkComponente, limiteAtencao, limiteCritico, funcaoPython) VALUES ('${unidadeMedida}', '${descricao}', ${idComponente}, ${limiteAtencao}, ${limiteCritico}, '${funcaoPython})');`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function putConfiguracao(){ // TODO
    var instrucaoSql = ``;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deleteConfiguracao(idConfiguracao){ // TODO
    var instrucaoSql = `DELETE FROM ConfiguracaoMonitoramento WHERE idConfiguracaoMonitoramento = ${idConfiguracao};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getConfiguracoesComponente(idComponente){ // TODO
    var instrucaoSql = `SELECT idConfiguracaoMonitoramento FROM ConfiguracaoMonitoramento WHERE fkComponente = ${idComponente};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    getConfiguracoes,
    getConfiguracoesServidor,
    postConfiguracao,
    putConfiguracao,
    deleteConfiguracao,
    getConfiguracoesComponente
};