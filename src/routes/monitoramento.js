var express = require('express');
var router = express.Router();

var monitoramentoController = require("../controllers/monitoramentoController");

router.get("/:uuid", function (req, res) {
    monitoramentoController.buscarDados(req, res);
}); // todo verificar porque isto está errado

router.post("/cadastrar/dados/:idServidor", function (req, res) {
    monitoramentoController.cadastrarCaptura(req, res);
});

router.get("/coletar/dados/:idServidor", function (req, res) {
    monitoramentoController.getCapturas(req, res);
}); // todo verificar porque isto está errado

router.post("/cadastrar/alerta", function (req, res) {
    monitoramentoController.cadastrarAlerta(req, res);
});

router.post("/cadastrar/processos", function (req, res) {
    monitoramentoController.cadastrarProcessos(req, res);
});

module.exports = router;
