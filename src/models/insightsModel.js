var database = require("../database/config");

function kpiInsights(condicao) {
    var instrucaoSql = `SELECT * FROM viewKpiInsights WHERE ${condicao};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function graficoAlertas(contexto ,condicao){
    var instrucaoSql = `SELECT ${contexto}, qtdAlertas FROM viewAlertasPorContexto WHERE ${condicao};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function processosInsights(condicao){
    var instrucaoSql = `SELECT * FROM viewInsightsProcessos WHERE ${condicao};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getAlertasComponentes(periodo, idEmpresa){
    const QUERY = `SELECT * FROM viewPrimeiroInsights WHERE dataHora > DATE_SUB(NOW(), INTERVAL ${periodo}) AND idEmpresa = ${idEmpresa};`;
    return database.executar(QUERY);
}

function postKpisProcessos(idEmpresa, dtInicial, dtFinal){
    const QUERY = `CALL prDashboardKPIs('${dtInicial}', '${dtFinal}', ${idEmpresa});`;
    return database.executar(QUERY);
}

function postAlertasProcessos(idEmpresa, dtInicial, dtFinal){
    const QUERY = `CALL prDashboardAlertasJSON('${dtInicial}', '${dtFinal}', ${idEmpresa});`;
    return database.executar(QUERY);
}

function postConsumoProcessos(idEmpresa, dtInicial, dtFinal){
    const QUERY = `CALL prDashboardConsumoSimples('${dtInicial}', '${dtFinal}', ${idEmpresa});`;
    return database.executar(QUERY);
}

module.exports = {
    kpiInsights,
    graficoAlertas,
    processosInsights,
    getAlertasComponentes,
    postKpisProcessos,
    postAlertasProcessos,
    postConsumoProcessos
}
