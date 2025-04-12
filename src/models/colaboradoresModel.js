var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT idColaborador, nome, email, fkEmpresa FROM Colaborador WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarColaborador(nome, email, documento, cargo, senha, tipoDocumento, fkEmpresa) {
    var instrucaoSql = `
        INSERT INTO Empresa (nome, email, documento, cargo, senha, tipoDocumento, fkEmpresa) 
        VALUES ('${nome}, ${email}, ${documento}, ${cargo}, ${senha}, ${tipoDocumento}, ${fkEmpresa}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getColaboradores(){
    var instrucaoSql = `SELECT * FROM viewGetColaborador;`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getColaboradorId(idColaborador){
    var instrucaoSql = `SELECT * FROM viewGetColaborador WHERE id = ${idColaborador};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrarColaborador,
    getColaboradores,
    getColaboradorId
};