var horarioColeta = undefined;
var dados = undefined;
var { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
var monitoramentoController = require("./monitoramentoController");

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function enviar(bucketName){
  const s3Client = new S3Client({region: "us-east-1"});
    while (true){

        horarioColeta =  Date.now();
          
        dados = monitoramentoController.monitoramento;

        console.log("dados", dados);
        // for(let i = 0; i < Object.keys(monitoramentoController.monitoramento).length; i++){
        //   monitoramentoController.monitoramento[i].forEach((item) => {
        //     if (item.length > 30) {
        //       item.splice(0, item.length - 30);
        //     }
        //   });
        // }

        
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

        await delay(8640000); // 24 horas em milissegundos
    }
}

module.exports = {
    enviar
}


// try {
//     return await s3Client
//       .send(new PutObjectCommand(bucketParams))
//       .then((result) => {
//         return process.send({
//           type: 'success',
//           fileName: f.name,
//           result,
//         });
//       });
//     } catch (erro) {
//         process.send({
//          type: 'error',
//          fileName: f.name,
//          error: erro,
//     });
//   }