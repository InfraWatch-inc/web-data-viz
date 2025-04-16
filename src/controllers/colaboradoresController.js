let colaboradoresModel = require("../models/colaboradoresModel");

function validarCampos(res, corpoReq) {
    let isValido = true;
    let campos = ["nomeServer", "emailServer", "documentoServer", "cargoServer", "senhaServer", "tipoDocumentoServer", "nivelServer"];

    campos.forEach((campo) => {
        if (corpoReq[campo] == undefined) { 
            res.status(400).send(`Campo ${campo} está undefined!`);
            isValido = false;
        }
    });

    return isValido;
}

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
    if(!validarCampos(res, req.body)){
        return;
    }

    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var documento = req.body.documentoServer;
    var cargo = req.body.cargoServer;
    var senha = req.body.senhaServer;
    var tipoDocumento = req.body.tipoDocumentoServer;
    var fkEmpresa = req.body.fkEmpresaServer;
    var nivel = req.body.nivelServer;

    if (fkEmpresa == undefined) {
        res.status(400).send("fkEmpresa está undefined!");
    }

    colaboradoresModel.postColaborador(nome, email, documento, cargo, senha, tipoDocumento, fkEmpresa, nivel)
    .then((resultado) => {
        return res.status(200).json(resultado);
    })
    .catch((erro) => {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

function getColaboradores(req , res){
    let idEmpresa = req.params.idEmpresa;
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
    if(!validarCampos(res, req.body)){
        return;
    }

    let idColaborador = req.params.id;
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var documento = req.body.documentoServer;
    var cargo = req.body.cargoServer;
    var senha = req.body.senhaServer;
    var tipoDocumento = req.body.tipoDocumentoServer;
    var nivel = req.body.nivelServer;

    colaboradoresModel.putColaborador(idColaborador, nome, email, documento, cargo, senha, tipoDocumento, nivel)
    .then((resultado) => {
        return res.status(200).json("Usuário atualizado com sucesso");     
    })
    .catch(() => {
        res.status(500).json("Não foi possível atualizar usuário");
    })
}

function deleteColaborador(req, res){
    let idColaborador = req.params.id;

    if (idColaborador == undefined) {
        return res.status(400).send("idColaborador indefinido!");
    }

    // TODO problema de fk constrint do fkResponsavel - setar fkEmpresa e fkResponsavel como null
    colaboradoresModel.deleteColaborador(idColaborador)
    .then((resultado) => {
        resultado.json()
        .then(() => {
            return res.status(200).json({"message":"Usuário deletado com sucesso"})
        })        
    })
    .catch((erro) => {
        console.log(erro);
        return res.status(500).json("Usuário não existe no sistema");
    })
}

module.exports = {
    postAutenticar,
    getColaboradores,
    getColaborador,
    postColaborador,
    putColaborador,
    deleteColaborador
};