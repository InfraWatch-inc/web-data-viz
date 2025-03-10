var database = require("../database/config");

function buscarPorId(idEmpresa) {
  var instrucaoSql = `SELECT * FROM empresa WHERE idEmpresa = '${idEmpresa}'`;

  return database.executar(instrucaoSql);
}

function listar() {
  var instrucaoSql = `SELECT id, razaoSocial, cnpj, codigo_ativacao FROM empresa`;

  return database.executar(instrucaoSql);
}

function buscarPorCnpj(razaoSocial) {
  var instrucaoSql = `SELECT * FROM Empresa WHERE razaoSocial = '${razaoSocial}'`;

  return database.executar(instrucaoSql);
}

function cadastrarEmpresa(razaoSocial, numeroTin, status, telefone, site) {
  var instrucaoSql = `INSERT INTO Empresa (razaoSocial, numeroTin, status, telefone, site) VALUES ('${razaoSocial}', '${numeroTin}', '${status}', '${telefone}', '${site}')`;

  return database.executar(instrucaoSql);
}

function enviarEndereco(cep, logradouro, numero, complemento, fkEmpresa) {
  var instrucaoSql = `INSERT INTO EnderecoSede (cep, logradouro, numero, complemento, fkEmpresa) VALUES ('${cep}', '${logradouro}', '${numero}', '${complemento}', '${fkEmpresa}')`;

  return database.executar(instrucaoSql);
}

function excluirEmpresa(idEmpresa) {
  var instrucaoSql = `DELETE FROM Empresa WHERE idEmpresa = '${idEmpresa}'`;

  return database.executar(instrucaoSql);
}

module.exports = {
  buscarPorCnpj,
  buscarPorId,
  cadastrarEmpresa,
  listar,
  enviarEndereco,
  excluirEmpresa
};
