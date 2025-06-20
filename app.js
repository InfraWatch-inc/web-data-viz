var ambiente_processo = 'producao';
// var ambiente_processo = 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';
// Acima, temos o uso do operador ternário para definir o caminho do arquivo .env
// A sintaxe do operador ternário é: condição ? valor_se_verdadeiro : valor_se_falso

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");
var bucketController = require("./src/controllers/bucketController");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

var indexRouter = require("./src/routes/index");
var colaboradoresRouter = require("./src/routes/colaboradores");
var insightsRouter = require("./src/routes/insights");
var empresasRouter = require("./src/routes/empresas");
var servidoresRouter = require("./src/routes/servidores");
var monitoramentoRouter = require("./src/routes/monitoramento");
var suporteRouter = require("./src/routes/suporte");
var desempenhoRouter = require("./src/routes/desempenho")
var componenteRouter = require("./src/routes/componente")
var alertasMemoriaRouter = require("./src/routes/alertasMemoria");
var alertasProcessamentoRouter = require("./src/routes/alertasProcessamento");
var dadosExternosRouter = require("./src/routes/dadosExternos")
var bucketOuroExternoRouter = require("./src/routes/bucketOuroExterno")

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/", indexRouter);
app.use("/colaboradores", colaboradoresRouter);
app.use("/insights", insightsRouter);
app.use("/empresas", empresasRouter);
app.use("/servidores", servidoresRouter);
app.use("/monitoramento", monitoramentoRouter);
app.use("/suporte", suporteRouter);
app.use("/desempenho", desempenhoRouter);
app.use("/componente", componenteRouter);
app.use("/alertasMemoria", alertasMemoriaRouter);
app.use("/alertasProcessamento", alertasProcessamentoRouter);
app.use("/dadosExternos", dadosExternosRouter);
app.use("/bucketOuroExterno", bucketOuroExternoRouter)

app.listen(PORTA_APP, function () {
    console.log(`
    ##   ##  ######   #####             ####       ##     ######     ##              ##  ##    ####    ######  
    ##   ##  ##       ##  ##            ## ##     ####      ##      ####             ##  ##     ##         ##  
    ##   ##  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##        ##   
    ## # ##  ####     #####    ######   ##  ##   ######     ##     ######   ######   ##  ##     ##       ##    
    #######  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##      ##     
    ### ###  ##       ##  ##            ## ##    ##  ##     ##     ##  ##             ####      ##     ##      
    ##   ##  ######   #####             ####     ##  ##     ##     ##  ##              ##      ####    ######  
    \n\n\n                                                                                                 
    Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://${HOST_APP}:${PORTA_APP} :. \n\n
    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:. \n\n
    \tSe .:desenvolvimento:. você está se conectando ao banco local. \n
    \tSe .:producao:. você está se conectando ao banco remoto. \n\n
    \t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'\n\n`);
});

bucketController.enviar(process.env.BUCKET_NAME);
