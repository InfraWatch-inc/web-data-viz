var database = require("../database/config");

function buscarPorId(id) {
  var instrucaoSql = `SELECT * FROM empresa WHERE id = '${id}'`;

  return database.executar(instrucaoSql);
}

function listar() {
  var instrucaoSql = `SELECT id, razao_social, cnpj, codigo_ativacao FROM empresa`;

  return database.executar(instrucaoSql);
}

function buscarPorCnpj(cnpj) {
  var instrucaoSql = `SELECT * FROM empresa WHERE cnpj = '${cnpj}'`;

  return database.executar(instrucaoSql);
}

function cadastrarEmpresa(razaoSocial, numeroTin, status, telefone, site, fkEndereco) {
  var instrucaoSql = `INSERT INTO Empresa (razao_social, numeroTin, status, telefone, site, fkEndereco) VALUES ('${razaoSocial}', '${cnpj}', '${numeroTin}', '${status}', '${telefone}', '${site}',  '${fkEndereco}')`;

  return database.executar(instrucaoSql);
}

function enviarEndereco(cep, logradouro, numero, complemento){
  var instrucaoSql = `INSERT INTO EnderecoSede (cep, logradouro, numero, complemento) VALUES ('${cep}', '${logradouro}', '${numero}', '${complemento}', '${telefone}', '${site}',  '${fkEndereco}')`;
  
  return database.executar(instrucaoSql);
}

module.exports = { buscarPorCnpj, buscarPorId, cadastrarEmpresa, listar, enviarEndereco };
