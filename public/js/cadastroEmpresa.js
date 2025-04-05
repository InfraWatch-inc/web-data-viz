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
    }, 300);
}

function atualizarPagina(isAvancando) {
    divPaginas[paginaAtual].style.display = 'none';

    if (isAvancando) {
        paginaAtual++;

        if (paginaAtual == 2 && isCEPValido) {
            const bairro = document.getElementById('iptBairro');
            const cidade = document.getElementById('iptCidade');
            const estado = document.getElementById('iptEstado');

            bairro.value = informacoesCadastro.endereco.bairroServer;
            cidade.value = informacoesCadastro.endereco.cidadeServer;
            estado.value = informacoesCadastro.endereco.estadoServer;
            isCEPValido = false;
        }
    } else {
        paginaAtual--;
    }

    divPaginas[paginaAtual].style.display = 'block';
}

function avancar() {
    if (paginaAtual == 4) {
        return;
    }

    if (paginaAtual == 1 && isCEPValido) {
        isCEPValido = true;
    }

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
    const pais = document.getElementById('scltPais');

    if (isAvancando) {
        if (razaoSocial.value == '' || numeroIdentificacao.value == '' || pais.value == '' || pais.value == 'na') {
            return false;
        }

        let validarNumeroIdentificacao = TaxpayerIdentificationValidator(numeroIdentificacao.value, pais.value);
        if (!validarNumeroIdentificacao.validate()) {
            return false;
        }

        informacoesCadastro.empresa.razaoSocialServer = razaoSocial.value;    
        informacoesCadastro.empresa.numeroTinServer = numeroIdentificacao.value;
        informacoesCadastro.empresa.paisServer = pais.value;

        return true;
    } else {
        razaoSocial.value = informacoesCadastro.empresa.razaoSocialServer;
        numeroIdentificacao.value = informacoesCadastro.empresa.numeroTinServer;
        pais.value = informacoesCadastro.empresa.paisServer;
    }
}

function validarPagina2(isAvancando) {
    const telefoneContato = document.getElementById('iptTelefoneContato');
    const siteEmpresa = document.getElementById('iptSiteEmpresa');
    const cep = document.getElementById('iptCep');
    const logradouro = document.getElementById('iptLogradouro');

    const telefoneContatoRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    const siteEmpresaRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}([\/\w \.-]*)*\/?$/;
    const validaCEP = /^[0-9]{8}$/;

    if (isAvancando) {
        if (cep.value == "" || !validaCEP.test(cep.value)) {
            return false;
        }

        pesquisarCEP(cep.value);
    } else {
        // todo
    }

    return true;
}

function callbackCEP(conteudo) {
    if (!("erro" in conteudo)) {
        const logradouro = document.getElementById('iptLogradouro');

        logradouro.value = conteudo.logradouro;
        informacoesCadastro.endereco.logradouroServer = conteudo.logradouro;
        informacoesCadastro.endereco.bairroServer = conteudo.bairro;
        informacoesCadastro.endereco.cidadeServer = conteudo.localidade;
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
        // todo validar campos
    } else {
        cep.value = informacoesCadastro.endereco.cepServer;
        logradouro.value = informacoesCadastro.endereco.logradouroServer;
        numeroContato.value = informacoesCadastro.endereco.numeroServer;
        complemento.value = informacoesCadastro.endereco.complementoServer;
        bairro.value = informacoesCadastro.endereco.bairroServer;
        cidade.value = informacoesCadastro.endereco.cidadeServer;
        estado.value = informacoesCadastro.endereco.estadoServer;
    }

    // todo
}

function validarPagina4(isAvancando) {
    const nome = document.getElementById('iptNome');
    const email = document.getElementById('iptEmail');
    const tipoDocumento = document.getElementById('scltTipoDocumento');
    const numeroDocumento = document.getElementById('iptNumeroDocumento');

    if (isAvancando) {
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

function validarPagina5(isAvancando) {
    const cargo = document.getElementById('iptCargo');
    const senha = document.getElementById('iptSenha');
    const confirmacaoSenha = document.getElementById('iptConfirmacaoSenha');

    if (isAvancando) {
        // todo
    } else {
        cargo.value = informacoesCadastro.colaboradorResponsavel.cargo;
        senha.value = informacoesCadastro.colaboradorResponsavel.senha;
        confirmacaoSenha.value = informacoesCadastro.colaboradorResponsavel.confirmacaoSenha;
    }
}

function cadastrar() {
    fetch("/empresas/cadastrarEmpresas", {
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
