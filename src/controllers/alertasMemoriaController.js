let alertasMemoriaModel = require("../models/alertasMemoriaModel");

function getAlertasPeriodo(req, res) {
    alertasMemoriaModel.getAlertasPeriodo()

        .then(
            function (resultado) {
                res.json(resultado);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao buscar dados do usuario ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}


function getAlertasDisco(req, res) {
    alertasMemoriaModel.getAlertasDisco()
        .then(
            function (resultado) {
                res.json(resultado);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao buscar dados do usuario ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}

module.exports = {
    getAlertasDisco,
    getAlertasPeriodo
}