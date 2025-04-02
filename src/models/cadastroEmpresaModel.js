var database = require("../database/config")

function cadastrarEmp(razaoSocial, numeroTin, telefone, site, pais) {
    var instrucaoSql = `
        INSERT INTO Empresa (razaoSocial, numeroTin, telefone, site, pais) VALUES ('${razaoSocial}, ${numeroTin}, ${telefone}, ${site}, ${pais}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarEnd(cep, logradouro, numero, bairro, cidade, estado, complemento) {
    var instrucaoSql = `
        INSERT INTO Empresa (cep, logradouro, numero, bairro, cidade, estado, complemento) VALUES ('${cep}, ${logradouro}, ${numero}, ${bairro}, ${cidade}, ${estado}, ${complemento}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarCol(nome, email, documento, tipoDocumento, senha, dtCadastro, fkResponsavel, fkEmpresa, cargo, nivel) {
    var instrucaoSql = `
        INSERT INTO Empresa (nome, email, documento, tipoDocumento, senha, dtCadastro, fkResponsavel, fkEmpresa, cargo, nivel) VALUES ('${nome}, ${email}, ${documento}, ${tipoDocumento}, ${senha}, ${dtCadastro}, ${fkResponsavel}, ${fkEmpresa}, ${cargo}, ${nivel}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrarEmp, 
    cadastrarEnd,
    cadastrarCol,
};