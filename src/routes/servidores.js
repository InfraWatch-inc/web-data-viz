var express = require("express");
var router = express.Router();

var servidoresController = require("../controllers/servidoresController");

router.get("/buscar", function (req, res) {
    servidoresController.getServidores(req, res);
});

router.get("/buscar/:id", function (req, res) {
    servidoresController.getServidor(req, res);
});

router.post("/cadastrar", function (req, res) { 
    servidoresController.postServidor(req, res);
});

router.delete("/deletar/:id", function (req, res){
    servidoresController.deleteServidor(req, res);
});

router.put("/atualizar/:id", function (req, res){
    servidoresController.putServidor(req, res);
})

module.exports = router;