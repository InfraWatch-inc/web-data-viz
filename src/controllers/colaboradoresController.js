let colaboradoresModel = require("../models/colaboradoresModel");

function postAutenticar(req, res){
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else {
        colaboradoresModel.postAutenticar(email, senha)
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

function postColaborador(req, res) {
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
        colaboradoresModel.postColaborador(nome, email, documento, cargo, senha, tipoDocumento, fkEmpresa)
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

function getColaborador(req, res){
    colaboradoresModel.getColaborador(req.params.id)
    .then((resultado) => {
        res.status(200).json(resultado);
    })
    .catch((erro) => {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    })
}

function putColaborador(req, res){
    let idColaborador = req.params.id;
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var documento = req.body.documentoServer;
    var cargo = req.body.cargoServer;
    var senha = req.body.senhaServer;
    var tipoDocumento = req.body.tipoDocumentoServer;

    if (idColaborador == undefined || nome == undefined || email == undefined || documento == undefined || cargo == undefined || senha == undefined || tipoDocumento == undefined) {
        return res.status(400).send("Informação indefinido!");
    }

    colaboradoresModel.putColaborador(idColaborador, nome, email, documento, cargo, senha, tipoDocumento, fkEmpresa)
    .then((resultado) => {
        resultado.json()
        .then(res.status(200).json({"message":"Usuário atualizado com sucesso"}))        
    })
    .catch(res.status(500).json("Não foi possível atualizar usuário"))
}

function deleteColaborador(req, res){
    let idColaborador = req.params.id;

    if (idColaborador == undefined) {
        return res.status(400).send("Informação indefinido!");
    }

    colaboradoresModel.deleteColaborador(idColaborador)
    .then((resultado) => {
        resultado.json()
        .then(res.status(200).json({"message":"Usuário deletado com sucesso"}))        
    })
    .catch(res.status(500).json("Usuário não existe no sistema"))
}

module.exports = {
    postAutenticar,
    getColaboradores,
    getColaborador,
    postColaborador,
    putColaborador,
    deleteColaborador
};