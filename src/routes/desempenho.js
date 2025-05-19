var express = require("express");
var router = express.Router();
var desempenhoController = require("../controllers/desempenhoController");

router.get("/buscar/chamado", function (req, res){
    desempenhoController.getChamado(req, res)
})

module.exports = 
router;