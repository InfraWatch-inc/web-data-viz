var horarioColeta = undefined;
var dados = undefined;
var s3 = require("@aws-sdk/client-s3");
var monitoramentoController = require("./monitoramentoController");


async function enviar(bucketName){
    while (true){
        setTimeout(() => {
            console.log("24 horas");
          }, 86400000);

        horarioColeta =  Date.now();
          
        dados = monitoramentoController.monitoramento; // TODO limpar variavel de monirotamento.
        const s3Client = new s3.S3Client({region: "us-east-1"});
        const fileName = `captura-${horarioColeta}.json`;
        
       
            const comand = new s3.PutObjectCommand({
                Bucket: bucketName,
                Key: fileName,
                Body: dados,
              })
            
            const response = await s3Client.send(comand);

            console.log(response)
        

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