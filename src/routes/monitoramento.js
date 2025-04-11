var express = require('express');
var router = express.Router();

var monitoramentoController = require("../controllers/monitoramentoController");

router.get("/monitoramento/:idServidor", function (req, res) {
    console.log("bo aqui")
    monitoramentoController.buscarDadosTempoReal(req, res);
})

module.exports = router;
