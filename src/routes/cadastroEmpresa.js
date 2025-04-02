var express = require("express");
var router = express.Router();

var cadastroEmpresaController = require("../controllers/cadastroEmpresaController");

router.post("/cadastrarEmp", function (req, res) {
    cadastroEmpresaController.cadastrarEmp(req, res);
})

router.post("/cadastrarEnd", function (req, res) {
    cadastroEmpresaController.cadastrarEnd(req, res);
})

router.post("/cadastrarCol", function (req, res) {
    cadastroEmpresaController.cadastrarCol(req, res);
})


module.exports = router;