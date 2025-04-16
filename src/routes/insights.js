var express = require("express");
var router = express.Router();

var insightsController = require("../controllers/insightsController");

router.get("/alertasComponentes", function (req, res) {
    insightsController.getAlertasComponentes(req, res);
});

router.post("/dadosComponente/:componente", function (req, res) {
    insightsController.postInsightsComponente(req, res);
});

module.exports = router;