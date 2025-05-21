var express = require("express");
var router = express.Router();

var alertasMemoriaController = require("../controllers/alertasMemoriaController");

router.get("/qtdAlertaP", function (req, res){
alertasMemoriaController.getAlertasPeriodo(req, res);
});

router.get("/qtdAlertaD", function (req, res){
alertasMemoriaController.getAlertasDisco(req, res);
});

module.exports = router;