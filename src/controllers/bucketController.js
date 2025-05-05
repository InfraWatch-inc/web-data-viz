var horarioColeta = undefined;
var dados = undefined;
var s3 = require("@aws-sdk/client-s3");
var monitoramentoController = require("./monitoramentoController");


async function enviar(bucketName){
    while (true){
        setTimeout(() => {
            console.log("24 horas");
          }, 86400000);

        horarioColeta = new Date();
          
        dados = monitoramentoController.monitoramento;
        const s3Client = new s3.S3Client({});
        const fileName = `captura-${horarioColeta.now()}.json`;

        await s3Client.send(
            new PutObjectCommand({
              Bucket: bucketName,
              Key: fileName,
              Body: dados,
            }),
        );

    }
}

module.exports = {
    enviar
}