let kpi1_nome = document.getElementById("kpi1_nome");
let kpi1_metrica1 = document.getElementById("kpi1_metrica1");
let kpi1_metrica2 = document.getElementById("kpi1_metrica2");
let kpi2_nome = document.getElementById("kpi2_nome");
let kpi2_metrica1 = document.getElementById("kpi2_metrica1");
let kpi2_metrica2 = document.getElementById("kpi2_metrica2");
let kpi3_nome = document.getElementById("kpi3_nome");
let kpi3_metrica1 = document.getElementById("kpi3_metrica1");
let kpi3_metrica2 = document.getElementById("kpi3_metrica2");
let kpi4_metrica1 = document.getElementById("kpi4_metrica1");
let kpi4_metrica2 = document.getElementById("kpi4_metrica2");
let kpi4_nome = document.getElementById("kpi4_nome");
let rm_divisao = document.getElementById("divisao_rm");
let rm_divisao_ram = document.getElementById("rm_divisao_ram");
let rm_divisao_gpu = document.getElementById("rm_divisao_gpu");


const discoElement = document.getElementById('kpi_disco');
const ramElement = document.getElementById('kpi_ram');
const cpuElement = document.getElementById('kpi_cpu');
const gpuElement = document.getElementById('kpi_gpu');

// let idServidor = sessionStorage.getItem('idServidor');

let componenteAtivo = 'cpu';
let graficoAtualLinha = null;
let tipoMetrica = 'uso';

let dados = [];

const limitesCriticos = {
    CPU: { '%': 90, 'MHz': 3800 },
    GPU: { '%': 90, '°C': 80 },
    RAM: { '%': 90, 'Byte': 0.9 },
    HD: { '%': 90, 'Byte': 0.9 },
};
const limitesModerados = {
    CPU: { '%': 70, 'MHz': 3000 },
    GPU: { '%': 70, '°C': 65 },
    RAM: { '%': 70, 'Byte': 0.7 },
    HD: { '%': 70, 'Byte': 0.7 },
};


// Funções para pegar as metricas e formatar os dados.
function getMetricaCaptura(todosDados, componente, metrica) {
    if (!todosDados) return null;
    const entrada = todosDados.find(dc => dc.componente === componente && dc.metrica === metrica);
    return entrada ? entrada.dadoCaptura : null;
}

function getUltimoValorMetrica(nomeComponente, nomeMetrica) {
    if (!dados || dados.length === 0) return null;
    const ultimaCaptura = dados[dados.length - 1];
    return getMetricaCaptura(ultimaCaptura.dadosCaptura, nomeComponente, nomeMetrica);
}

function formatoGB(bytes) {
    if (bytes === null || bytes === undefined || isNaN(bytes)) return "N/A";
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
}

function formatoTemperatura(valor) {
    if (valor === null || valor === undefined || isNaN(valor)) return "N/A";
    return parseFloat(valor).toFixed(1) + "°C";
}

function formatoPorcentagem(valor) {
    if (valor === null || valor === undefined || isNaN(valor)) return "N/A";
    return parseFloat(valor).toFixed(1) + "%";
}

function formatoFrequencia(valor) {
    if (valor === null || valor === undefined || isNaN(valor)) return "N/A";
    return parseInt(valor) + " MHz";
}

console.log(sessionStorage.idServidor)

async function carregarDadosESincronizar() {
    if (!sessionStorage.idServidor) {
        console.error("ID do Servidor não encontrado no sessionStorage.");
        return;
    }
    try {
        const resposta = await fetch(`/monitoramento/coletar/dados/${sessionStorage.idServidor}`);
        if (!resposta.ok) {
            console.error(`Erro no fetch: ${resposta.status} ${resposta.statusText}`);
            dados = [];

        } else {
            const dadosJson = await resposta.json();
            if (Array.isArray(dadosJson)) {
                dados = dadosJson;
                console.log("Dados capturados: ", dados);
            } else {
                console.error("Resposta do servidor não é uma lista (array).", dadosJson);
                dados = [];
            }
        }
    } catch (erro) {
        console.error("Erro ao carregar ou processar dados: ", erro);
        dados = [];
    }
    atualizarKPIs();
    renderizarGraficoLinha();
    atualizarGraficosRosquinha();
}

function aplicarCorPorLimite(elemento, valor, limiteModerado, limiteCritico) {
    if (!elemento || valor === null || isNaN(valor)) return;

    elemento.classList.remove('kpi-critico', 'kpi-moderado');

    if (valor >= limiteCritico) {
        elemento.classList.add('kpi-critico');
    } else if (valor >= limiteModerado) {
        elemento.classList.add('kpi-moderado');
    }
}


function atualizarKPIs() {
    const componentesConfig = [
        {
            nomeKPI: "Disco", nomeJSON: "HD", elId: "kpi_disco", divId: "rm_divisao",
            nomeElId: "kpi1_nome", metrica1ElId: "kpi1_metrica1", metrica2ElId: "kpi1_metrica2",
            m1Type: "%", m2Type: "Byte"
        },
        {
            nomeKPI: "RAM", nomeJSON: "RAM", elId: "kpi_ram", divId: null, // rm_divisao_ram é para CPU, divisao_rm é para RAM/CPU
            nomeElId: "kpi2_nome", metrica1ElId: "kpi2_metrica1", metrica2ElId: "kpi2_metrica2",
            m1Type: "%", m2Type: "Byte"
        },
        {
            nomeKPI: "CPU", nomeJSON: "CPU", elId: "kpi_cpu", divId: "rm_divisao_ram", // Esta div está entre Disco e RAM no HTML, mas associada a CPU aqui
            nomeElId: "kpi3_nome", metrica1ElId: "kpi3_metrica1", metrica2ElId: "kpi3_metrica2",
            m1Type: "%", m2Type: "MHz"
        },
        {
            nomeKPI: "GPU", nomeJSON: "GPU", elId: "kpi_gpu", divId: "rm_divisao_gpu",
            nomeElId: "kpi4_nome", metrica1ElId: "kpi4_metrica1", metrica2ElId: "kpi4_metrica2",
            m1Type: "%", m2Type: "°C"
        }
    ];

    // Esconde todos os cards e divisórias inicialmente
    componentesConfig.forEach(compConf => {
        const el = document.getElementById(compConf.elId);
        if (el) el.style.display = 'none';
        if (compConf.divId) {
            const divEl = document.getElementById(compConf.divId);
            if (divEl) divEl.style.display = 'none';
        }
    });

    // Identifica o componente ativo no gráfico
    const componenteAtivoNormalizado = componenteAtivo === 'disk' ? 'HD' : componenteAtivo.toUpperCase();

    let displayedCount = 0;
    for (const compConf of componentesConfig) {
        if (compConf.nomeJSON === componenteAtivoNormalizado) {
            continue;
        }

        if (displayedCount >= 3) break; // Mostrar no máximo 3 cards

        const cardElement = document.getElementById(compConf.elId);
        const nomeElement = document.getElementById(compConf.nomeElId);
        const metrica1Element = document.getElementById(compConf.metrica1ElId);
        const metrica2Element = document.getElementById(compConf.metrica2ElId);
        const divElement = compConf.divId ? document.getElementById(compConf.divId) : null;

        if (cardElement && nomeElement && metrica1Element && metrica2Element) {
            cardElement.style.display = 'flex';
            // if (divElement && displayedCount > 0) { 
                
            // }


            nomeElement.textContent = compConf.nomeKPI;

            const val1 = getUltimoValorMetrica(compConf.nomeJSON, compConf.m1Type);
            const val2 = getUltimoValorMetrica(compConf.nomeJSON, compConf.m2Type);

            if (compConf.m1Type === "%") metrica1Element.textContent = formatoPorcentagem(val1);
            else if (compConf.m1Type === "Byte") metrica1Element.textContent = formatoGB(val1);
            else if (compConf.m1Type === "MHz") metrica1Element.textContent = formatoFrequencia(val1);
            else metrica1Element.textContent = val1 !== null ? val1.toString() : "N/A";

            if (compConf.m2Type === "%") metrica2Element.textContent = formatoPorcentagem(val2);
            else if (compConf.m2Type === "Byte") metrica2Element.textContent = formatoGB(val2);
            else if (compConf.m2Type === "MHz") metrica2Element.textContent = formatoFrequencia(val2);
            else if (compConf.m2Type === "°C") metrica2Element.textContent = formatoTemperatura(val2);
            else metrica2Element.textContent = val2 !== null ? val2.toString() : "N/A";

            // Aplicar cores de limite
            const limiteMod1 = limitesModerados[compConf.nomeJSON]?.[compConf.m1Type];
            const limiteCrit1 = limitesCriticos[compConf.nomeJSON]?.[compConf.m1Type];
            if (limiteMod1 !== undefined && limiteCrit1 !== undefined) {
                aplicarCorPorLimite(metrica1Element.parentElement, val1, limiteMod1, limiteCrit1); 
            }

            const limiteMod2 = limitesModerados[compConf.nomeJSON]?.[compConf.m2Type];
            const limiteCrit2 = limitesCriticos[compConf.nomeJSON]?.[compConf.m2Type];
            if (limiteMod2 !== undefined && limiteCrit2 !== undefined) {
                aplicarCorPorLimite(metrica2Element.parentElement, val2, limiteMod2, limiteCrit2);
            }

            displayedCount++;
        }
    }
    
    const visibleCards = componentesConfig.filter(c => c.nomeJSON !== componenteAtivoNormalizado);
    if (visibleCards.length > 1 && document.getElementById(visibleCards[0].divId_after)) { 
        document.getElementById(visibleCards[0].divId_after).style.display = 'flex';
    }
    
    const compAtivoConfig = componentesConfig.find(c => c.nomeJSON === componenteAtivoNormalizado);
    if (compAtivoConfig) {
        const elAtivo = document.getElementById(compAtivoConfig.elId);
        if (elAtivo) elAtivo.style.display = 'none';
        if (componenteAtivo === 'disk' && rm_divisao_ram) rm_divisao_ram.style.display = 'none';
    }


    const compAtivoTitulo = document.getElementById('componente_ativo');
    if (compAtivoTitulo) {
        let nomeAmigavel = componenteAtivo;
        if (componenteAtivo === 'disk') nomeAmigavel = 'Disco';
        compAtivoTitulo.textContent = nomeAmigavel.toUpperCase();
    }
}


// Função para criar a cor de degrade
function criarGradient(ctx) {
    const gradiente1 = ctx.createLinearGradient(0, 0, 200, 0);
    gradiente1.addColorStop(0.2, '#10D3F9');
    gradiente1.addColorStop(0.5, '#740BC6');
    return gradiente1;
}

function processarDadosParaGrafico(nomeComponenteJSON, nomeMetricaJSON, filtroTempoSelecionado) {
    let dadosFiltrados = dados;

    if (dados.length > 0 && filtroTempoSelecionado !== 'all') { // 'all' seria uma nova opção para mostrar tudo
        const agora = new Date();
        let segundosAtras;

        switch (filtroTempoSelecionado) {
            case '30s': segundosAtras = 30; break;
            case '1': segundosAtras = 60; break;
            case '10': segundosAtras = 10 * 60; break;
            case '30m': segundosAtras = 30 * 60; break;
            default: segundosAtras = 30;
        }

        const tempoLimite = new Date(agora.getTime() - segundosAtras * 1000);
        dadosFiltrados = dados.filter(captura => {
            // Adicionar 'Z' para indicar UTC se as dataHora do servidor são UTC, ou ajustar conforme o fuso.
            // Substituir espaço por 'T' para formato ISO 8601 completo.
            const dataCaptura = new Date(captura.dataHora.replace(' ', 'T') + 'Z');
            return dataCaptura >= tempoLimite;
        });
        // Fallback se o filtro resultar em poucos ou nenhum dado, mas houver dados disponíveis
        if (dadosFiltrados.length < 2 && dados.length >= 2 && filtroTempoSelecionado !== 'all') {
            const N = Math.min(dados.length, (segundosAtras <= 60 ? 30 : 60)); // Pega pelo menos N pontos se o filtro temporal for muito restritivo
            dadosFiltrados = dados.slice(-N);
        }
    }


    const labels = dadosFiltrados.map(captura =>
        new Date(captura.dataHora.replace(' ', 'T') + 'Z').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );
    const dataPoints = dadosFiltrados.map(captura =>
        getMetricaCaptura(captura.dadosCaptura, nomeComponenteJSON, nomeMetricaJSON)
    );

    return { labels, dataPoints };
}

// Função para renderizar o gráfico de linha.
function renderizarGraficoLinha() {
    const canvasElement = document.getElementById('grafico_linha');
    if (!canvasElement) { console.error("Elemento canvas 'grafico_linha' não encontrado."); return; }
    const ctx4 = canvasElement.getContext('2d');

    if (graficoAtualLinha) {
        graficoAtualLinha.destroy();
    }

    const filtroTempo = document.getElementById('slt_tempo') ? document.getElementById('slt_tempo').value : '30s';

    let nomeComponenteJSON, nomeMetricaJSON, labelDataset, metrica = '', yAxisMax = 100;

    switch (componenteAtivo) {
        case 'cpu':
            nomeComponenteJSON = 'CPU';

            if (tipoMetrica === 'frequencia') {
                nomeMetricaJSON = 'MHz'; labelDataset = 'Frequência da CPU'; metrica = "MHz"; yAxisMax = undefined;
            }
            else if (tipoMetrica === 'uso') {
                nomeMetricaJSON = '%'; labelDataset = 'Uso CPU'; metrica = '%'; yAxisMax = 100;

            }
            else if (tipoMetrica === 'temperatura') {
                nomeMetricaJSON = 'Temperatura'; labelDataset = 'Temperatura CPU'; metrica = '°C'; yAxisMax = 100;
                console.warn("Dados de Temperatura da CPU não disponíveis, exibindo Uso %.");
            } else {
                nomeMetricaJSON = '%'; labelDataset = 'Uso CPU'; metrica = '%'; yAxisMax = 100;
            }
            break;
        case 'gpu':
            console.warn("Dados agregados de GPU não disponíveis no formato atual do JSON para o gráfico de linha.");
            nomeComponenteJSON = 'GPU';
            nomeMetricaJSON = '%'; labelDataset = 'Uso GPU'; metrica = '%'; yAxisMax = 100;
            if (graficoAtualLinha) graficoAtualLinha.destroy();
            graficoAtualLinha = null; // Garante que não tente desenhar com dados vazios
            ctx4.clearRect(0, 0, canvasElement.width, canvasElement.height); // Limpa o canvas
            ctx4.font = "16px Arial";
            ctx4.fillStyle = "grey";
            ctx4.textAlign = "center";
            ctx4.fillText("Dados de GPU não disponíveis para gráfico de linha.", canvasElement.width / 2, canvasElement.height / 2);
            return;
        case 'disk':
            nomeComponenteJSON = 'HD';
            if (tipoMetrica === 'bytes') {
                nomeMetricaJSON = 'Byte'; labelDataset = 'Uso Disco'; metrica = 'GB'; yAxisMax = undefined;
            } else {
                nomeMetricaJSON = '%'; labelDataset = 'Uso Disco'; metrica = '%'; yAxisMax = 100;
            }
            break;
        case 'ram':
            nomeComponenteJSON = 'RAM';
            if (tipoMetrica === 'bytes') {
                nomeMetricaJSON = 'Byte'; labelDataset = 'Uso RAM'; metrica = 'GB'; yAxisMax = undefined;
            } else {
                nomeMetricaJSON = '%'; labelDataset = 'Uso RAM'; metrica = '%'; yAxisMax = 100;
            }
            break;
        default:
            console.error("Componente ativo desconhecido para gráfico:", componenteAtivo);
            return;
    }

    const { labels, dataPoints } = processarDadosParaGrafico(nomeComponenteJSON, nomeMetricaJSON, filtroTempo);

    let finalDataPoints = dataPoints;
    if (nomeMetricaJSON === 'Byte') {
        finalDataPoints = dataPoints.map(b => (b !== null ? parseFloat((b / (1024 * 1024 * 1024)).toFixed(2)) : null));
        if (yAxisMax === undefined) { // Calcula Y max dinamicamente para Bytes
            const maxVal = Math.max(0, ...finalDataPoints.filter(v => v !== null));
            yAxisMax = maxVal > 0 ? Math.ceil(maxVal / 5) * 5 + 5 : 16; // Ex: Múltiplo de 5 + margem
        }
    }

    graficoAtualLinha = new Chart(ctx4, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: labelDataset,
                data: finalDataPoints,
                borderColor: '#740BC6',
                backgroundColor: criarGradient(ctx4),
                // fill: true,
                tension: 0.3,
                pointRadius: 3,
                pointBackgroundColor: '#740BC6',
                pointBorderColor: '#FFFFFF',
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#FFFFFF',
                pointHoverBorderColor: '#740BC6'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: yAxisMax,
                    ticks: {
                        callback: function (value) { return value + metrica; }
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: labels.length > 15 ? 10 : labels.length // Ajusta dinamicamente
                    }
                }
            },
            plugins: {
                legend: { display: true, position: 'bottom' },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            if (label) label += ': ';
                            if (context.parsed.y !== null) label += context.parsed.y.toFixed(tipoMetrica === 'bytes' ? 2 : 1) + metrica;
                            return label;
                        }
                    }
                }
            },
            interaction: { mode: 'index', intersect: false },
        }
    });
}

function atualizarGraficosRosquinha() {
    const componentesRosquinha = [
        { idCanvas: 'discoRosquinha', nomeJSON: 'HD', metrica: '%' },
        { idCanvas: 'ramRosquinha', nomeJSON: 'RAM', metrica: '%' },
        { idCanvas: 'cpuRosquinha', nomeJSON: 'CPU', metrica: '%' },
        { idCanvas: 'gpuRosquinha', nomeJSON: 'GPU', metrica: '%' }
    ];

    componentesRosquinha.forEach(info => {
        const canvasElement = document.getElementById(info.idCanvas);
        if (!canvasElement) {
            console.warn(`Canvas ${info.idCanvas} não encontrado.`);
            return; // Pula para o próximo componente se o canvas não for encontrado
        }
        const ctxRosquinha = canvasElement.getContext('2d');

        // É importante que criarGradient use o contexto correto (ctxRosquinha)
        const gradienteRosquinha = criarGradient(ctxRosquinha);

        let valorUso = getUltimoValorMetrica(info.nomeJSON, info.metrica);
        let dataForChart = [0, 100]; // Valor padrão para gráfico vazio (0% usado, 100% livre)

        if (valorUso !== null && valorUso !== undefined && !isNaN(parseFloat(valorUso))) {
            valorUso = parseFloat(parseFloat(valorUso).toFixed(1));
            // Garante que valorUso não exceda 100 e não seja menor que 0
            valorUso = Math.max(0, Math.min(100, valorUso));
            dataForChart = [valorUso, parseFloat((100 - valorUso).toFixed(1))];
        }

        // Destruir gráfico existente antes de desenhar um novo ou texto
        const chartExistente = Chart.getChart(canvasElement);
        if (chartExistente) {
            chartExistente.destroy();
        }

        // Limpar o canvas antes de desenhar texto "NAS" ou novo gráfico
        ctxRosquinha.clearRect(0, 0, canvasElement.width, canvasElement.height);


        if (info.nomeJSON === 'GPU' && (valorUso === null || valorUso === undefined || isNaN(parseFloat(valorUso)))) {
            // Se for GPU e não houver dados válidos, desenha "NAS"
            kpi4_metrica1.style.display = 'none';
            kpi4_metrica2.style.display = 'none';

            ctxRosquinha.font = "bold 16px Arial";
            ctxRosquinha.fillStyle = "#808080"; // Cor cinza para o texto
            ctxRosquinha.textAlign = "center";
            ctxRosquinha.textBaseline = "middle";
            ctxRosquinha.fillText("NAS", canvasElement.width / 2, canvasElement.height / 2);
            // Não cria o gráfico de rosquinha para GPU se "NAS" for exibido
            return;
        }

        // Cria um novo gráfico de rosquinha para todos os outros casos (ou GPU com dados)
        new Chart(ctxRosquinha, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: dataForChart,
                    backgroundColor: [gradienteRosquinha, '#E0E0E0'], // Cor para usado e livre
                    borderColor: '#FFFFFF', // Cor da borda das fatias
                    borderWidth: 2,
                    // circumference: 270, // Opcional para visual de gauge
                    // rotation: -135,    // Opcional para visual de gauge
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%', // Ajusta a espessura da rosquinha (ex: '70%')
                plugins: {
                    legend: { display: false }, // Esconde a legenda padrão
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = (context.dataIndex === 0) ? 'Uso' : 'Livre';
                                return `${label}: ${context.parsed.toFixed(1)}%`;
                            }
                        }
                    }
                }
            }
        });
    });
}

function atualizarVisibilidadeBotoes() {
    const btnTemp = document.getElementById('btn_temperatura');
    const btnBytes = document.getElementById('btn_bytes');
    const btnFreq = document.getElementById('btn_frequencia');

    if (btnTemp) btnTemp.style.display = 'none';
    if (btnBytes) btnBytes.style.display = 'none';
    if (btnFreq) btnFreq.style.display = 'none';


    if (componenteAtivo === 'cpu') {
        if (btnFreq) btnFreq.style.display = 'inline-block';
        if (btnTemp) btnTemp.style.display = 'inline-block';
    } else if (componenteAtivo === 'gpu') {
        if (btnTemp) btnTemp.style.display = 'inline-block';
    } else if (componenteAtivo === 'disk' || componenteAtivo === 'ram') {
        if (btnBytes) btnBytes.style.display = 'inline-block';
        if (tipoMetrica !== 'bytes') tipoMetrica = 'bytes';
    }

    // Se a métrica ativa não é visível/aplicável, reverte para 'uso'
    if (tipoMetrica === 'temperatura' && (!btnTemp || btnTemp.style.display === 'none')) {
        tipoMetrica = 'uso';
    } else if (tipoMetrica === 'bytes' && (!btnBytes || btnBytes.style.display === 'none')) {
        tipoMetrica = 'uso';
    }
    atualizarBotoesMetricaAtiva();
}

function definirComponenteAtivo(novoComponente) {
    componenteAtivo = novoComponente;
    atualizarVisibilidadeBotoes();
    atualizarKPIs();
    renderizarGraficoLinha();

    // Atualiza o título que mostra o componente ativo no gráfico de linha.
    const compAtivoTitulo = document.getElementById('componente_ativo');
    if (compAtivoTitulo) {
        let nomeAmigavel = novoComponente;
        if (novoComponente === 'disk') nomeAmigavel = 'Disco';
        compAtivoTitulo.textContent = nomeAmigavel.toUpperCase();
    }
}

function atualizarBotoesMetricaAtiva() {
    ['btn_uso', 'btn_temperatura', 'btn_bytes', 'btn_frequencia'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.classList.remove('active');
    });
    const activeBtn = document.getElementById(`btn_${tipoMetrica}`);
    if (activeBtn) activeBtn.classList.add('active');
}

function inicializarEventosClique() {
    const kpiElementsMap = {
        'kpi_disco': 'disk',
        'kpi_ram': 'ram',
        'kpi_cpu': 'cpu',
        'kpi_gpu': 'gpu'
    };
    for (const idElemento in kpiElementsMap) {
        const el = document.getElementById(idElemento);
        if (el) {
            el.addEventListener('click', () => {
                definirComponenteAtivo(kpiElementsMap[idElemento]);
            });
        }
    }

    ['uso', 'temperatura', 'bytes', 'frequencia'].forEach(metrica => {
        const btn = document.getElementById(`btn_${metrica}`);
        if (btn) {
            btn.addEventListener('click', () => {
                tipoMetrica = metrica;
                renderizarGraficoLinha();
                atualizarBotoesMetricaAtiva();
            });
        }
    });
}

function inicializarEventosFiltroTempo() {
    const sltTempo = document.getElementById('slt_tempo');
    if (sltTempo) {
        sltTempo.addEventListener('change', renderizarGraficoLinha);
    }
}

function inicializarDropdownComponente() {
    const dropdownHeader = document.getElementById('dropdown_header');
    const dropdownContent = document.getElementById('dropdown_content');
    const componenteAtivoEl = document.getElementById('componente_ativo');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    if (dropdownHeader && dropdownContent && componenteAtivoEl) {
        // Define o texto inicial do header do dropdown
        let nomeInicialAmigavel = componenteAtivo;
        if (componenteAtivo === 'disk') nomeInicialAmigavel = 'Disco';
        componenteAtivoEl.textContent = nomeInicialAmigavel.toUpperCase();


        dropdownHeader.addEventListener('click', function () {
            dropdownContent.classList.toggle('show');
        });

        window.addEventListener('click', function (event) {
            // Garante que '.componente-dropdown' seja o elemento pai que contém tanto o header quanto o content
            if (dropdownContent.classList.contains('show') && !event.target.closest('.componente-dropdown')) {
                dropdownContent.classList.remove('show');
            }
        });

        dropdownItems.forEach(item => {
            item.addEventListener('click', function () {
                const novoComponente = this.getAttribute('data-component'); // 'cpu', 'gpu', 'disk', 'ram'
                if (novoComponente) {
                    componenteAtivoEl.textContent = this.textContent; // Atualiza o texto do dropdown
                    definirComponenteAtivo(novoComponente); // Chama a função centralizada
                }
                dropdownContent.classList.remove('show');
            });
        });
    }
}


// --- Função Principal de Inicialização ---
async function inicializarPagina() {
    // Inicializa os event listeners primeiro
    inicializarEventosClique();
    inicializarEventosFiltroTempo();
    inicializarDropdownComponente(); // Para o seletor do gráfico de linha

    // Define o estado visual inicial dos botões de métrica com base no componenteAtivo padrão
    atualizarVisibilidadeBotoes(); // Isso também pode ajustar 'tipoMetrica'
    // atualizarBotoesMetricaAtiva(); // Já é chamado por atualizarVisibilidadeBotoes se tipoMetrica mudar

    // Carrega os dados e faz a primeira renderização/atualização completa
    await carregarDadosESincronizar();

    // Configura a atualização periódica dos dados
    setInterval(carregarDadosESincronizar, 10000); // Atualiza a cada 10 segundos (ajuste conforme necessário)
}

// Iniciar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', inicializarPagina);
