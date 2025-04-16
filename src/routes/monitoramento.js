var express = require('express');
var router = express.Router();

var monitoramentoController = require("../controllers/monitoramentoController");

router.get("/:idServidor", function (req, res) {
    monitoramentoController.buscarDadosTempoReal(req, res);
})

module.exports = router;
