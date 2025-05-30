var express = require("express");
var router = express.Router();

var colaboradoresController = require("../controllers/colaboradoresController");

router.post("/autenticar", function (req, res) {
    colaboradoresController.postAutenticar(req, res);
});

router.post("/autenticar/:email/:senha", function (req, res) {
    colaboradoresController.postAutenticarDoPython(req, res);
});

router.get("/buscar/:idEmpresa", function (req, res) {
    colaboradoresController.getColaboradores(req, res);
});

router.get("/buscar/:idEmpresa/:id", function (req, res) {
    colaboradoresController.getColaborador(req, res);
});

router.post("/postColaborador", function (req, res) { 
    colaboradoresController.postColaborador(req, res);
});

router.delete("/deletar/:id", function (req, res){
    colaboradoresController.deleteColaborador(req, res);
});

router.put("/atualizar/:id", function (req, res){
    colaboradoresController.putColaborador(req, res);
})

module.exports = router;