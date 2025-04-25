var express = require('express');
var router = express.Router();

var monitoramentoController = require("../controllers/monitoramentoController");

// router.get("/:idServidor", function (req, res) {
//     monitoramentoController.buscarDadosTempoReal(req, res);
// })

router.get("/:uuid", function (req, res) {
    monitoramentoController.buscarDados(req, res);
})

router.post("/dados", function (req, res) {
    monitoramentoController.CadastrarCaptura(req, res);
})

router.post("/alerta", function (req, res) {
    monitoramentoController.CadastrarAlerta(req, res);
})

router.post("/processos", function (req, res) {
    monitoramentoController.CadastrarProcesso(req, res);
})



module.exports = router;
