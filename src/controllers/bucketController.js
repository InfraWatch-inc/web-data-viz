var horarioColeta = undefined;
var dados = undefined;
var { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
var monitoramentoController = require("./monitoramentoController");

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// TODO Estuturar dados 
        
//{
//    "servidor":"SRV001",
//    "dtHora": "",
//    "isAlerta":true,
//    "cpu1_uso":20.0
//}

async function enviar(bucketName){
  const s3Client = new S3Client({region: "us-east-1"});
    while (true){

      horarioColeta =  Date.now();
        
      dados = monitoramentoController.monitoramento;

      console.log("dados", dados);
      for (const servidor in dados) {
        if (Array.isArray(dados[servidor]) && dados[servidor].length > 30) {
          dados[servidor].splice(0, dados[servidor].length - 30);
        }
      }

      const fileName = `captura-${horarioColeta}.json`;
      const jsonString = JSON.stringify(dados, null, 2);
      
      try {
        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: fileName,
          Body: jsonString,
          ContentType: "application/json"
        });
  
        const response = await s3Client.send(command);
        console.log("Arquivo enviado:", fileName, response);
      } catch (error) {
        console.error("Erro ao enviar para o S3:", error);
      }

      await delay(86400000); // 24 horas em milissegundos
    }
}

module.exports = {
    enviar
}