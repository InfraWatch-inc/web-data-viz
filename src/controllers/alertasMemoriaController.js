let alertasMemoriaModel = require("../models/alertasMemoriaModel");

function getAlertasPeriodo(req, res) {

    const idEmpresa = req.query.idEmpresa;


    console.log("idEmpresa");
    console.log(idEmpresa);

    alertasMemoriaModel.getAlertasPeriodo(idEmpresa)

        .then(
            function (resultado) {
                res.json(resultado);
                console.log("resultado")
                console.log(resultado)
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

    const idEmpresa = req.query.idEmpresa;

    alertasMemoriaModel.getAlertasDisco(idEmpresa)
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

function getKpiTotalRam(req, res) {

    const idEmpresa = req.query.idEmpresa;

    alertasMemoriaModel.getKpiTotalRam(idEmpresa)
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

function getKpiTotalDisc(req, res) {

    const idEmpresa = req.query.idEmpresa;

    alertasMemoriaModel.getKpiTotalDisc(idEmpresa)
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
    getAlertasPeriodo,
    getKpiTotalDisc,
    getKpiTotalRam
}