var express = require("express");
var router = express.Router();
var desempenhoController = require("../controllers/desempenhoController");


// POST /desempenho/buscar/chamado
router.post("/buscar/chamado", (req, res) => {
    const dados = req.body;
    console.log("Recebido do Python:", dados);

    desempenhoController.receberChamado(req, res)

    // Aqui você pode processar os dados como quiser, ou salvar em banco
});

router.get("/recebe/chamado", (req, res) => {
    desempenhoController.pegarChamado(req, res)
})


module.exports = router;
