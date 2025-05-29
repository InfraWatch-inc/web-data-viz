const {WebClient} = require('@slack/web-api');

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

var database = require("../database/config");

const jiraConfig = {
  baseUrl: process.env.BASE_URL,
  auth: process.env.AUTH,
  email: process.env.EMAIL,
  projectId: process.env.PROJECT_ID_REB,
  projectKey: process.env.PROJECT_KEY_REB
};

    
const getCredentials = () => {
  return btoa(`${jiraConfig.email}:${jiraConfig.auth}`);
};

function getServidor(uuid){
    var instrucaoSql = `
    SELECT * FROM viewGetServidor where uuidPlacaMae = "${uuid}";`;

    return database.executar(instrucaoSql);
}

function getServidorComponente(uuid){
    var instrucaoSql = `
    SELECT * FROM servidor WHERE uuidPlacaMae = "123490EN400015";`;

    return database.executar(instrucaoSql);
}

function cadastrarAlerta(fkConfiguracaoMonitoramento, nivel, dataHora, valor){

    var instrucaoSql =`
    INSERT INTO Alerta(fkConfiguracaoMonitoramento, nivel, dataHora, valor) VALUES (${fkConfiguracaoMonitoramento}, ${nivel}, '${dataHora}', ${valor});
    `;

    return database.executar(instrucaoSql);
}

function cadastrarProcesso(nome, usoCpu, usoGpu, usoRam, fkServidor, dataHora){
    var instrucaoSql = `
    INSERT INTO Processo(nomeProcesso, usoCpu, usoGpu, usoRam, fkServidor, dataHora) VALUES ('${nome}', ${usoCpu}, ${usoGpu}, ${usoRam}, ${fkServidor}, '${dataHora}');`;

    return database.executar(instrucaoSql);
}


function listagemServidores(idEmpresa){
    var instrucaoSql = `
    SELECT * FROM viewListagemServidores WHERE idEmpresa = "${idEmpresa}";
    `;

    return database.executar(instrucaoSql);
}

async function abrirChamado(idAlerta, idServidor, nivel, dataHora, componente, metrica, valor){
    let tipoAlerta = "Moderado";
    let descricao, documentoDescricao, assunto;

    let operadores = [
        "Carlos Silva",
        "Ana Souza",
        "Pedro Lima",
        "Mariana Costa",
        "Lucas Rocha"
    ];

    let operador_responsavel = operadores[Math.floor(Math.random() * operadores.length)];
    console.log("Operador Responsável:", operador_responsavel);

    if(nivel == 2){
        tipoAlerta = "Critico"
    }

    assunto = `Alerta ${tipoAlerta}`;

    descricao = 
        `🚨 Alerta gerado!\n\n` +
        `• Componente: ${componente}\n` +
        `• Tipo de Alerta: ${tipoAlerta}\n` +
        `• Métrica: ${metrica}\n` +
        `• Valor Capturado: ${valor}\n` +
        `• Data/Hora: ${dataHora}\n` +
        `• Servidor: ${idServidor}\n` +
        `• ID do Alerta no Banco: ${idAlerta}\n` +
        `• Operador Responsável: ${operador_responsavel}`   
        

        console.log("Descrição do Chamado:", descricao);


    documentoDescricao = {
        "type": "doc",
        "version": 1,
        "content": [{
            "type": "paragraph",
            "content": [{
                "type": "text",
                "text": descricao
            }]
        }]
    };

    try{
        const credenciais = getCredentials();

        const resposta = await fetch(`${jiraConfig.baseUrl}/issue`, {
            method: "POST",
            headers:  {
                'Authorization': `Basic ${credenciais}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "fields": { 
                    "project": {
                        "id": jiraConfig.projectId,
                        "key": jiraConfig.projectKey
                    },
                    "summary": assunto,
                    "description": documentoDescricao,
                    "issuetype": {
                        "name": "Task"
                    }
                }
            })
        });

        if(!resposta.ok){
            const erro = await resposta.text();
            console.error('Erro ao criar a issue no Jira:', erro);
            // throw new Error(`Erro ao criar a issue: ${JSON.stringify({erro})}`);
        }

        const retornoJira = await resposta.json();
        const idChamado = retornoJira.key;

        await slack.chat.postMessage({
            channel: process.env.SLACK_CHANNEL,
            text: `🔔 Chamado *${idChamado}* criado no Jira para o componente *${componente}* (alerta ${tipoAlerta}) com valor *${valor} ${metrica}*.`
        })
    }catch(erro){
        console.error('Erro no modelo ao criar issue:', erro);
        throw erro;
    }
}


module.exports = {
    getServidor,
    cadastrarAlerta,
    cadastrarProcesso,
    listagemServidores,
    abrirChamado,
    getServidorComponente
}