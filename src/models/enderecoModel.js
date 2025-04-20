var database = require("../database/config")

function postEndereco(cep,logradouro,numero,bairro,cidade,estado,pais,complemento) {
    var instrucaoSql = `INSERT INTO Endereco(cep,logradouro,numero,bairro,cidade,estado,pais,complemento) VALUES ('${cep}','${logradouro}',${numero},'${bairro}','${cidade}','${estado}','${pais}','${complemento}');`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    postEndereco
};