var express = require("express");
var router = express.Router();

var servidoresController = require("../controllers/servidoresController");

router.get("/buscar", function (req, res) {
    // TODO
});

router.get("/buscar/:id", function (req, res) {
    // TODO
});

router.post("/cadastrar", function (req, res) { 
    // TODO
});

router.delete("/deletar/:id", function (req, res){
    // TODO
});

router.put("/atualizar/:id", function (req, res){
    // TODO
})

module.exports = router;