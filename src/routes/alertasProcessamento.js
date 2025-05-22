var express = require("express");
var router = express.Router();

var alertasProcessamentoController = require("../controllers/alertasProcessamentoController");

router.post("/AlertasPorPeriodoTrimestral", function (req, res){
alertasProcessamentoController.getAlertasPorPeriodoTrimestral(req, res);
});

router.post("/AlertasPorPeriodoSemestral", function (req, res){
alertasProcessamentoController.getAlertasPorPeriodoSemestral(req, res);
});

router.post("/AlertasPorPeriodoAnual", function (req, res){
alertasProcessamentoController.getAlertasPorPeriodoAnual(req, res);
});

router.post("/MaiorQtdAlertaCriticoTrimestral", function (req, res){
alertasProcessamentoController.getComponenteMaiorQtdAlertaCriticoTrimestral(req, res);
});

router.post("/MaiorQtdAlertaCriticoSemestral", function (req, res){
alertasProcessamentoController.getComponenteMaiorQtdAlertaCriticoSemestral(req, res);
});

router.post("/MaiorQtdAlertaCriticoAnual", function (req, res){
alertasProcessamentoController.getComponenteMaiorQtdAlertaCriticoAnual(req, res);
});

module.exports = router;