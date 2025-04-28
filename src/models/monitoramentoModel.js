var database = require("../database/config");

function getServidor(uuid){
    var instrucaoSql = `SELECT * FROM viewGetServidor where uuidPlacaMae = "${uuid}";`
    console.log("Consultei getServidor")
    return database.executar(instrucaoSql);
}

function cadastrarAlerta(fkConfiguracaoMonitoramento, nivel, dataHora, valor){

    var instrucaoSql =`
    INSERT INTO Alerta(fkConfiguracaoMonitoramento, nivel, dataHora, valor) VALUES (${fkConfiguracaoMonitoramento}, ${nivel}, '${dataHora}', ${valor});
    `;

    return database.executar(instrucaoSql);
}

function cadastrarProcesso(){
    var instrucaoSql = `
    INSERT INTO Processo(nome, usoCpu, usoGpu, usoRam, fkServidor) VALUES ('${nome}', ${usoCpu}, ${usoGpu}, ${usoRam}, ${fkServidor});`

    return database.executar(instrucaoSql);
}

module.exports = {
    getServidor,
    cadastrarAlerta,
    cadastrarProcesso
}