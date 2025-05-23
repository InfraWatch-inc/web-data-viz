var express = require("express");
var router = express.Router();

var alertasMemoriaController = require("../controllers/alertasMemoriaController");

router.get("/qtdAlertaP", function (req, res){
alertasMemoriaController.getAlertasPeriodo(req, res);
});

router.get("/qtdAlertaD", function (req, res){
alertasMemoriaController.getAlertasDisco(req, res);
});

router.get("/totalRAM", function (req, res){
alertasMemoriaController.getKpiTotalRam(req, res);
});

router.get("/totalDisc", function (req, res){
    alertasMemoriaController.getKpiTotalDisc(req, res);
})

module.exports = router;