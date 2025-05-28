var express = require('express');
var router = express.Router();
var multer = require('multer');

const suporteController = require('../controllers/suporteController');

// Armazanando na Ram como um buffer.
var storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 *1024 *1024 // até 10 MB
    }
});

router.post('/chamados', upload.single('anexo'), (req, res) => {
    suporteController.criarChamado(req, res);
});


module.exports = router;