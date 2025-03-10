const e = require("cors");
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

async function cadastrarEmpresa(req, res) {
  var razaoSocial = req.body.razaoSocialServer;
  var numeroTin = req.body.numeroTinServer;
  var status = req.body.statusServer;
  var telefone = req.body.telefoneServer;
  var site = req.body.siteServer;

  var cep = req.body.cepServer;
  var logradouro = req.body.logradouroServer;
  var numero = req.body.numeroServer;
  var complemento = req.body.complementoServer;

  var nome = req.body.nomeServer;
  var cpf = req.body.cpfServer;
  var email = req.body.emailServer;
  var senha = req.body.senhaServer;

  if (!razaoSocial || !numeroTin || !status || !telefone || !site || !cep || !logradouro || !numero || !nome || !cpf || !email || !senha) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" });
  }

  let empresa;


  try {
    const isEmpresaExists = await empresaModel.buscarPorCnpj(numeroTin)

    if (isEmpresaExists.length > 0) {
      return res.status(401).json({ mensagem: `a empresa com o cnpj ${numeroTin} já existe` });
    }


    empresa = await empresaModel.cadastrarEmpresa(razaoSocial, numeroTin, status, telefone, site)
    await empresaModel.enviarEndereco(cep, logradouro, numero, complemento, empresa.insertId)
    await usuarioModel.cadastrar(nome, email, senha, 1, empresa.insertId)

    res.status(201).json({ mensagem: "Empresa cadastrada com sucesso" });
  } catch {
    if (empresa) {
      empresaModel.excluirEmpresa(empresa.insertId);
    }

    res.status(400).json("Erro de cadastro")
  }


}

module.exports = {
  buscarPorCnpj,
  buscarPorId,
  cadastrarEmpresa,
  listar,
};
