let colaboradoresModel = require("../models/colaboradoresModel");

function postAutenticar(req, res){
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else {
        colaboradoresModel.autenticar(email, senha)
        .then((resultado) => {
            if (resultado.length > 0) {
                res.json(resultado[0]);
            } else {
                res.status(403).send("Email e/ou senha inválidos.");
            }
        })
        .catch((erro) => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
    }
}

function postCadastrarColaborador(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var documento = req.body.documentoServer;
    var cargo = req.body.cargoServer;
    var senha = req.body.senhaServer;
    var tipoDocumento = req.body.tipoDocumentoServer;
    var fkEmpresa = req.body.fkEmpresaServer;

    if (nome == undefined || email == undefined || documento == undefined || cargo == undefined || senha == undefined || tipoDocumento == undefined || fkEmpresa == undefined) {
        res.status(400).send("Todos os campos são obrigatórios!");
    } else {
        colaboradoresModel.cadastrarColaborador(nome, email, documento, cargo, senha, tipoDocumento, fkEmpresa)
        .then((resultado) => {
            res.json(resultado);
        })
        .catch((erro) => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
    }
}

function getColaboradores(req , res){
    colaboradoresModel.getColaboradores()
    .then((resultado) => {
        res.status(200).json(resultado);
    })
    .catch((erro) => {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    })
}

function getColaboradorId(req, res){
    colaboradoresModel.getColaboradorId(req.params.id)
    .then((resultado) => {
        res.status(200).json(resultado);
    })
    .catch((erro) => {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    })
}

module.exports = {
    postAutenticar,
    getColaboradores,
    getColaboradorId,
    postCadastrarColaborador
};