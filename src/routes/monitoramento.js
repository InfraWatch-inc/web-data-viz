var express = require('express');
var router = express.Router();

var monitoramentoController = require("../controllers/monitoramentoController");

router.get("/:uuid", function (req, res) {
    monitoramentoController.buscarDados(req, res);
})

router.get("/dados", function (req, res) {
    monitoramentoController.cadastrarCaptura(req, res);
})

router.post("/alerta", function (req, res) {
    monitoramentoController.cadastrarAlerta(req, res);
})

module.exports = router;
