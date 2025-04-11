var database = require("../database/config");

function tempoReal(idServidor){
    var instrucaoSql = `SELECT * FROM viewTempoReal WHERE idServidor = ${idServidor};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    tempoReal
}