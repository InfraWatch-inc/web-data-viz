let paginaAtual = 0;

let divPagina1 = document.getElementById('pagina1'); 
let divPagina2 = document.getElementById('pagina2');
let divPagina3 = document.getElementById('pagina3');
let divPagina4 = document.getElementById('pagina4');
let divPagina5 = document.getElementById('pagina5');

const divPaginas = [divPagina1, divPagina2, divPagina3, divPagina4, divPagina5];

const modal = document.getElementById('modal');

let informacoesCadastro = {
    empresa: {
        razaoSocialServer: '',
        numeroTinServer: '',
        paisServer: '',
        telefoneServer: '',
        siteServer: ''
    },
    endereco: {
        cepServer: '',
        logradouroServer: '',
        numeroServer: '',
        complementoServer: '',
        bairroServer: '',
        cidadeServer: '',
        estadoServer: ''
    },
    colaboradorResponsavel: {
        nomeServer: '',
        emailServer: '',
        tipoDocumentoServer: '',
        cpfServer: '',
        cargoServer: '',
        senhaServer: ''
    }
};

// todo aplicar os modais na validacao
function abrirModal(mensagem, isErro = true) {
    modal.showModal();
    msgModal.innerHTML = mensagem;

    msgModal.style.color = isErro ? 'red' : 'green';

    setTimeout(() => {
        modal.close();
    }, 3000);
}

function atualizarPagina(isAvancando) {
    divPaginas[paginaAtual].style.display = 'none';

    if (isAvancando) {
        paginaAtual++;
    } else {
        paginaAtual--;
    }

    divPaginas[paginaAtual].style.display = 'block';
}

function avancar() {
    if (eval('validarPagina' + (paginaAtual + 1) + '(true)')) {
        atualizarPagina(true);
        return;
    }
}

function voltar() {
    if (paginaAtual == 0) {
        return;
    }

    if (eval('validarPagina' + (paginaAtual + 1) + '(false)')) {
        atualizarPagina(false);
    }
}

function validarPagina1(isAvancando) {
    const razaoSocial = document.getElementById('iptRazaoSocial');
    const numeroIdentificacao = document.getElementById('iptNumeroIdentificacao');
    const pais = document.getElementById('slctPais');

    if (isAvancando) {
        if (Validar.validarCampoVazio(razaoSocial.value)) {
            abrirModal('Razão social inválida!', true);
            return false;
        }

        let siglaPais = pais.options[pais.selectedIndex].value;

        if (Validar.validarCampoVazio(numeroIdentificacao.value) || !Validar.validarDocumentoEmpresa(numeroIdentificacao.value, siglaPais)) {
            abrirModal('Número de identificação inválido!', true);
            return false;
        }

        informacoesCadastro.empresa.razaoSocialServer = razaoSocial.value;    
        informacoesCadastro.empresa.numeroTinServer = numeroIdentificacao.value;
        informacoesCadastro.empresa.paisServer = pais.value;
    } else {
        razaoSocial.value = informacoesCadastro.empresa.razaoSocialServer;
        numeroIdentificacao.value = informacoesCadastro.empresa.numeroTinServer;
        pais.value = informacoesCadastro.empresa.paisServer;
    }

    return true;
}

function validarPagina2(isAvancando) {
    const telefoneContato = document.getElementById('iptTelefoneContato');
    const siteEmpresa = document.getElementById('iptSiteEmpresa');
    const cep = document.getElementById('iptCep');
    const logradouro = document.getElementById('iptLogradouro');

    if (isAvancando) {
        if (Validar.validarCampoVazio(cep.value) || !Validar.validarCep(cep.value)) {
            abrirModal('CEP inválido!', true);
            return false;
        }

        if (Validar.validarCampoVazio(telefoneContato.value) || !Validar.validarTelefone(telefoneContato.value, informacoesCadastro.empresa.paisServer)) {
            abrirModal('Telefone inválido!', true);
            return false;
        }

        if (Validar.validarCampoVazio(siteEmpresa.value) || !Validar.validarSite(siteEmpresa.value)) {
            abrirModal('Site inválido!', true);
            return false;
        }

        if(Validar.validarCampoVazio(logradouro.value)) {
            abrirModal('Logradouro inválido!', true);
            return false;
        }

        informacoesCadastro.empresa.telefoneServer = telefoneContato.value;
        informacoesCadastro.empresa.siteServer = siteEmpresa.value;
        informacoesCadastro.endereco.cepServer = cep.value;
        informacoesCadastro.endereco.logradouroServer = logradouro.value;
    } else {
        telefoneContato.value = informacoesCadastro.empresa.telefoneServer;
        siteEmpresa.value = informacoesCadastro.empresa.siteServer;
        cep.value = informacoesCadastro.endereco.cepServer;
        logradouro.value = informacoesCadastro.endereco.logradouroServer;
    }

    return true;
}

function callbackCEP(conteudo) {
    if (!("erro" in conteudo)) {
        const logradouro = document.getElementById('iptLogradouro');
        const bairro = document.getElementById('iptBairro');
        const cidade = document.getElementById('iptCidade');
        const estado = document.getElementById('iptEstado');

        logradouro.value = conteudo.logradouro;
        informacoesCadastro.endereco.logradouroServer = conteudo.logradouro;

        bairro.value = conteudo.bairro;
        informacoesCadastro.endereco.bairroServer = conteudo.bairro;

        cidade.value = conteudo.localidade;
        informacoesCadastro.endereco.cidadeServer = conteudo.localidade;
        
        estado.value = conteudo.estado;
        informacoesCadastro.endereco.estadoServer = conteudo.estado;
    } else {
        abrirModal('CEP não encontrado!', true);
    }
}

function pesquisarCEP(cep) {
    var script = document.createElement('script');
    script.src = 'https://viacep.com.br/ws/' + cep + '/json/?callback=callbackCEP';
    document.body.appendChild(script);
}

function validarPagina3(isAvancando) {
    const numeroContato = document.getElementById('iptNumeroContato');
    const complemento = document.getElementById('iptComplemento');
    const bairro = document.getElementById('iptBairro');
    const cidade = document.getElementById('iptCidade');
    const estado = document.getElementById('iptEstado');
 
    if (isAvancando) {
        if (Validar.validarCampoVazio(numeroContato.value)) {
            abrirModal('Número inválido!', true);
            return false;
        }

        if (Validar.validarCampoVazio(bairro.value)) {
            abrirModal('Bairro inválido!', true);
            return false;
        }

        if (Validar.validarCampoVazio(cidade.value)) {
            abrirModal('Cidade inválida!', true);
            return false;
        }

        if (Validar.validarCampoVazio(estado.value)) {
            abrirModal('Estado inválido!', true);
            return false;
        }   

        informacoesCadastro.endereco.numeroServer = Number(numeroContato.value);
        informacoesCadastro.endereco.complementoServer = complemento.value;
        informacoesCadastro.endereco.bairroServer = bairro.value;
        informacoesCadastro.endereco.cidadeServer = cidade.value;
        informacoesCadastro.endereco.estadoServer = estado.value;
    } else {
        numeroContato.value = informacoesCadastro.endereco.numeroServer;
        complemento.value = informacoesCadastro.endereco.complementoServer;
        bairro.value = informacoesCadastro.endereco.bairroServer;
        cidade.value = informacoesCadastro.endereco.cidadeServer;
        estado.value = informacoesCadastro.endereco.estadoServer;
    }

    return true;
}

function validarPagina4(isAvancando) {
    const nome = document.getElementById('iptNome');
    const email = document.getElementById('iptEmail');
    const tipoDocumento = document.getElementById('slctTipoDocumento');
    const numeroDocumento = document.getElementById('iptNumeroDocumento');

    if (isAvancando) {
        if (Validar.validarCampoVazio(nome.value)) {
            abrirModal('Nome inválido!', true);
            return false;
        }

        if (Validar.validarCampoVazio(email.value)) {
            abrirModal('Email inválido!', true);
            return false;
        }

        if (Validar.validarCampoVazio(numeroDocumento.value) || !Validar.validarDocumentoPessoa(numeroDocumento.value, informacoesCadastro.empresa.paisServer)) {
            abrirModal('Número de documento inválido!', true);
            return false;
        }

        informacoesCadastro.colaboradorResponsavel.nomeServer = nome.value;
        informacoesCadastro.colaboradorResponsavel.emailServer = email.value;
        informacoesCadastro.colaboradorResponsavel.tipoDocumentoServer = tipoDocumento.value;
        informacoesCadastro.colaboradorResponsavel.documentoServer = numeroDocumento.value;
    } else {
        nome.value = informacoesCadastro.colaboradorResponsavel.nome;
        email.value = informacoesCadastro.colaboradorResponsavel.email;
        tipoDocumento.value = informacoesCadastro.colaboradorResponsavel.tipoDocumento;
        numeroDocumento.value = informacoesCadastro.colaboradorResponsavel.documento;
        cargo.value = informacoesCadastro.colaboradorResponsavel.cargo;
        senha.value = informacoesCadastro.colaboradorResponsavel.senha;
    }

    return true;
}

function validarPagina5(isAvancando) {
    const cargo = document.getElementById('iptCargo');
    const senha = document.getElementById('iptSenha');
    const confirmacaoSenha = document.getElementById('iptConfirmacaoSenha');

    if (isAvancando) {
        if (Validar.validarCampoVazio(cargo.value)) {
            abrirModal('Cargo inválido!', true);
            return false;
        }

        if (Validar.validarCampoVazio(senha.value) || !Validar.validarSenha(senha.value)) {
            abrirModal('Senha inválida!', true);
            return false;
        }

        if (Validar.validarCampoVazio(confirmacaoSenha.value)) {
            abrirModal('Confirmação de senha inválida!', true);
            return false;
        }

        if (senha.value != confirmacaoSenha.value) {
            abrirModal('Senhas não conferem!', true);
            return false;
        }

        informacoesCadastro.colaboradorResponsavel.cargoServer = cargo.value;
        informacoesCadastro.colaboradorResponsavel.senhaServer = senha.value;
        informacoesCadastro.colaboradorResponsavel.confirmacaoSenhaServer = confirmacaoSenha.value;
    } else {
        cargo.value = informacoesCadastro.colaboradorResponsavel.cargo;
        senha.value = informacoesCadastro.colaboradorResponsavel.senha;
        confirmacaoSenha.value = informacoesCadastro.colaboradorResponsavel.confirmacaoSenha;
    }

    return true;
}

function cadastrar() {
    console.log('Informacoes do Cadastro:', informacoesCadastro);
    fetch("/empresas/cadastrarEmpresa", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(informacoesCadastro),
    })
    .then(function (resposta) {
        console.log("resposta: ", resposta);

        if (resposta.ok) {
            abrirModal("Cadastro realizado com sucesso! Redirecionando para tela de Login...", false);

            setTimeout(() => {
                window.location = "login.html";
            }, 2000);
        } else {
            abrirModal(resposta.mensagem, false);
        }
    })
    .catch(function (resposta) {
        abrirModal(resposta.mensagem, false);
    });

    return false;
}
