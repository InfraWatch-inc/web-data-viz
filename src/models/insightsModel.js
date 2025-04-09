var database = require("../database/config");

function kpiInsights(condicao) {
    var instrucaoSql = `SELECT * FROM viewKpiInsights WHERE ${condicao};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function graficoAlertas(condicao){
    var instrucaoSql = `SELECT * FROM viewAlertasPorContexto WHERE ${condicao};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function processosInsights(condicao){
    var instrucaoSql = `SELECT * FROM viewAlertasPorContexto WHERE idEmpresa = ${idEmpresa};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function alertasComponentes(idEmpresa){
    // TODO
    var instrucaoSql = `SELECT * FROM viewPrimeiroInsights WHERE ${condicao};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    kpiInsights,
    graficoAlertas,
    processosInsights,
    alertasComponentes
}
