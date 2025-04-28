var express = require('express');
var router = express.Router();

var monitoramentoController = require("../controllers/monitoramentoController");

router.get("/:uuid", function (req, res) {
    monitoramentoController.buscarDados(req, res);
})

router.post("/dados", function (req, res) {
    monitoramentoController.cadastrarCaptura(req, res);
})

router.get("/dados/:idServidor", function (req, res) {
    monitoramentoController.getCapturas(req, res);
})

router.post("/alerta", function (req, res) {
    monitoramentoController.cadastrarAlerta(req, res);
})

router.post("/processos", function (req, res) {
    monitoramentoController.cadastrarProcessos(req, res);
})

module.exports = router;
