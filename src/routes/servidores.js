var express = require("express");
var router = express.Router();

var servidoresController = require("../controllers/servidoresController");

router.get("/buscar/:idEmpresa", function (req, res) {
    servidoresController.getServidores(req, res);
});

router.get("/buscar/servidor/:id", function (req, res) {
    servidoresController.getServidor(req, res);
});

router.get("/buscar/servidorPython/:id", function (req, res) {
    servidoresController.getServidorPython(req, res);
});


router.post("/cadastrar", function (req, res) { 
    servidoresController.postServidor(req, res);
});

router.post("/cadastrarDoPython", function (req, res) { 
    servidoresController.postServidorPython(req, res);
});

router.delete("/deletar/:id", function (req, res){
    servidoresController.deleteServidor(req, res);
});

router.put("/atualizar/:id", function (req, res){
    servidoresController.putServidor(req, res);
})

router.post("/cadastrarServidor", function (req, res){
    servidoresController.cadastrarServidor(req, res);
})

router.get("/pesquisa/:nome")

module.exports = router;