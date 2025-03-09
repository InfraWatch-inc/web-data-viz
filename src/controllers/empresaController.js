var empresaModel = require("../models/empresaModel");
var usuarioModel = require("../models/usuarioModel");

function buscarPorCnpj(req, res) {
  var cnpj = req.query.cnpj;

  empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function listar(req, res) {
  empresaModel.listar().then((resultado) => {
    res.status(200).json(resultado);
  });
}

function buscarPorId(req, res) {
  var id = req.params.id;

  empresaModel.buscarPorId(id).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function cadastrarEmpresa(req, res) {
  var razaoSocial = req.body.razaoSocialServer;
  var numeroTin = req.body.numeroTinServer;
  var status = req.body.statusServer;
  var telefone = req.body.telefoneServer;
  var site = req.body.siteServer;

  var cep = req.body.cepServer;
  var logradouro = req.body.logradouroServer;
  var numero = req.body.numeroServer;
  var complemento = req.body.complementoServer;
  var fkEmpresa = req.body.fkEmpresaServer;

  var nome = req.body.nomeServer;
  var cpf = req.body.cpfServer;
  var email = req.body.emailServer;
  var senha = req.body.senhaServer;

  empresaModel.buscarPorCnpj(numeroTin).then((resultado) => {
    if (resultado.length > 0) {
      res
        .status(401)
        .json({ mensagem: `a empresa com o cnpj ${numeroTin} já existe` });
    } else {

      empresaModel.cadastrarEmpresa(razaoSocial, numeroTin, status, telefone, site).then((resultadoEmpresa) => {
        empresaModel.enviarEndereco(cep, logradouro, numero, complemento, fkEmpresa).then((resultadoEndereco) => {
        });
        usuarioModel.cadastrar(nome, cpf, email, senha,"admin", fkEmpresa).then((resultadoFuncionario) => {
          res.status(201).json(resultadoFuncionario);
        }).catch(function (){
          res.status(400).json("Erro de cadastro")
        });
      });
    }
  });
}

module.exports = {
  buscarPorCnpj,
  buscarPorId,
  cadastrarEmpresa,
  listar,
};
