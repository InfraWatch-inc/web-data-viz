var express = require("express");
var router = express.Router();
var desempenhoController = require("../controllers/desempenhoController");

// router.get('/desempenho/buscar/chamado', desempenhoController.getChamado)

router.get('/desempenho/buscar/chamado', desempenhoController.receberChamado)

module.exports = 
router;