const e = require("cors");
var empresaModel = require("../models/empresaModel");
var colaboradoresModel = require("../models/colaboradoresModel");

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

async function cadastrarEmp(req, res) {
  var razaoSocial = req.body.razaoSocialServer 
  var numeroTin = req.body.numeroTinServer
  var pais = req.body.paisServer
  var telefone = req.body.telefoneServer
  var site = req.body.siteServer

  var cep = req.body.cepServer 
  var logradouro = req.body.logradouroServer
  var bairro = req.body.bairroServer
  var cidade = req.body.cidadeServer
  var estado = req.body.estadoServer
  var numero = req.body.numeroServer
  var complemento = req.body.complementoServer

  var nome = req.body.nomeServer                    
  var email= req.body.emailServer
  var documento = req.body.documentoServer
  var cargo = req.body.cargoServer
  var senha = req.body.senhaServer
  var tipoDocumento = req.body.tipoDocumentoServer


  if (razaoSocial == undefined  || documento== undefined  || cargo== undefined  || tipoDocumento== undefined  || bairro== undefined  || cidade== undefined  || estado== undefined  || numeroTin== undefined  || pais== undefined  || telefone== undefined  || site== undefined  || cep== undefined  || logradouro== undefined  || numero== undefined  || nome== undefined  || email== undefined  || senha== undefined ) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" });
  }

  let empresa;


  try {
    const isEmpresaExists = await empresaModel.buscarPorCnpj(numeroTin)

    if (isEmpresaExists.length > 0) {
      return res.status(401).json({ mensagem: `a empresa com o cnpj ${numeroTin} já existe` });
    }

  
  
    empresa = await empresaModel.cadastrarEmp(razaoSocial, numeroTin, telefone, site, pais)
    await empresaModel.cadastrarEnd(cep, logradouro, numero, bairro, cidade, estado, complemento, empresa.insertId)
    await colaboradoresModel.cadastrarColaborador(nome, email, documento, cargo, senha, tipoDocumento, empresa.insertId)

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
  cadastrarEmp,
  listar,
};
