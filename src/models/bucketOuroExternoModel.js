const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const bucket = process.env.S3_BUCKET;

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
});

async function getJsonFromS3(key) {
    try {
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key,
        });

        const response = await s3.send(command);
        const body = await readableStreamToString(response.Body);

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