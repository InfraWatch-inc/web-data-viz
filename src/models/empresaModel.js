var database = require("../database/config");

function buscarPorId(idEmpresa) {
  var instrucaoSql = `SELECT * FROM Empresa WHERE idEmpresa = '${idEmpresa}'`;

  return database.executar(instrucaoSql);
}

function buscarPorCnpj(razaoSocial) {
  var instrucaoSql = `SELECT * FROM Empresa WHERE razaoSocial = '${razaoSocial}'`;

  return database.executar(instrucaoSql);
}

function cadastrarEmp(razaoSocial, numeroTin, telefone, site, fkEndereco) {
  var instrucaoSql = `
        INSERT INTO Empresa (razaoSocial, numeroTin, telefone, site, fkEndereco)
         VALUES ('${razaoSocial}', '${numeroTin}', '${telefone}', '${site}', '${fkEndereco}');
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function cadastrarEnd(cep, logradouro, numero, bairro, cidade, estado, complemento, pais) {
  var instrucaoSql = `
        INSERT INTO Endereco (cep, logradouro, numero, bairro, cidade, estado, complemento, pais) 
        VALUES ('${cep}', '${logradouro}', '${numero}', '${bairro}', '${cidade}', '${estado}', '${complemento}', '${pais}');
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
