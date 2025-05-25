let alertasProcessamentoModel = require("../models/alertasProcessamentoModel");

function informacoesAlertas(req, res) {

    const idEmpresa = req.body.idEmpresa;
    const idEscolhaTempo = req.body.idEscolhaTemporal;
    
    console.log(idEmpresa, idEscolhaTempo);
    alertasProcessamentoModel.getInformacoesAlertas(idEmpresa, idEscolhaTempo)

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
    informacoesAlertas
}