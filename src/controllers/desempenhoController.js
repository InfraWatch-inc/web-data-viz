var desempenhoModel = require("../models/desempenhoModel");

function getChamado(req, res){
    desempenhoModel.getChamado().then(resposta => {
        res.status(200).json(resposta)

    }) 
}

module.exports = {
    getChamado
}