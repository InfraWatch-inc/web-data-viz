var database = require("../database/config");

function buscarPorId(idEmpresa) {
  var instrucaoSql = `SELECT * FROM empresa WHERE idEmpresa = '${idEmpresa}'`;

  return database.executar(instrucaoSql);
}

function buscarPorCnpj(razaoSocial) {
  var instrucaoSql = `SELECT * FROM Empresa WHERE razaoSocial = '${razaoSocial}'`;

  return database.executar(instrucaoSql);
}

function cadastrarEmp(razaoSocial, numeroTin, telefone, site, pais) {
    var instrucaoSql = `
        INSERT INTO Empresa (razaoSocial, numeroTin, telefone, site, pais)
         VALUES ('${razaoSocial}', '${numeroTin}', '${telefone}', '${site}', '${pais}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarEnd(cep, logradouro, numero, bairro, cidade, estado, complemento, fkEmpresa) {
    var instrucaoSql = `
        INSERT INTO Endereco (cep, logradouro, numero, bairro, cidade, estado, complemento) 
        VALUES ('${cep}', '${logradouro}', '${numero}', '${bairro}', '${cidade}', '${estado}', '${complemento}', 
        '${fkEmpresa}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function excluirEmpresa(idEmpresa) {
  var instrucaoSql = `DELETE FROM Empresa WHERE idEmpresa = '${idEmpresa}'`;

  return database.executar(instrucaoSql);
}

module.exports = {
  buscarPorCnpj,
  buscarPorId,
  cadastrarEmp,
  cadastrarEnd,
  excluirEmpresa
};
