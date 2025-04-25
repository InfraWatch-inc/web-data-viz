var database = require("../database/config");

function tempoReal(idServidor){
    var instrucaoSql = `SELECT * FROM viewTempoReal WHERE idServidor = ${idServidor};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function getServidor(uuid){

    var instrucaoSql = `SELECT * FROM viewGetServidor where uuidPlacaMae = "${uuid}";`
    console.log("Consultei getServidor")
    return database.executar(instrucaoSql);
}


function CadastrarCaptura(dadoCaptura, dataHora, fkConfiguracaoMonitoramento){

    console.log("Estou no cadastro da captura")
    
    var instrucaoSql = `INSERT INTO captura (dadoCaptura, dataHora, fkConfiguracaoMonitoramento)
    VALUES ('${dadoCaptura}', '${dataHora}', '${fkConfiguracaoMonitoramento}');`
    
    return database.executar(instrucaoSql);
}

function CadastrarAlerta(){

    var instrucaoSql = `INSERT INTO captura  VALUES

        ;`
    console.log("Consultei getServidor")
    return database.executar(instrucaoSql);
}

function CadastrarProcesso(){

    var instrucaoSql = `INSERT INTO captura VALUES

        ;`
    console.log("Consultei getServidor")
    return database.executar(instrucaoSql);
}

module.exports = {
    tempoReal,
    getServidor,
    CadastrarCaptura,
    CadastrarAlerta,
    CadastrarProcesso
}