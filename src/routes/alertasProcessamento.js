var express = require("express");
var router = express.Router();

var alertasProcessamentoController = require("../controllers/alertasProcessamentoController");

router.post("/informacoesAlertas", function (req, res){
alertasProcessamentoController.informacoesAlertas(req, res);
});

module.exports = router;