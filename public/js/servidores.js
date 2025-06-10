const pesquisa = document.querySelector('.input');
const btnDropdown = document.querySelector('.dropdown-status');
const menuDropdown = document.querySelector('.dropdown-menu');
const filtroItemRamDisco = document.querySelector('.componenteArmazenamento');
const filtroItemCpuGpu = document.querySelector('.componenteProcessos');
const corpoTabela = document.getElementById('corpo-tabela');

const LIMITE_CRITICO_CPU = 80;    // Exemplo: % de uso CPU crítico
const LIMITE_MODERADO_CPU = 60;   // Exemplo: % de uso CPU moderado
const LIMITE_CRITICO_GPU = 85;    // Exemplo: % de uso GPU crítico
const LIMITE_MODERADO_GPU = 65;    // Exemplo: % de uso GPU crítico
const LIMITE_CRITICO_RAM = 90;    // Exemplo: % de uso RAM crítico
const LIMITE_MODERADO_RAM = 75;   // Exemplo: % de uso RAM moderado
const LIMITE_CRITICO_DISCO = 90;  // Exemplo: % de uso Disco crítico
const LIMITE_MODERADO_DISCO = 75; // Exemplo: % de uso Disco moderado

let estadoComponentesAtual = sessionStorage.getItem('estadoComponentesAtual') || 'cpu_gpu' // Estado inicial
let countAlertaCritico, countAlertaModerado, countAlerta;
let servidores;
let geralServidores;
let chamados;
let nucleoCpu = 4;
let threadsCpu = 8;
let termoBuscaAtual = "";
let globalAlertCriticoCount, globalAlertModeradoCount, globalAlertTotalCount
let mensagensAtuais = [];

function conversorGB(bytes) {
  if (bytes === null || bytes === undefined) return "-";
  let gb = parseFloat(bytes) / (1024 * 1024 * 1024);
  return gb.toFixed(2);
}

function formatarPorcentagem(valor) {
  if (valor === null || valor === undefined) return "-";
  return parseFloat(valor).toFixed(1);
}

function atualizarDados() {
  globalAlertCriticoCount = 0;
  globalAlertModeradoCount = 0;
  globalAlertTotalCount = 0;

  let idEmpresa = sessionStorage.getItem("ID_EMPRESA");

  if (idEmpresa) {
    try {
      fetch(`/monitoramento/listagem/${idEmpresa}`)
        .then(resposta => {
          if (!resposta.ok) {
            console.log("Erro ao buscar os dados.");
            return;
          }
          return resposta.json();
        })
        .then(data => {
          console.log("Dados recebidos do Servidor: ", data);

          servidores = data;

          if (Array.isArray(servidores)) {
            renderizarTabelaComCabecalhos(); // Renderiza a tabela com os cabeçalhos corretos
            if (estadoComponentesAtual === 'cpu_gpu') {
              listagemBodyCpuGpu(); // Chama a função específica para CPU/GPU
            } else if (estadoComponentesAtual === 'ram_disco') {
              listagemBodyRamDisco(); // Chama a função específica para RAM/Disco
            }
          } else {
            console.log("Servidor não encontrado.")
          }
        })
        .catch(error => {
          console.error("Erro ao obter os dados: ", error);
        });
    } catch (error) {
      console.error("Erro ao obter os dados: ", error);
    }
  } else {
    console.log("ID da empresa não encontrado no sessionStorage.");
  }

  fetch(`/monitoramento/coletar/dados`)
    .then(resposta => {
      if (!resposta.ok) throw new Error("Resposta não OK");
      return resposta.json();
    })
    .then(data => {
      console.log("Dados recebidos do Servidor: ", data);
      geralServidores = data;
      if (Array.isArray(servidores) && servidores.length > 0 && geralServidores) {
        renderizarTabelaComCabecalhos(); // Renderiza a tabela com os cabeçalhos corretos
        if (estadoComponentesAtual === 'cpu_gpu') {
          listagemBodyCpuGpu(); // Chama a função específica para CPU/GPU
        } else if (estadoComponentesAtual === 'ram_disco') {
          listagemBodyRamDisco(); // Chama a função específica para RAM/Disco
        }
      } else {
        corpoTabela.innerHTML = `<tr><td colspan="8" style="text-align:center;">Nenhum servidor encontrado.</td></tr>`;
      }
    })
    .catch(error => {
      console.error("Erro ao obter os dados: ", error);
    });

  fetch("/monitoramento/coletar/chamados")
    .then(resposta => {
      if (!resposta.ok) throw new Error("Resposta não OK");
      return resposta.json();
    })
    .then(data => {
      console.log("Dados de chamados recebidos do Servidor: ", data);
      chamados = data;
      const mensagensParaExibir = chamados.slice(0, 5);
      atualizarModalAlertas(mensagensParaExibir);
    })
};

// Função que carrega o cabeçalho da tabela.
function renderizarTabelaComCabecalhos() {
  let tabelaHeadRow = document.querySelector('#tabela thead tr'); // linha do cabeçalho da tabela.

  corpoTabela.innerHTML = ""; // Limpa o corpo da tabela antes de qualquer coisa

  if (estadoComponentesAtual === 'cpu_gpu') {
    tabelaHeadRow.innerHTML = `
            <th>ID</th>
            <th>Nome</th>
            <th>Núcleos</th>
            <th>Threads</th>
            <th>Qtd. GPU</th>
            <th>Temp. GPU</th>
            <th>Uso GPU</th>
            <th>Uso CPU</th>
        `;
    if (servidores && geralServidores) listagemBodyCpuGpu();
  } else if (estadoComponentesAtual === 'ram_disco') {
    tabelaHeadRow.innerHTML = `
            <th>ID</th>
            <th>Nome</th>
            <th>RAM Total (GB)</th>
            <th>RAM Uso (GB)</th>
            <th>RAM %</th>
            <th>Disco Total (GB)</th>
            <th>Disco Uso (GB)</th>
            <th>Disco %</th>
        `;
    if (servidores && geralServidores) listagemBodyRamDisco();
  }
  atualizarVisibilidadeFiltros();
}


function isServidorVazio(servidor){
  const gpu = servidor.qtdGpu ?? 0;
  const cpu = servidor.qtdCpu ?? 0;
  const ramUso = servidor.ramUsoBytes ?? 0;
  const hdUso = servidor.hdUsoBytes ?? 0;
  return gpu === 0 && cpu === 0 && ramUso === 0 && hdUso === 0;
}


// function compararServidores(valorComponenteA, valorComponenteB) {
//   const aVazio = isServidorVazio(valorComponenteA);
//   const bVazio = isServidorVazio(valorComponenteB);

//   if (!aVazio && bVazio) {
//     return -1; // A (não-vazio) é preferível a B (vazio). A deve vir antes.
//   }
//   if (aVazio && !bVazio) {
//     return 1;  // B (não-vazio) é preferível a A (vazio). B deve vir antes.
//   }

//   let gpuA = valorComponenteA.qtdGpu ?? 0;
//   let gpuB = valorComponenteB.qtdGpu ?? 0;
//   if (gpuB !== gpuA) return gpuB - gpuA; // Ordena pelo valor de uso da GPU 

//   let cpuA = valorComponenteA.qtdCpu ?? 0;
//   let cpuB = valorComponenteB.qtdCpu ?? 0;
//   if (cpuB !== cpuA) return cpuB - cpuA; // Ordena pelo valor de uso da CPU

//   let ramA = valorComponenteA.ramUsoBytes ?? 0;
//   let ramB = valorComponenteB.ramUsoBytes ?? 0;
//   if (ramB !== ramA) return ramB - ramA; // Ordena pelo valor de uso da RAM

//   let hdA = valorComponenteA.hdUsoBytes ?? 0;
//   let hdB = valorComponenteB.hdUsoBytes ?? 0;
//   if (hdB !== hdA) return hdB - hdA; // Ordena pelo valor de uso do HD

//   return 0; // Se todos os valores forem iguais, considera-os iguais.
// }

// function servidoresOrdenadosPorUso(servidor) {
//   let n = servidor.length;
//   for (let i = 0; i < n - 1; i++) {
//     for (let j = 0; j < n - i - 1; j++) {
//       if (compararServidores(servidor[j], servidor[j + 1]) > 0) {
//         // Troca os servidores apó verificar o valor de uso %. bubble sort = lp.
//         let temp = servidor[j];
//         servidor[j] = servidor[j + 1];
//         servidor[j + 1] = temp;
//       }
//     }
//   }

//   return servidor;
// }

function listagemBodyCpuGpu() {
  corpoTabela.innerHTML = "";

  if (!Array.isArray(servidores) || !geralServidores) {
    corpoTabela.innerHTML = `<tr><td colspan="8" style="text-align:center;">Dados de CPU/GPU indisponíveis.</td></tr>`;
    return;
  }
  if (servidores.length === 0) {
    corpoTabela.innerHTML = `<tr><td colspan="8" style="text-align:center;">Nenhum servidor encontrado.</td></tr>`;
    countAlertaCritico.innerHTML = 0;
    countAlertaModerado.innerHTML = 0;
    countAlerta.innerHTML = 0;
    return;
  }

  // servidores = servidoresOrdenadosPorUso(servidores);
  servidores = servidores.sort((a, b) => b.usoGpu - a.usoGpu);

  servidores.forEach(servidor => {
    const linha = document.createElement('tr');
    let totalNucleo = (servidor.qtdCpu || 0) * nucleoCpu;
    let totalThreads = (servidor.qtdCpu || 0) * threadsCpu;

    // Busca a lista de capturas mais recentes para este servidor
    const capturasDoServidor = geralServidores[servidor.id];
    const ultimaCaptura = Array.isArray(capturasDoServidor) && capturasDoServidor.length > 0
      ? capturasDoServidor[capturasDoServidor.length - 1]
      : null;

    // caso não tenha o componente inicia como null.
    let usoCpuData = null;
    let usoGpuData = null;
    let tempGpuData = null;

    if (ultimaCaptura && ultimaCaptura.dadosCaptura) {
      usoCpuData = ultimaCaptura.dadosCaptura.find(d => d.componente === "CPU" && d.metrica === "%");
      // Procurar por dados de GPU
      usoGpuData = ultimaCaptura.dadosCaptura.find(d => d.componente === "GPU" && d.metrica === "%");
      tempGpuData = ultimaCaptura.dadosCaptura.find(d => d.componente === "GPU" && d.metrica === "ºC");
    }

    const valorUsoCpu = usoCpuData ? parseFloat(usoCpuData.dadoCaptura) : null;
    const valorUsoGpu = usoGpuData ? parseFloat(usoGpuData.dadoCaptura) : null;

    if (valorUsoCpu !== null) {
      if (valorUsoCpu >= LIMITE_CRITICO_CPU) {
        globalAlertCriticoCount++;
        globalAlertTotalCount++;
        countAlerta.style.display = 'block';
      } else if (valorUsoCpu >= LIMITE_MODERADO_CPU) {
        globalAlertModeradoCount++;
        globalAlertTotalCount++;
        countAlerta.style.display = 'block';
      }
    }else if (valorUsoGpu !== null) {
      if (valorUsoGpu >= LIMITE_CRITICO_GPU) {
        globalAlertCriticoCount++;
        globalAlertTotalCount++;
        countAlerta.style.display = 'block';
      } else if (valorUsoGpu >= LIMITE_MODERADO_GPU) {
        globalAlertModeradoCount++;
        globalAlertTotalCount++;
        countAlerta.style.display = 'block';
      }
    }

    linha.setAttribute('data-id', servidor.id); 

    linha.innerHTML = `
            <td>${servidor.id || "-"}</td>
            <td>${servidor.nome || "-"}</td>
            <td>${totalNucleo || "-"}</td>
            <td>${totalThreads || "-"}</td>
            <td>${servidor.qtdGpu || 0}</td>
            <td>${tempGpuData ? `${formatarPorcentagem(tempGpuData.dadoCaptura)}ºC` : "-"}</td>
            <td style="color: ${valorUsoGpu !== null ? (valorUsoGpu >= LIMITE_CRITICO_GPU ? 'red' : (valorUsoGpu >= LIMITE_MODERADO_GPU ? 'orange' : 'black')) : 'inherit'}">${usoGpuData ? `${formatarPorcentagem(usoGpuData.dadoCaptura)}%` : "-"}</td>
            <td style="color: ${valorUsoCpu !== null ? (valorUsoCpu >= LIMITE_CRITICO_CPU ? 'red' : (valorUsoCpu >= LIMITE_MODERADO_CPU ? 'orange' : 'black')) : 'inherit'}">
                ${valorUsoCpu !== null ? `${formatarPorcentagem(valorUsoCpu)}%` : "-"}
            </td>
        `;
    corpoTabela.appendChild(linha);

    linha.style.cursor = 'pointer';
    linha.addEventListener('click', (e) => {
      const servidorId = e.currentTarget.getAttribute('data-id');
      console.log("Servidor ID clicado:", servidorId);
      sessionStorage.setItem('idServidor', servidorId);
      window.location.href = `./monitoramento.html`;
    })
  });

  filtroBuscar(termoBuscaAtual);

  countAlertaCritico.innerHTML = globalAlertCriticoCount;
  countAlertaModerado.innerHTML = globalAlertModeradoCount;
  countAlerta.innerHTML = globalAlertTotalCount;
}

function listagemBodyRamDisco() {
  corpoTabela.innerHTML = "";

  if (!Array.isArray(servidores) || !geralServidores) {
    corpoTabela.innerHTML = `<tr><td colspan="8" style="text-align:center;">Dados de RAM/Disco indisponíveis.</td></tr>`;
    return;
  }
  if (servidores.length === 0) {
    corpoTabela.innerHTML = `<tr><td colspan="8" style="text-align:center;">Nenhum servidor encontrado.</td></tr>`;
    countAlertaCritico.innerHTML = 0;
    countAlertaModerado.innerHTML = 0;
    countAlerta.innerHTML = 0;
    return;
  }

  servidores = servidores.sort((a, b) => b.ramUso - a.ramUso);

  servidores.forEach(servidor => {
    const linha = document.createElement('tr');
    const capturasDoServidor = geralServidores[servidor.id];
    const ultimaCaptura = Array.isArray(capturasDoServidor) && capturasDoServidor.length > 0
      ? capturasDoServidor[capturasDoServidor.length - 1]
      : null;

    let ramUsoBytesData = null;
    let ramPercentData = null;
    let hdUsoBytesData = null;
    let hdPercentData = null;

    if (ultimaCaptura && ultimaCaptura.dadosCaptura) {
      ramUsoBytesData = ultimaCaptura.dadosCaptura.find(d => d.componente === "RAM" && d.metrica === "Byte");
      ramPercentData = ultimaCaptura.dadosCaptura.find(d => d.componente === "RAM" && d.metrica === "%");
      hdUsoBytesData = ultimaCaptura.dadosCaptura.find(d => d.componente === "HD" && d.metrica === "Byte");
      hdPercentData = ultimaCaptura.dadosCaptura.find(d => d.componente === "HD" && d.metrica === "%");

      console.log("Dados capturados para o servidor:", servidor.id, {
        ramUsoBytesData,
        ramPercentData,
        hdUsoBytesData,
        hdPercentData
      });
    }

    const ramUsoBytes = ramUsoBytesData ? parseFloat(ramUsoBytesData.dadoCaptura) : null;
    const ramPercent = ramPercentData ? parseFloat(ramPercentData.dadoCaptura) : null;
    const hdUsoBytes = hdUsoBytesData ? parseFloat(hdUsoBytesData.dadoCaptura) : null;
    const hdPercent = hdPercentData ? parseFloat(hdPercentData.dadoCaptura) : null;

    if (ramPercent !== null) {
      if (ramPercent >= LIMITE_CRITICO_RAM) {
        globalAlertCriticoCount++;
        globalAlertTotalCount++;
        countAlerta.style.display = 'block';
      } else if (ramPercent >= LIMITE_MODERADO_RAM) {
        globalAlertTotalCount++;
        globalAlertModeradoCount++;
        countAlerta.style.display = 'block';
      }
    }

    let ramTotalBytesCalculado = null;
    if (ramUsoBytes !== null && ramPercent !== null && ramPercent > 0) {
      ramTotalBytesCalculado = (ramUsoBytes / ramPercent) * 100;
    }

    let hdTotalBytesCalculado = null;
    if (hdUsoBytes !== null && hdPercent !== null && hdPercent > 0) {
      hdTotalBytesCalculado = (hdUsoBytes / hdPercent) * 100;
    }

    linha.innerHTML = `
            <td>${servidor.id || "-"}</td>
            <td>${servidor.nome || "-"}</td>
            <td>${ramTotalBytesCalculado !== null ? conversorGB(ramTotalBytesCalculado) : "-"}</td>
            <td>${ramUsoBytes !== null ? conversorGB(ramUsoBytes) : "-"}</td>
            <td style="color: ${ramPercent !== null ? (ramPercent >= LIMITE_CRITICO_RAM ? 'red' : (ramPercent >= LIMITE_MODERADO_RAM ? 'orange' : 'black')) : 'inherit'}">${ramPercent !== null ? formatarPorcentagem(ramPercent) + '%' : "-"}</td>
            <td>${hdTotalBytesCalculado !== null ? conversorGB(hdTotalBytesCalculado) : "-"}</td>
            <td>${hdUsoBytes !== null ? conversorGB(hdUsoBytes) : "-"}</td>
            <td style="color: ${hdPercent !== null ? (hdPercent >= LIMITE_CRITICO_DISCO ? 'red' : (hdPercent >= LIMITE_MODERADO_DISCO ? 'orange' : 'black')) : 'inherit'}">${hdPercent !== null ? formatarPorcentagem(hdPercent) + '%' : "-"}</td>
        `;
    corpoTabela.appendChild(linha);

    linha.style.cursor = 'pointer';
    linha.addEventListener('click', () => {
      sessionStorage.setItem('idServidor', servidor.id);
      window.location.href = `./monitoramento.html`;
    })
  });

  filtroBuscar(termoBuscaAtual)

  countAlertaCritico.innerHTML = globalAlertCriticoCount;
  countAlertaModerado.innerHTML = globalAlertModeradoCount;
  countAlerta.innerHTML = globalAlertTotalCount;
}

filtroItemCpuGpu.addEventListener('click', () => {
  estadoComponentesAtual = 'cpu_gpu';
  sessionStorage.setItem('estadoComponentesAtual', 'cpu_gpu'); // Armazena o estado atual do filtro.
  renderizarTabelaComCabecalhos();
  atualizarVisibilidadeFiltros();
});

filtroItemRamDisco.addEventListener('click', () => {
  estadoComponentesAtual = 'ram_disco';
  sessionStorage.setItem('estadoComponentesAtual', 'ram_disco'); // Armazena o estado atual do filtro.
  renderizarTabelaComCabecalhos();
  atualizarVisibilidadeFiltros();
});

// --- Funções atualizar o Filtros ---
function atualizarVisibilidadeFiltros() {
  filtroItemCpuGpu.style.display = 'none'
  if (estadoComponentesAtual === 'cpu_gpu') {
    filtroItemCpuGpu.style.display = 'none';
    filtroItemRamDisco.style.display = 'list-item';
  } else if (estadoComponentesAtual === 'ram_disco') {
    console.log("Exibindo RAM e Disco");
    filtroItemRamDisco.style.display = 'none';
    filtroItemCpuGpu.style.display = 'list-item';
  }
}

function atualizarTabela() {

  if (tabelaAtual && componenteArmazenamento.classlist.contains('ativo')) {
    tabelaAtual = tabelaAtual.filter(linha => {
      const usoGpu = linha.querySelector('td:nth-child(7)').textContent;
      const usoCpu = linha.querySelector('td:nth-child(8)').textContent;
      return usoGpu.includes('HD') || usoCpu.includes('RAM');
    });
  } else if (tabelaAtual && componenteProcessos.classlist.contains('ativo')) {
    tabelaAtual = tabelaAtual.filter(linha => {
      const usoGpu = linha.querySelector('td:nth-child(7)').textContent;
      const usoCpu = linha.querySelector('td:nth-child(8)').textContent;
      return usoGpu.includes('GPU') || usoCpu.includes('CPU');
    });
  } else {
    listagemBody();
  }
}

document.querySelector('.dropdonw_user').addEventListener('click', function (event) {
  const dropdownContent = this.querySelector('.dropdonw_content');

  if (event.target.closest('.dropdonw_content') || event.target.closest('.sair')) {
    return;
  }

  if (dropdownContent.style.display === 'none' || dropdownContent.style.display === '') {
    dropdownContent.style.display = 'block';
  } else {
    dropdownContent.style.display = 'none';
  }
});

document.addEventListener('click', function (event) {
  const dropdown = document.querySelector('.dropdonw_user');
  const dropdownContent = dropdown.querySelector('.dropdonw_content');

  if (!dropdown.contains(event.target)) {
    dropdownContent.style.display = 'none';
  }
});

document.querySelector('.notificacao').addEventListener('click', function () {
  const modalAlertas = document.querySelector('.modalAlertas');
  modalAlertas.style.display = modalAlertas.style.display === 'none' ? 'block' : 'none';
});

document.querySelectorAll('.dropdown-menu a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
  });
});

function atualizarModalAlertas(mensagem) {
  const modalAlertasContent = document.querySelector('.modalAlertas .msg');

  if (!modalAlertasContent) {
    console.error("Container de alertas (.modalAlertas .item) não encontrado!");
    return;
  }

  modalAlertasContent.innerHTML = '';

  if (mensagem && mensagem.length > 0) {
    mensagem.forEach(msgTexto => {
      let msgProcessada = msgTexto;
      msgProcessada = msgProcessada.replace(/:bell:/g, '').trim();  // remove o emoji do sino que não aparece
      msgProcessada = msgProcessada.replace(/\*(.*?)\*/g, '<strong>$1</strong>'); // transforma o * em negrito.
      msgProcessada = msgProcessada.replace(/\b(\d+(?:\.\d+)?%)(?![a-zA-Z0-9])/g, '<span class="porcentagem-alerta">$1</span>');; // classe pra deixar em vermelho.

      const p = document.createElement('p');
      p.innerHTML = msgProcessada;
      modalAlertasContent.appendChild(p);
    });
  } else {
    const p = document.createElement('p');
    p.textContent = "Nenhum alerta recente.";
    modalAlertasContent.appendChild(p);
  }
}

function filtro() {
  const dropdownMenu = document.querySelector('.dropdown-menu');
  dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
}

function filtroBuscar(nomeServidor) {
  const linhas = document.querySelectorAll('tbody tr');

  linhas.forEach(linha => {
    const coluna = linha.querySelectorAll('td');
    console.log("Coluna: ", coluna);
    if (coluna.length > 1) {
      const nome = coluna[1].textContent.toLowerCase();
      linha.style.display = nome.includes(nomeServidor) ? '' : 'none';
    }
  });
}

// init
function inicializarMonitoramento() {
  countAlertaCritico = document.getElementById('countAlertaCritico');
  countAlertaModerado = document.getElementById('countAlertaModerado');
  countAlerta = document.getElementById('countAlerta');

  if (sessionStorage.NOME_USUARIO) {
    nome_usuario.innerHTML = `${sessionStorage.NOME_USUARIO}  <img src="../assets/icon/arrow_donw.png" alt="" width="20" height="15">`;
  }
  atualizarDados(); // Primeira carga de dados
  atualizarVisibilidadeFiltros();
  setInterval(atualizarDados, 10000); // Atualiza a cada 5 segundos 
}
// Chama a função de inicialização quando a página é carregada

window.onload = function () {
  inicializarMonitoramento();

  pesquisa.oninput = () => {
    termoBuscaAtual = pesquisa.value.toLowerCase();
    filtroBuscar(termoBuscaAtual);
  }
};