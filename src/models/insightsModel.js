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
    const QUERY = `SELECT * FROM viewPrimeiroInsights 
    WHERE idEmpresa = ${idEmpresa} 
    AND dataHora >= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL ${periodo}), '%Y-%m-01')
    AND dataHora < DATE_FORMAT(NOW(), '%Y-%m-01');
    `;
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
