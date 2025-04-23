var database = require("../database/config")

function patchFkEmpresa(idColaborador, fkEmpresa){
    var instrucaoSql = `UPDATE Colaborador SET fkEmpresa = ${fkEmpresa} WHERE idColaborador = ${idColaborador};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function postAutenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT idColaborador, nome, email, nivel, fkEmpresa FROM Colaborador WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function postColaborador(nome, email, documento, cargo, senha, tipoDocumento, fkEmpresa, nivel) {
    var instrucaoSql = `
        INSERT INTO Colaborador (nome, email, documento, cargo, senha, tipoDocumento, fkEmpresa, nivel) 
        VALUES ('${nome}', '${email}', '${documento}', '${cargo}', '${senha}', '${tipoDocumento}', ${fkEmpresa}, ${nivel});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getColaboradores(){
    var instrucaoSql = `SELECT * FROM viewGetColaborador;`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getColaborador(idColaborador){
    var instrucaoSql = `SELECT * FROM viewGetColaborador WHERE id = ${idColaborador};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function putColaborador(idColaborador, nome, email, documento, cargo, senha, tipoDocumento, nivel){
    var instrucaoSql = `UPDATE Colaborador
                        SET nome = '${nome}', email= '${email}', documento = '${documento}', cargo = '${cargo}', senha = '${senha}', tipoDocumento = '${tipoDocumento}', nivel = ${nivel}
                        WHERE idColaborador = ${idColaborador};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deleteColaborador(idColaborador){
    var instrucaoSql = `DELETE FROM Colaborador WHERE idColaborador=${idColaborador};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    postAutenticar,
    postColaborador,
    getColaboradores,
    getColaborador,
    putColaborador,
    deleteColaborador,
    patchFkEmpresa
};