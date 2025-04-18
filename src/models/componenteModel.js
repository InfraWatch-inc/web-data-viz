var database = require("../database/config")

function getComponentes(){ // TODO
    var instrucaoSql = `SELECT * FROM viewGetComponentes;`; // todo fazer view de pegar componentes
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function postComponente(idServidor, nome, marca, numeracao, modelo){ // TODO
    var instrucaoSql = `INSERT INTO Componente (fkServidor, componente, marca, numeracao, modelo) VALUES (${idServidor}, '${nome}', '${marca}', ${numeracao}, '${modelo}');`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function putComponente(idComponente, nome, marca, numeracao, modelo){ // TODO
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

module.exports = {
    getComponentes,
    postComponente,
    putComponente,
    deleteComponente,
    getComponentesServidor
};