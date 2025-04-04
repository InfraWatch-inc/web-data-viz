var cadastroEmpresaModel = require("../models/cadastroEmpresaModel");

function cadastrarEmp(req, res){

    // Fixo apenas req.body."variavel"

var razaoSocial = req.body.razaoSocialServer 
var numeroTin = req.body.numeroTinServer
var pais = req.body.paisServer
var telefone = req.body.telefoneServer
var site = req.body.siteServer

cadastroEmpresaModel.cadastrarEmp(razaoSocial, numeroTin, telefone, site, pais)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
}

function cadastrarEnd(req, res){

var cep = req.body.cepServer 
var logradouro = req.body.logradouroServer
var bairro = req.body.bairroServer
var cidade = req.body.cidadeServer
var estado = req.body.estadoServer
var numero = req.body.numeroServer
var complemento = req.body.complementoServer


cadastroEmpresaModel.cadastrarEnd(cep, logradouro, numero, bairro, cidade, estado, complemento)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    
}

function cadastrarCol(req, res){

    
var nome = req.body.nomeServer                    
var email= req.body.emailServer
var documento = req.body.cpfServer
var cargo = req.body.cargoServer
var senha = req.body.senhaServer
var tipoDocumento = req.body.tipoDocumentoServer
var fkEmpresa = req.body.variavel // ver como vai fazer

cadastroEmpresaModel.cadastrarCol(nome, email, documento, tipoDocumento, senha, fkEmpresa, cargo)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    
}

module.exports = {
    cadastrarEmp,
    cadastrarEnd,
    cadastrarCol
}
