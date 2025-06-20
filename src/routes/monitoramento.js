var express = require('express');
var router = express.Router();

var monitoramentoController = require("../controllers/monitoramentoController");

router.get("/componente/:uuid", function (req, res) {
    monitoramentoController.buscarDadosComponente(req, res);
});

router.post("/cadastrar/dados/:idServidor", function (req, res) {
    monitoramentoController.cadastrarCaptura(req, res);
});

router.get("/coletar/dados/:idServidor", function (req, res) {
    monitoramentoController.getCapturas(req, res);
});

router.get("/coletar/dados", function (req, res) {
    monitoramentoController.getTodosServidores(req, res);
});

router.post("/cadastrar/alerta", function (req, res) {
    monitoramentoController.cadastrarAlerta(req, res);
});

router.post("/cadastrar/processos", function (req, res) {
    monitoramentoController.cadastrarProcessos(req, res);
});

router.get("/listagem/:idEmpresa", function (req, res){
    monitoramentoController.listagemServidores(req, res);
});

router.post("/cadastrar/chamado", function (req, res) {
    monitoramentoController.abrirChamado(req, res);
})

router.get("/coletar/chamados", function (req, res) {
    monitoramentoController.abrirChamado(req, res);
})

router.post("/instancia", function (req, res) {
    monitoramentoController.postDadoInstancia(req, res);
})

router.get("/instancia", function (req, res) {
    monitoramentoController.getDadosInstancia(req, res);
})

router.get("/logs", function (req, res){
    monitoramentoController.getLogs(req, res);
})

router.get("/:uuid", function (req, res) {
    monitoramentoController.buscarDados(req, res);
});

module.exports = router;
