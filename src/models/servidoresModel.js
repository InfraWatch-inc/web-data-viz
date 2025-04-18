var database = require("../database/config")

function postServidor(idEmpresa, tagName, tipo, uuid, idInstancia, so, idEndereco) {
    var instrucaoSql = `
        INSERT INTO Empresa (idEmpresa, tagName, tipo, uuidPlacaMae, idInstancia, so, idEndereco) 
        VALUES (${idEmpresa}, '${tagName}', '${tipo}', '${uuid}', ${idInstancia}, '${so}', ${idEndereco});`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getServidores(idEmpresa){
    var instrucaoSql = `SELECT * FROM viewGetServidor WHERE idEmpresa = ${idEmpresa};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getServidor(idServidor){
    var instrucaoSql = `SELECT * FROM viewGetServidor WHERE idServidor = ${idServidor};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function putServidor(idServidor, tagName, tipo, uuid, idInstancia, so){
    var instrucaoSql = `UPDATE Servidor SET tagName = '${tagName}', tipo = '${tipo}', uuidPlacaMae = '${uuid}', idInstancia = ${idInstancia}, so = '${so}' WHERE idServidor = ${idServidor};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deleteServidor(idServidor){
    var instrucaoSql = `DELETE FROM Servidor WHERE idServidor = ${idServidor};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    postServidor,
    getServidores,
    getServidor,
    putServidor,
    deleteServidor
};