const express = require("express");
const router = express.Router();
const bucketOuroExterno = require('../controllers/bucketOuroExternoController')

router.get('/pegarJson/:key', bucketOuroExterno.fetchJsonFromS3)

module.exports = router