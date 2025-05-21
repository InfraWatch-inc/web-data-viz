var database = require("../database/config")

function getAlertasPeriodo() {
    let instrucaoSql = `
    SELECT * FROM (select @p:= "${sessionStorage.ID_EMPRESA}")parm, vw_alertas_mensais_empresa1;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getAlertasDisco() {
    let instrucaoSql = ``;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    getAlertasDisco,
    getAlertasPeriodo
}