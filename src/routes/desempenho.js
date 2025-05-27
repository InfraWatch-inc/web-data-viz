var express = require("express");
var router = express.Router();
var desempenhoController = require("../controllers/desempenhoController");


// POST /desempenho/buscar/chamado
router.post("/buscar/chamado", (req, res) => {
    const dados = req.body;
    console.log("Recebido do Python:", dados);

    // Aqui você pode processar os dados como quiser, ou salvar em banco
    res.status(200).json({ status: "ok", mensagem: "Dados recebidos com sucesso" });
});

module.exports = router;
