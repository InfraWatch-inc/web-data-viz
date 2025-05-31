var database = require("../database/config");

function postComponente(idServidor, nome, marca, numeracao, modelo){
    var instrucaoSql = `INSERT INTO Componente (fkServidor, componente, marca, numeracao, modelo) VALUES (${idServidor}, '${nome}', '${marca}', ${numeracao}, '${modelo}');`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function putComponente(idComponente, nome, marca, numeracao, modelo){ 
    var instrucaoSql = `UPDATE Componente SET componente = '${nome}', marca = '${marca}', numeracao = ${numeracao}, modelo = '${modelo}' WHERE idComponente = ${idComponente};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deleteComponente(idComponente){
    var instrucaoSql = `DELETE FROM Componente WHERE idComponente = ${idComponente};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getComponentesServidor(idServidor){
    var instrucaoSql = `SELECT idComponente FROM Componente WHERE fkServidor = ${idServidor};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
function postConfiguracaoMonitoramento(unidadeMedida, descricao, fkComponente, limiteAtencao, limiteCritico, funcaoPython){
    var instrucaoSql = `INSERT INTO ConfiguracaoMonitoramento (unidadeMedida, descricao, fkComponente, limiteAtencao, limiteCritico, funcaoPython) VALUES
    ('${unidadeMedida}','${descricao}', '${fkComponente}','${limiteAtencao}', '${limiteCritico}','${funcaoPython}');`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    postComponente,
    putComponente,
    deleteComponente,
    postConfiguracaoMonitoramento,
    getComponentesServidor
};