var express = require("express");
var router = express.Router();

var insightsController = require("../controllers/insightsController");

router.get("/alertasComponentes/:periodo/:idEmpresa", function (req, res) {
    insightsController.getAlertasComponentes(req, res);
});

router.post("/dadosComponente/:componente", function (req, res) {
    insightsController.postInsightsComponente(req, res);
});

router.post("/processos/:idEmpresa", function (req, res) {
    insightsController.postDadosProcessos(req, res);
});

module.exports = router;