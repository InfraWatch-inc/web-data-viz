var express = require("express");
var router = express.Router();

var colaboradoresController = require("../controllers/colaboradoresController");

router.post("/autenticar", function (req, res) {
    colaboradoresController.postAutenticar(req, res);
});

router.get("/buscar", function (req, res) {
    colaboradoresController.getColaboradores(req, res);
});

router.get("/buscar/:id", function (req, res) {
    colaboradoresController.getColaboradorId(req, res);
});

router.post("/cadastrar", function (req, res) { 
    colaboradoresController.postCadastrarColaborador(req, res);
});

module.exports = router;