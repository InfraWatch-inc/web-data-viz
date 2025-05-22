let alertasProcessamentoModel = require("../models/alertasProcessamentoModel");

function getAlertasPorPeriodoTrimestral(req, res) {

    const idEmpresa = req.body.idEmpresa;

    alertasProcessamentoModel.getQtdAlertasPeriodoTrimestral(idEmpresa)

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

function getAlertasPorPeriodoSemestral(req, res) {

    const idEmpresa = req.body.idEmpresa;

    alertasProcessamentoModel.getQtdAlertasPeriodoSemestral(idEmpresa)

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

function getAlertasPorPeriodoAnual(req, res) {

    const idEmpresa = req.body.idEmpresa;

    alertasProcessamentoModel.getQtdAlertasPeriodoAnual(idEmpresa)

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


function getComponenteMaiorQtdAlertaCriticoTrimestral(req, res) {

     const idEmpresa = req.body.idEmpresa;

    alertasProcessamentoModel.getComponenteMaiorQtdAlertaCriticoTrimestral(idEmpresa)
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

function getComponenteMaiorQtdAlertaCriticoSemestral(req, res) {

     const idEmpresa = req.body.idEmpresa;

    alertasProcessamentoModel.getComponenteMaiorQtdAlertaCriticoSemestral(idEmpresa)
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

function getComponenteMaiorQtdAlertaCriticoAnual(req, res) {

     const idEmpresa = req.body.idEmpresa;

    alertasProcessamentoModel.getComponenteMaiorQtdAlertaCriticoAnual(idEmpresa)
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
    getComponenteMaiorQtdAlertaCriticoTrimestral,
    getComponenteMaiorQtdAlertaCriticoSemestral,
    getComponenteMaiorQtdAlertaCriticoAnual,
    getAlertasPorPeriodoTrimestral,
    getAlertasPorPeriodoSemestral,
    getAlertasPorPeriodoAnual   
}