var database = require("../database/config")

function postServidor(nome, email, documento, cargo, senha, tipoDocumento, fkEmpresa) {
    var instrucaoSql = `
        INSERT INTO Empresa (nome, email, documento, cargo, senha, tipoDocumento, fkEmpresa) 
        VALUES ('${nome}, ${email}, ${documento}, ${cargo}, ${senha}, ${tipoDocumento}, ${fkEmpresa}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getServidores(){
    var instrucaoSql = `SELECT * FROM viewGetServidor;`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getServidor(idServidor){
    var instrucaoSql = `SELECT * FROM viewGetServidor WHERE id = ${idServidor};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function putServidor(idServidor){
    // TODO
    var instrucaoSql = ``;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deleteServidor(idServidor){
    // TODO
    var instrucaoSql = ``;
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