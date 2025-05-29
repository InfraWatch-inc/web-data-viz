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

function alertasComponentes(condicao){
    // TODO
    var instrucaoSql = `SELECT * FROM viewPrimeiroInsights WHERE ${condicao};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function postKpisProcessos(idEmpresa, dtInicial, dtFinal){
    const QUERY_SQL = `CALL prDashboardKPIs('${dtInicial}', '${dtFinal}', ${idEmpresa});`;
    return database.executar(QUERY_SQL);
}

function postAlertasProcessos(idEmpresa, dtInicial, dtFinal){
    const QUERY_SQL = `CALL prDashboardAlertasJSON('${dtInicial}', '${dtFinal}', ${idEmpresa});`;
    return database.executar(QUERY_SQL);
}

function postConsumoProcessos(idEmpresa, dtInicial, dtFinal){
    const QUERY_SQL = `CALL prDashboardConsumoSimples('${dtInicial}', '${dtFinal}', ${idEmpresa});`;
    return database.executar(QUERY_SQL);
}

module.exports = {
    kpiInsights,
    graficoAlertas,
    processosInsights,
    alertasComponentes,
    postDadosProcessos,
    postKpisProcessos,
    postAlertasProcessos,
    postConsumoProcessos
}
