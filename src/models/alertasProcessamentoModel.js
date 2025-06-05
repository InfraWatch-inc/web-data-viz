var database = require("../database/config")

function getInformacoesAlertas(idEmpresa, idEscolhaTempo) {
    let instrucaoSql = `
    SELECT * FROM viewGetInformacoesAlertas 
    WHERE idEmpresa = ${idEmpresa} 
    AND DataHora >= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL ${idEscolhaTempo} MONTH), '%Y-%m-01') 
    AND DataHora < DATE_FORMAT(NOW(), '%Y-%m-01');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
  getInformacoesAlertas
}