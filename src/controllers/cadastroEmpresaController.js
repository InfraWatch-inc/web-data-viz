var cadastroEmpresaModel = require("../models/cadastroEmpresaModel");

function cadastrarEmp(req, res){

    // Fixo apenas req.body."variavel"

var razaoSocial = req.body.variavel 
var numeroTin = req.body.variavel
var pais = req.body.variavel
var telefone = req.body.variavel
var site = req.body.variavel

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

var cep = req.body.variavel 
var logradouro = req.body.variavel
var bairro = req.body.variavel
var cidade = req.body.variavel
var estado = req.body.variavel
var numero = req.body.variavel
var complemento = req.body.variavel


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

    
var nome = req.body.variavel 
var email= req.body.variavel
var documento = req.body.variavel
var cargo = req.body.variavel
var senha = req.body.variavel
var tipoDocumento = req.body.variavel
var fkEmpresa = req.body.variavel

cadastroEmpresaModel.cadastrarColaborador(nome, email, documento, tipoDocumento, senha, fkEmpresa, cargo)
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
