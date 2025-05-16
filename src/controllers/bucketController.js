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

      horarioColeta =  new Date(Date.now());
        
      dados = monitoramentoController.monitoramento;

      for (const servidor in dados) {
        if (Array.isArray(dados[servidor]) && dados[servidor].length > 30) {
          dados[servidor].splice(0, dados[servidor].length - 30);
        }
      }

      const ano = horarioColeta.getFullYear();
      const mes = String(horarioColeta.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const dia = String(horarioColeta.getDate()).padStart(2, '0');

      const fileName = `captura_${dia}-${mes}-${ano}.json`;
      
      if(Object.keys(dados).length != 0){
        let dadosReestruturados = [];
        for(servidor in dados){
          for(captura in servidor){
            servidor = `SRV-${captura.idServidor}`;

            dicionario = {
              "servidor":servidor,
              "dtHora":captura.dataHora,
              "isAlerta":true,
            }

            capturas = captura.dadosCaptura;
            
            if(capturas != undefined){
              capturas.forEach((cap) => {
                let coluna = `${cap.componente}${cap.numeracao}`; // TODO ADD DESCRICAO DO COMPONENTE 
                dicionaro[`${coluna}`] = cap.dadoCaptura;
              });
            
              dadosReestruturados.push(dicionario);
            }          
          }
        }

        const jsonString = JSON.stringify(dadosReestruturados, null, 2);
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
      }

      await delay(10000);
      //await delay(86400000); // 24 horas em milissegundos
    }
}

module.exports = {
  enviar
}