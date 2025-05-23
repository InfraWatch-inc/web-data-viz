var database = require("../database/config")

function getAlertasPeriodo(idEmpresa) {
    let instrucaoSql = `
    SELECT * FROM (select @p:= ${idEmpresa}) parm, vw_alertas_ram_periodo;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getAlertasDisco(idEmpresa) {
    let instrucaoSql = `
    SELECT * FROM (select @p:= ${idEmpresa})parm, vw_alertas_mensais_empresa;`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getKpiTotalRam(idEmpresa) {
    let instrucaoSql = `SELECT * FROM (select @p:=${idEmpresa})parm, qtdAlertaRAM;`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getKpiTotalDisc(idEmpresa) {
    let instrucaoSql = `
    SELECT * FROM (select @p:=${idEmpresa})parm, qtdAlertaDis;`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}



module.exports = {
    getAlertasDisco,
    getAlertasPeriodo,
    getKpiTotalDisc,
    getKpiTotalRam
}