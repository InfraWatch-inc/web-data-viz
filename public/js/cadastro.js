let paginaAtual = 0;

const divPagina1 = document.getElementById('pagina1'); 
const divPagina2 = document.getElementById('pagina2');
const divPagina3 = document.getElementById('pagina3');
const divPagina4 = document.getElementById('pagina4');
const divPagina5 = document.getElementById('pagina5');

const divPaginas = [divPagina1, divPagina2, divPagina3, divPagina4, divPagina5];

const modal = document.getElementById('modal');
let isCEPValido = false;

let informacoesCadastro = {
    empresa: {
        razaoSocial: '',
        numeroIdentificacao: '',
        pais: '',

        telefoneContato: '',
        siteEmpresa: ''
    },
    endereco: {
        cep: '',
        logradouro: '',

        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: ''
    },
    colaboradorResponsavel: {
        nome: '',
        email: '',
        tipoDocumento: '',
        documento: '',

        cargo: '',
        senha:''
    }
}

function atualizarPagina(isAvancando) {
    divPaginas[paginaAtual].style.display = 'none';
    if (isAvancando) {
        paginaAtual++;
        
        if (paginaAtual == 2 && isCEPValido) {
            const bairro = document.getElementById('iptBairro');
            const cidade = document.getElementById('iptCidade');
            const estado = document.getElementById('iptEstado');

            bairro.value = informacoesCadastro.endereco.bairro;
            cidade.value = informacoesCadastro.endereco.cidade;
            estado.value = informacoesCadastro.endereco.estado;
            isCEPValido = false;
        }

    } else {
        paginaAtual--;
    }
    divPaginas[paginaAtual].style.display = 'block';
}

function avancar(){
    if(paginaAtual == 4) {
        // popar modal de erro
        return;
    }

    if(paginaAtual == 1 && isCEPValido) {   
        isCEPValido = true;
    }

    if(eval('validarPagina' + (paginaAtual + 1) + '(true)')) {
        atualizarPagina(true);
        return;
    }

    // popar modal de erro
}

function voltar(){
    if(paginaAtual == 0) {
        // popar modal de erro
        return;
    }

    if(eval('validarPagina' + (paginaAtual + 1) + '(false)')) {
        atualizarPagina(false);
    }
}

function validarPagina1(isAvancando) {
    const razaoSocial = document.getElementById('iptRazaoSocial');
    const numeroIdentificacao = document.getElementById('iptNumeroIdentificacao');
    const pais = document.getElementById('scltPais');

    if (isAvancando) {
        // valida razao social
        if (razaoSocial.value == '') {
            // popar modal de erro
            return false;
        }
            
        if (numeroIdentificacao.value == '') {
            // popar modal de erro
            return false;
        }

        if (pais.value == '' || pais.value == 'na') {
            // popar modal erro
            return false;
        }
        let validarNumeroIdentificacao = TaxpayerIdentificationValidator(numeroIdentificacao.value, pais.value);

        if (!validarNumeroIdentificacao.validate()) {
            // popar modal de erro
            return false;
        }

        informacoesCadastro.empresa.razaoSocial = razaoSocial.value;    
        informacoesCadastro.empresa.numeroIdentificacao = numeroIdentificacao.value;
        informacoesCadastro.empresa.pais = pais.value;

        return true;
    } else {
        razaoSocial.value = informacoesCadastro.empresa.razaoSocial;
        numeroIdentificacao.value = informacoesCadastro.empresa.numeroIdentificacao;
        pais.value = informacoesCadastro.empresa.pais;
    }
}

function validarPagina2(isAvancando) {
    const telefoneContato = document.getElementById('iptTelefoneContato');
    const siteEmpresa = document.getElementById('iptSiteEmpresa');
    const cep = document.getElementById('iptCep');
    const logradouro = document.getElementById('iptLogradouro');

    const telefoneContatoRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    const siteEmpresaRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}([\/\w \.-]*)*\/?$/;

    // todo
}

function validarPagina3(isAvancando) {
    const numeroContato = document.getElementById('iptNumeroContato');
    const complemento = document.getElementById('iptComplemento');
    const bairro = document.getElementById('iptBairro');
    const cidade = document.getElementById('iptCidade');
    const estado = document.getElementById('iptEstado');

    if(isAvancando){
        

        
        
    } else {
        cep.value = informacoesCadastro.endereco.cep;
        logradouro.value = informacoesCadastro.endereco.logradouro;
        numeroContato.value = informacoesCadastro.endereco.numero;
        complemento.value = informacoesCadastro.endereco.complemento;
        bairro.value = informacoesCadastro.endereco.bairro;
        cidade.value = informacoesCadastro.endereco.cidade;
        estado.value = informacoesCadastro.endereco.estado;
    }
    
    // todo
}

function validarPagina4(isAvancando) {
    const nome = document.getElementById('iptNome');
    const email = document.getElementById('iptEmail');
    const tipoDocumento = document.getElementById('scltTipoDocumento');
    const numeroDocumento = document.getElementById('iptNumeroDocumento');

    if(isAvancando){
        // todo
    } else {
        nome.value = informacoesCadastro.colaboradorResponsavel.nome;
        email.value = informacoesCadastro.colaboradorResponsavel.email;
        tipoDocumento.value = informacoesCadastro.colaboradorResponsavel.tipoDocumento;
        numeroDocumento.value = informacoesCadastro.colaboradorResponsavel.documento;
        cargo.value = informacoesCadastro.colaboradorResponsavel.cargo;
        senha.value = informacoesCadastro.colaboradorResponsavel.senha;
    }
}

function validarPagina5(isAvancando){
    const cargo = document.getElementById('iptCargo');
    const senha = document.getElementById('iptSenha');
    const confirmacaoSenha = document.getElementById('iptConfirmacaoSenha');

    if(isAvancando){
        // todo
    } else {
        cargo.value = informacoesCadastro.colaboradorResponsavel.cargo;
        senha.value = informacoesCadastro.colaboradorResponsavel.senha;
        confirmacaoSenha.value = informacoesCadastro.colaboradorResponsavel.confirmacaoSenha;
    }
}

function cadastrar() {
    // TODO: Implementar a lógica de cadastro
    // aguardar();

    //Recupere o valor da nova input pelo nome do id
    // Agora vá para o método fetch logo abaixo
    var nomeVar = nome_input.value;
    var emailVar = email_input.value;
    var senhaVar = senha_input.value;
    var confirmacaoSenhaVar = confirmacao_senha_input.value;
    var codigoVar = codigo_input.value;
    var idEmpresaVincular

    // Verificando se há algum campo em branco
    if (
      nomeVar == "" ||
      emailVar == "" ||
      senhaVar == "" ||
      confirmacaoSenhaVar == "" ||
      codigoVar == ""
    ) {
      cardErro.style.display = "block";
      mensagem_erro.innerHTML =
        "(Mensagem de erro para todos os campos em branco)";

      finalizarAguardar();
      return false;
    } else {
      setInterval(sumirMensagem, 5000);
    }

    // Verificando se o código de ativação é de alguma empresa cadastrada
    for (let i = 0; i < listaEmpresasCadastradas.length; i++) {
      if (listaEmpresasCadastradas[i].codigo_ativacao == codigoVar) {
        idEmpresaVincular = listaEmpresasCadastradas[i].id
        console.log("Código de ativação válido.");
        break;
      } else {
        cardErro.style.display = "block";
        mensagem_erro.innerHTML = "(Mensagem de erro para código inválido)";
        finalizarAguardar();
      }
    }

    // Enviando o valor da nova input
    fetch("/usuarios/cadastrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // crie um atributo que recebe o valor recuperado aqui
        // Agora vá para o arquivo routes/usuario.js
        nomeServer: nomeVar,
        emailServer: emailVar,
        senhaServer: senhaVar,
        idEmpresaVincularServer: idEmpresaVincular
      }),
    })
      .then(function (resposta) {
        console.log("resposta: ", resposta);

        if (resposta.ok) {
          cardErro.style.display = "block";

          mensagem_erro.innerHTML =
            "Cadastro realizado com sucesso! Redirecionando para tela de Login...";

          setTimeout(() => {
            window.location = "login.html";
          }, "2000");

          limparFormulario();
          finalizarAguardar();
        } else {
          throw "Houve um erro ao tentar realizar o cadastro!";
        }
      })
      .catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
        finalizarAguardar();
      });

    return false;
  }

  // Listando empresas cadastradas 
  function listar() {
    fetch("/empresas/listar", {
      method: "GET",
    })
      .then(function (resposta) {
        resposta.json().then((empresas) => {
          empresas.forEach((empresa) => {
            listaEmpresasCadastradas.push(empresa);

            console.log("listaEmpresasCadastradas")
            console.log(listaEmpresasCadastradas[0].codigo_ativacao)
          });
        });
      })
      .catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
      });
  }

  function sumirMensagem() {
    cardErro.style.display = "none";
  }