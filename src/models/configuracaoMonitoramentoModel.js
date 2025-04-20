var database = require("../database/config");

function getConfiguracoesServidor(idServidor){
    var instrucaoSql = `SELECT idConfiguracaoMonitoramento FROM ConfiguracaoMonitoramento WHERE fkServidor = ${idServidor};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function postConfiguracao(idComponente, unidadeMedida, descricao, limiteAtencao, limiteCritico, funcaoPython){
    var instrucaoSql = `INSERT INTO ConfiguracaoMonitoramento (unidadeMedida, descricao, fkComponente, limiteAtencao, limiteCritico, funcaoPython) VALUES ('${unidadeMedida}', '${descricao}', ${idComponente}, ${limiteAtencao}, ${limiteCritico}, '${funcaoPython})');`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function putConfiguracao(idConfiguracao, unidadeMedida, descricao, limiteAtencao, limiteCritico, funcaoPython){
    var instrucaoSql = `UPDATE ConfiguracaoMonitoramento SET unidadeMedida = '${unidadeMedida}', descricao = '${descricao}', limiteAtencao = ${limiteAtencao}, limiteCritico = ${limiteCritico}, funcaoPython = '${funcaoPython}' WHERE idConfiguracaoMonitoramento = ${idConfiguracao};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deleteConfiguracao(idConfiguracao){
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
    getConfiguracoesServidor,
    postConfiguracao,
    putConfiguracao,
    deleteConfiguracao,
    getConfiguracoesComponente
};