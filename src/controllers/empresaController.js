var empresaModel = require("../models/empresaModel");

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
  var fkEndereco = req.body.idEnderecoSede;

  empresaModel.buscarPorCnpj(razaoSocial).then((resultado) => {
    if (resultado.length > 0) {
      res
        .status(401)
        .json({ mensagem: `a empresa com o cnpj ${razaoSocial} já existe` });
    } else {
      empresaModel.cadastrarEmpresa(razaoSocial, numeroTin, status, telefone, site, fkEndereco).then((resultado) => {
        res.status(201).json(resultado);
      });
    }
  });
}

function enviarEndereco(req, res){
  var cep = req.body.cepServer;
  var logradouro = req.body.logradouroServer;
  var numero = req.body.numeroServer;
  var complemento = req.body.complementoServer;

  empresaModel.enviarEndereco(cep, logradouro, numero, complemento).then((resultado) => {
    res.status(201).json(resultado);
  });

}

module.exports = {
  buscarPorCnpj,
  buscarPorId,
  cadastrarEmpresa,
  enviarEndereco,
  listar,
};
