var database = require("../database/config")

function getComponente(){ // TODO
    var instrucaoSql = ``;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function postComponente(idServidor, nome, marca, numeracao, modelo){ // TODO
    var instrucaoSql = ``;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function putComponente(){ // TODO
    var instrucaoSql = ``;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deleteComponente(){ // TODO
    var instrucaoSql = ``;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    getComponente,
    postComponente,
    putComponente,
    deleteComponente
};