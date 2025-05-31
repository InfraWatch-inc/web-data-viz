var express = require("express");
var router = express.Router();

var componenteController = require("../controllers/componenteController");

router.post("/cadastrar/dados/:idServidor", function (req, res) {
    componenteController.cadastrarCaptura(req, res);
});

router.post("/cadastrar/configuracaoMonitoramento", function (req, res) {
    componenteController.cadastrarConfiguracaoMonitoramento(req, res);
});



module.exports = router;