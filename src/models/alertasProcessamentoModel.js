var database = require("../database/config")

function getComponenteMaiorQtdAlertaCriticoTrimestral(idEmpresa) {
    let instrucaoSql = `SELECT Componente.componente, count(*)
        AS totalAlertasCritcios FROM Alerta
        JOIN ConfiguracaoMonitoramento ON fkConfiguracaoMonitoramento = idConfiguracaoMonitoramento
        JOIN Componente ON fkComponente = idComponente 
        JOIN Servidor ON fkServidor = idServidor
        JOIN Empresa ON fkEmpresa = idEmpresa 
        where idEmpresa = ${idEmpresa} AND 
        Componente.componente IN  ('CPU', 'GPU') AND
        Alerta.nivel = 2 AND
        Alerta.dataHora >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
        GROUP BY Componente.componente 
        ORDER BY totalAlertasCritcios DESC
        LIMIT 1;`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getComponenteMaiorQtdAlertaCriticoSemestral(idEmpresa) {
    let instrucaoSql = `SELECT Componente.componente, count(*)
        AS totalAlertasCritcios FROM Alerta
        JOIN ConfiguracaoMonitoramento ON fkConfiguracaoMonitoramento = idConfiguracaoMonitoramento
        JOIN Componente ON fkComponente = idComponente 
        JOIN Servidor ON fkServidor = idServidor
        JOIN Empresa ON fkEmpresa = idEmpresa 
        where idEmpresa = ${idEmpresa} AND 
        Componente.componente IN  ('CPU', 'GPU') AND
        Alerta.nivel = 2 AND
        Alerta.dataHora >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY Componente.componente 
        ORDER BY totalAlertasCritcios DESC
        LIMIT 1;`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getComponenteMaiorQtdAlertaCriticoAnual(idEmpresa) {
    let instrucaoSql = `SELECT Componente.componente, count(*)
        AS totalAlertasCritcios FROM Alerta
        JOIN ConfiguracaoMonitoramento ON fkConfiguracaoMonitoramento = idConfiguracaoMonitoramento
        JOIN Componente ON fkComponente = idComponente 
        JOIN Servidor ON fkServidor = idServidor
        JOIN Empresa ON fkEmpresa = idEmpresa 
        where idEmpresa = ${idEmpresa} AND 
        Componente.componente IN  ('CPU', 'GPU') AND
        Alerta.nivel = 2 AND
        Alerta.dataHora >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
        GROUP BY Componente.componente 
        ORDER BY totalAlertasCritcios DESC
        LIMIT 1;`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}




function getQtdAlertasPeriodoTrimestral(idEmpresa) {
    let instrucaoSql = `
    SELECT
  CASE
    WHEN HOUR(Alerta.dataHora) BETWEEN 6 AND 11 THEN 'Manhã'
    WHEN HOUR(Alerta.dataHora) BETWEEN 12 AND 17 THEN 'Tarde'
    ELSE 'Noite'
  END AS periodoDia,
  COUNT(*) AS totalAlertas
    FROM Alerta
    JOIN ConfiguracaoMonitoramento ON fkConfiguracaoMonitoramento = idConfiguracaoMonitoramento
    JOIN Componente ON fkComponente = idComponente 
    JOIN Servidor ON fkServidor = idServidor
    JOIN Empresa ON fkEmpresa = idEmpresa 
    WHERE Alerta.dataHora >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH) 
    AND Empresa.idEmpresa = ${idEmpresa}
    GROUP BY periodoDia
    ORDER BY FIELD(periodoDia, 'Manhã', 'Tarde', 'Noite');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getQtdAlertasPeriodoSemestral(idEmpresa) {
    let instrucaoSql = `
    SELECT
  CASE
    WHEN HOUR(Alerta.dataHora) BETWEEN 6 AND 11 THEN 'Manhã'
    WHEN HOUR(Alerta.dataHora) BETWEEN 12 AND 17 THEN 'Tarde'
    ELSE 'Noite'
  END AS periodoDia,
  COUNT(*) AS totalAlertas
    FROM Alerta
    JOIN ConfiguracaoMonitoramento ON fkConfiguracaoMonitoramento = idConfiguracaoMonitoramento
    JOIN Componente ON fkComponente = idComponente 
    JOIN Servidor ON fkServidor = idServidor
    JOIN Empresa ON fkEmpresa = idEmpresa 
    WHERE Alerta.dataHora >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) 
    AND Empresa.idEmpresa = ${idEmpresa}
    GROUP BY periodoDia
    ORDER BY FIELD(periodoDia, 'Manhã', 'Tarde', 'Noite');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getQtdAlertasPeriodoAnual(idEmpresa) {
    let instrucaoSql = `
    SELECT
  CASE
    WHEN HOUR(Alerta.dataHora) BETWEEN 6 AND 11 THEN 'Manhã'
    WHEN HOUR(Alerta.dataHora) BETWEEN 12 AND 17 THEN 'Tarde'
    ELSE 'Noite'
  END AS periodoDia,
  COUNT(*) AS totalAlertas
    FROM Alerta
    JOIN ConfiguracaoMonitoramento ON fkConfiguracaoMonitoramento = idConfiguracaoMonitoramento
    JOIN Componente ON fkComponente = idComponente 
    JOIN Servidor ON fkServidor = idServidor
    JOIN Empresa ON fkEmpresa = idEmpresa 
    WHERE Alerta.dataHora >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) 
    AND Empresa.idEmpresa = ${idEmpresa}
    GROUP BY periodoDia
    ORDER BY FIELD(periodoDia, 'Manhã', 'Tarde', 'Noite');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    getComponenteMaiorQtdAlertaCriticoTrimestral,
    getComponenteMaiorQtdAlertaCriticoSemestral,
    getComponenteMaiorQtdAlertaCriticoAnual,
    getQtdAlertasPeriodoTrimestral,
    getQtdAlertasPeriodoSemestral,
    getQtdAlertasPeriodoAnual
}