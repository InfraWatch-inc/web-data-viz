const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3 = new S3Client({ region: "us-east-1" });

async function getJsonFromS3(key) {
    try {
        const command = new GetObjectCommand({
            Bucket: 'infrawatch-ouro',
            Key: key,
        });

        const response = await s3.send(command);
        const body = await readableStreamToString(response.Body);
        console.log(response)
        const data = JSON.parse(body);
        console.log("JSON carregado:", data);
        return data;
    } catch (error) {
        console.error("Erro ao ler JSON do S3:", error);
        throw error;
    }
}

async function readableStreamToString(stream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString("utf-8");
}

module.exports = {
    getJsonFromS3,
    readableStreamToString
};