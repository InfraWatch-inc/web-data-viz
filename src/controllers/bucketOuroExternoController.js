const { getJsonFromS3 } = require("../models/bucketOuroExternoModel");

async function fetchJsonFromS3(req, res) {
    const { key } = req.params;

    if (!key) {
        return res.status(400).json({ error: "Key do arquivo é obrigatória" });
    }

    try {
        const data = await getJsonFromS3(key);
        res.status(200).json(data);
    } catch (error) {
        console.error("Erro ao buscar JSON do S3:", error);
        res.status(500).json({ error: "Erro ao buscar arquivo do S3" });
    }
}

module.exports = {
    fetchJsonFromS3
};