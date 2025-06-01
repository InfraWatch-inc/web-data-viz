let kpi1_nome = document.getElementById("kpi1_nome");
let kpi1_metrica1 = document.getElementById("kpi1_metrica1");
let kpi1_metrica2 = document.getElementById("kpi1_metrica2");
let kpi2_nome = document.getElementById("kpi2_nome");
let kpi2_metrica1 = document.getElementById("kpi2_metrica1");
let kpi2_metrica2 = document.getElementById("kpi2_metrica2");
let kpi3_nome = document.getElementById("kpi3_nome");
let kpi3_metrica1 = document.getElementById("kpi3_metrica1");
let kpi3_metrica2 = document.getElementById("kpi3_metrica2");
let rm_divisao = document.getElementById("divisao_rm");
let rm_divisao_ram = document.getElementById("rm_divisao_ram");
let rm_divisao_gpu = document.getElementById("rm_divisao_gpu");


const discoElement = document.getElementById('kpi_disco');
const ramElement = document.getElementById('kpi_ram');
const cpuElement = document.getElementById('kpi_cpu');
const gpuElement = document.getElementById('kpi_gpu');

let idServidor = sessionStorage.getItem('idServidor');
let componenteAtivo = 'cpu';
let graficoAtualLinha = null;
let tipoMetrica = 'uso';

let dados = [];

// async function carregarDados(){
    
//     try{
//         const resposta = await fetch('/monitoramento/coletar/dados/${idServidor}');

//         if(!resposta.ok){
//             console.error("Erro no fecth.");
//             return;
//         }

//         const capturaObjeto = await resposta.json();
//         if(Array.isArray(capturaObjeto)){
//             dados = capturaObjeto;
//             console.log("Dados capturados: ", dados);
//         }else{
//             console.error("Resposta não é uma lista");
//         }
//     }catch(erro){
//         console.error("Erro. ", erro);
//     }
// }

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


async function carregarDadosESincronizar() {
    if (!idServidor) {
        console.error("ID do Servidor não encontrado no sessionStorage.");
        return;
    }
    try {
        const resposta = await fetch(`/monitoramento/coletar/dados/${idServidor}`);
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

function atualizarKPIs() {
    const componentesDisponiveis = [
        { nomeKPI: "Disco", nomeJSON: "HD", el: discoElement, div: rm_divisao, m1: "%", m2: "Byte" , m1Label: "Uso", m2Label: "Em Uso"},
        { nomeKPI: "RAM", nomeJSON: "RAM", el: ramElement, div: null, m1: "%", m2: "Byte", m1Label: "Uso", m2Label: "Em Uso" },
        { nomeKPI: "CPU", nomeJSON: "CPU", el: cpuElement, div: rm_divisao_ram, m1: "%", m2: "MHz", m1Label: "Uso", m2Label: "Freq." },
        { nomeKPI: "GPU", nomeJSON: "GPU", el: gpuElement, div: rm_divisao_gpu, m1: "%", m2: "°C", m1Label: "Uso", m2Label: "Temp." }
    ];

    // Esconde todos os elementos KPI e divisórias
    [discoElement, ramElement, cpuElement, gpuElement].forEach(el => { if (el) el.style.display = 'none'; });
    [rm_divisao, rm_divisao_ram, rm_divisao_gpu].forEach(el => { if (el) el.style.display = 'none'; });


    let kpiDomSlots = [
        { nome: kpi1_nome, m1: kpi1_metrica1, m2: kpi1_metrica2 },
        { nome: kpi2_nome, m1: kpi2_metrica1, m2: kpi2_metrica2 },
        { nome: kpi3_nome, m1: kpi3_metrica1, m2: kpi3_metrica2 },
    ];

    // Limpa os slots de KPI
    kpiDomSlots.forEach(slot => {
        if (slot.nome) slot.nome.textContent = 'Carregando...';
        if (slot.m1) slot.m1.textContent = 'N/A';
        if (slot.m2) slot.m2.textContent = 'N/A';
    });

    let slotIndex = 0;
    for (const comp of componentesDisponiveis) {
        if (slotIndex >= kpiDomSlots.length) break; // Não há mais slots de KPI no DOM

        // Converte 'disk' do componenteAtivo para 'HD' para comparação
        const componenteAtivoNormalizado = componenteAtivo === 'disk' ? 'HD' : componenteAtivo.toUpperCase();

        if (comp.nomeJSON !== componenteAtivoNormalizado) {
            const slot = kpiDomSlots[slotIndex];
            if(comp.el) comp.el.style.display = 'flex'; // el = elemento do KPI
            if(comp.div) comp.div.style.display = 'flex'; // div = divisória

            if (slot.nome) slot.nome.textContent = comp.nomeKPI;

            const val1 = getUltimoValorMetrica(comp.nomeJSON, comp.m1);
            const val2 = getUltimoValorMetrica(comp.nomeJSON, comp.m2);

            if (slot.m1) {
                if (comp.m1 === "%") slot.m1.textContent = formatoPorcentagem(val1);
                else if (comp.m1 === "Byte") slot.m1.textContent = formatoGB(val1);
                else if (comp.m1 === "MHz") slot.m1.textContent = formatoFrequencia(val1);
                else slot.m1.textContent = val1 !== null ? val1.toString() : "N/A";
            }
            if (slot.m2) {
                if (comp.m2 === "%") slot.m2.textContent = formatoPorcentagem(val2);
                else if (comp.m2 === "Byte") slot.m2.textContent = formatoGB(val2);
                else if (comp.m2 === "MHz") slot.m2.textContent = formatoFrequencia(val2);
                else if (comp.m2 === "°C") slot.m2.textContent = formatoTemperatura(val2);
                else slot.m2.textContent = val2 !== null ? val2.toString() : "N/A";
            }
            slotIndex++;
        }
    }
    // Esconder o card do componente ativo (o que está no gráfico de linha)
    const compAtivoInfo = componentesDisponiveis.find(c =>
        c.nomeJSON === (componenteAtivo === 'disk' ? 'HD' : componenteAtivo.toUpperCase()) ||
        c.nomeKPI.toLowerCase() === componenteAtivo.toLowerCase()
    );

    if (compAtivoInfo && compAtivoInfo.el) {
        compAtivoInfo.el.style.display = 'none';
        // divisórias baseada no componente ativo 
        if (componenteAtivo === 'disk' && rm_divisao_ram) rm_divisao_ram.style.display = 'none';
        else if (componenteAtivo === 'ram' && rm_divisao) rm_divisao.style.display = 'none';
        else if (componenteAtivo === 'cpu' && rm_divisao) rm_divisao.style.display = 'none';
        else if (componenteAtivo === 'gpu' && rm_divisao_gpu) rm_divisao_gpu.style.display = 'none';

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


// function atualizarKPIs() {
//     // Esconde todos os KPIs primeiro
//     if (discoElement) discoElement.style.display = 'flex', rm_divisao.style.display = 'flex';
//     if (ramElement) ramElement.style.display = 'flex';
//     if (cpuElement) cpuElement.style.display = 'flex', rm_divisao_ram.style.display = 'flex';
//     if (gpuElement) gpuElement.style.display = 'flex', rm_divisao_gpu.style.display = 'flex';

//     // Esconde o componente ativo (que está sendo mostrado no gráfico de linha)
//     if (componenteAtivo === 'disk' && discoElement) {
//         discoElement.style.display = 'none';
//         rm_divisao_ram.style.display = 'none';
//     } else if (componenteAtivo === 'ram' && ramElement) {
//         ramElement.style.display = 'none';
//         rm_divisao.style.display = 'none';
//     } else if (componenteAtivo === 'cpu' && cpuElement) {
//         cpuElement.style.display = 'none';
//         rm_divisao.style.display = 'none';
//     } else if (componenteAtivo === 'gpu' && gpuElement) {
//         gpuElement.style.display = 'none';
//         rm_divisao_gpu.style.display = 'none';
//     }

//     // Atualiza as informações dos KPIs
//     if (kpi1_nome && componenteAtivo !== 'disk') {
//         kpi1_nome.textContent = "Disco";
//         kpi1_metrica1.textContent = kpiData.disk.usage;
//         kpi1_metrica2.textContent = kpiData.disk.free;
//     }

//     if (kpi2_nome && componenteAtivo !== 'ram') {
//         kpi2_nome.textContent = "RAM";
//         kpi2_metrica1.textContent = kpiData.ram.usage;
//         kpi2_metrica2.textContent = kpiData.ram.free;
//     }

//     if (kpi3_nome && componenteAtivo !== 'cpu') {
//         kpi3_nome.textContent = "CPU";
//         kpi3_metrica1.textContent = kpiData.cpu.usage;
//         kpi3_metrica2.textContent = kpiData.cpu.temperature;
//     }

//     // O componente ativo será exibido como título do gráfico de linha
//     document.getElementById('componente_ativo').textContent = componenteAtivo.toUpperCase();
// }


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
        if (dadosFiltrados.length < 2 && dados.length >=2 && filtroTempoSelecionado !== 'all') {
            const N = Math.min(dados.length, (segundosAtras <= 60 ? 30 : 60)); // Pega pelo menos N pontos se o filtro temporal for muito restritivo
            dadosFiltrados = dados.slice(-N);
        }
    }


    const labels = dadosFiltrados.map(captura =>
        new Date(captura.dataHora.replace(' ', 'T')+'Z').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
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
            if (tipoMetrica === 'temperatura') {
                nomeMetricaJSON = 'Temperatura'; labelDataset = 'Temperatura CPU'; metrica = '°C'; yAxisMax = 100;
                nomeMetricaJSON = '%'; labelDataset = 'Uso CPU'; metrica = '%'; yAxisMax = 100;
                console.warn("Dados de Temperatura da CPU não disponíveis, exibindo Uso %.");
            } else { 
                nomeMetricaJSON = '%'; labelDataset = 'Uso CPU'; metrica = '%'; yAxisMax = 100;
                 nomeMetricaJSON = 'MHz'; labelDataset = 'Frequência CPU'; metrica = 'MHz'; yAxisMax = undefined; 
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
                        label: function(context) {
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
            return;
        }
        const ctx = canvasElement.getContext('2d');
        const gradiente1 = criarGradient(ctx)

        let valorUso = getUltimoValorMetrica(info.nomeJSON, info.metrica);
        let dataForChart = [0, 100]; // Valor padrão para gráfico vazio

        if (valorUso !== null) {
            valorUso = parseFloat(valorUso.toFixed(1));
            dataForChart = [valorUso, parseFloat((100 - valorUso).toFixed(1))];
        }

        const chartExistente = Chart.getChart(canvasElement);
        if (chartExistente) {
            chartExistente.destroy();
        }

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: dataForChart,
                    backgroundColor: [gradiente1, '#E0E0E0'],
                    borderColor: '#FFFFFF',
                    borderWidth: 2,
                     // circumference: 270, // Opcional para visual de gauge
                     // rotation: -135,    // Opcional para visual de gauge
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                // cutout: '75%', // Mais fino
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = (context.dataIndex === 0) ? 'Uso' : 'Livre';
                                return `${label}: ${context.parsed.toFixed(1)}%`;
                            }
                        }
                    }
                }
            }
        });
    });
     // gpu separada para nõa bugar.
    const gpuRosquinhaCanvas = document.getElementById('gpuRosquinha');
    if (gpuRosquinhaCanvas) {
        const ctxGpu = gpuRosquinhaCanvas.getContext('2d');
        const chartExistenteGpu = Chart.getChart(gpuRosquinhaCanvas);
        if (chartExistenteGpu) chartExistenteGpu.destroy();
        // Desenhar mensagem "N/A" ou gráfico vazio
        new Chart(ctxGpu, {
            type: 'doughnut',
            data: { datasets: [{ data: [0, 100], backgroundColor: ['#CCCCCC', '#E9ECEF'] }] },
            options: { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: {display: false}, tooltip: {enabled: false}} }
        });
    }
}

function atualizarVisibilidadeBotoes() {
    const btnTemp = document.getElementById('btn_temperatura');
    const btnBytes = document.getElementById('btn_bytes');

    if (btnTemp) btnTemp.style.display = 'none';
    if (btnBytes) btnBytes.style.display = 'none';

    // let metricaPadrao = 'uso';

    if (componenteAtivo === 'cpu') {
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
    ['btn_uso', 'btn_temperatura', 'btn_bytes'].forEach(id => {
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

    ['uso', 'temperatura', 'bytes'].forEach(metrica => {
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


// // Função para renderizar o gráfico de linha com base no componente ativo
// function renderizarGraficoLinha() {
//     const ctx4 = document.getElementById('grafico_linha').getContext('2d');

//     // Destruir gráfico anterior se existir
//     if (graficoAtual !== null) {
//         graficoAtual.destroy();
//     }

//     // Obter o valor selecionado no filtro de tempo
//     const filtroTempo = document.getElementById('slt_tempo').value;

//     // Obter os dados 
//     let labels = [];
//     let datasets = [];
//     let dadosComponente;

//     // Selecionar com base no filtro de tempo
//     if (filtroTempo === '30s') {
//         // Últimos 30 segundos de dados
//         dadosComponente = {
//             gpu: graphData.gpu.slice(-30),
//             cpu: graphData.cpu.slice(-30),
//             disk: graphData.disk.slice(-30),
//             ram: graphData.ram.slice(-30)
//         };
//     } else if (filtroTempo === '1') {
//         // Último minuto de dados (60 segundos)
//         dadosComponente = {
//             gpu: graphData.gpu,
//             cpu: graphData.cpu,
//             disk: graphData.disk,
//             ram: graphData.ram
//         };
//     } else if (filtroTempo === '10') {
//         // Últimos 10 minutos de dados
//         dadosComponente = {
//             gpu: graphDataMinuto.gpu.slice(-10),
//             cpu: graphDataMinuto.cpu.slice(-10),
//             disk: graphDataMinuto.disk.slice(-10),
//             ram: graphDataMinuto.ram.slice(-10)
//         };
//     } else if (filtroTempo === '30m') {
//         // Últimos 30 minutos de dados
//         dadosComponente = {
//             gpu: graphDataMinuto.gpu,
//             cpu: graphDataMinuto.cpu,
//             disk: graphDataMinuto.disk,
//             ram: graphDataMinuto.ram
//         };
//     } else {
//         // Padrão: últimos 30 segundos
//         dadosComponente = {
//             gpu: graphData.gpu.slice(-30),
//             cpu: graphData.cpu.slice(-30),
//             disk: graphData.disk.slice(-30),
//             ram: graphData.ram.slice(-30)
//         };
//     }


//     // Configurar os dados com base no componente selecionado
//     if (componenteAtivo === 'gpu') {
//         labels = dados.dataHora;

//         datasets = [
//             {
//                 label: 'GPU01',
//                 data: dadosComponente.gpu.map(item => item.GPU01),
//                 borderColor: 'blue',
//                 fill: false,
//                 tension: 0.1
//             },
//             {
//                 label: 'GPU02',
//                 data: dadosComponente.gpu.map(item => item.GPU02),
//                 borderColor: 'orange',
//                 fill: false,
//                 tension: 0.1
//             },
//             {
//                 label: 'GPU03',
//                 data: dadosComponente.gpu.map(item => item.GPU03),
//                 borderColor: 'green',
//                 fill: false,
//                 tension: 0.1
//             },
//             {
//                 label: 'GPU04',
//                 data: dadosComponente.gpu.map(item => item.GPU04),
//                 borderColor: 'lightblue',
//                 fill: false,
//                 tension: 0.1
//             }
//         ];
//     } else if (componenteAtivo === 'cpu') {
//         labels = dadosComponente.cpu.map(item => item.time);

//         if (tipoMetrica === 'temperatura') {
//             datasets = [
//                 {
//                     label: 'Temperatura',
//                     data: dados.dadosCaptura.map(item => item.dadosCaptura),
//                     borderColor: 'red',
//                     fill: false,
//                     tension: 0.1
//                 }
//             ];
//         } else {
//             datasets = [
//                 {
//                     label: 'Uso',
//                     data: dadosComponente.cpu.map(item => item.Usage),
//                     borderColor: 'blue',
//                     fill: false,
//                     tension: 0.1
//                 }
//             ];
//         }
//     } else if (componenteAtivo === 'disk') {
//         labels = dadosComponente.disk.map(item => item.time);

//         if (tipoMetrica === 'bytes') {
//             datasets = [
//                 {
//                     label: 'Uso em GB',
//                     data: dadosComponente.disk.map(item => item.UsageBytes),
//                     borderColor: 'purple',
//                     fill: false,
//                     tension: 0.1
//                 }
//             ];
//         } else {
//             datasets = [
//                 {
//                     label: 'Uso %',
//                     data: dadosComponente.disk.map(item => item['Usage%']),
//                     borderColor: 'blue',
//                     fill: false,
//                     tension: 0.1
//                 }
//             ];
//         }
//     } else if (componenteAtivo === 'ram') {
//         labels = dadosComponente.ram.map(item => item.time);

//         if (tipoMetrica === 'bytes') {
//             datasets = [
//                 {
//                     label: 'Uso em GB',
//                     data: dadosComponente.ram.map(item => item.UsageBytes),
//                     borderColor: 'green',
//                     fill: false,
//                     tension: 0.1
//                 }
//             ];
//         } else {
//             datasets = [
//                 {
//                     label: 'Uso %',
//                     data: dadosComponente.ram.map(item => item['Usage%']),
//                     borderColor: 'blue',
//                     fill: false,
//                     tension: 0.1
//                 }
//             ];
//         }
//     }

//     // Configurar e criar o gráfico
//     graficoAtual = new Chart(ctx4, {
//         type: 'line',
//         data: {
//             labels: labels,
//             datasets: datasets
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             scales: {
//                 y: {
//                     beginAtZero: true,
//                     max: tipoMetrica === 'uso' ? 100 :
//                          tipoMetrica === 'temperatura' ? 100 :
//                          componenteAtivo === 'cpu' && tipoMetrica === 'temperatura' ? 100 :
//                          componenteAtivo === 'disk' && tipoMetrica === 'bytes' ? 600 :
//                          componenteAtivo === 'ram' && tipoMetrica === 'bytes' ? 16 : 80,
//                     ticks: {
//                         stepSize: 10,
//                         callback: function (value) {
//                             if (tipoMetrica === 'temperatura') {
//                                 return value + '°C';
//                             } else if (tipoMetrica === 'bytes') {
//                                 return componenteAtivo === 'ram' ? value + 'GB' : value + 'GB';
//                             } else {
//                                 return value + '%';
//                             }
//                         }
//                     }
//                 }
//             },
//             plugins: {
//                 legend: {
//                     display: true,
//                     position: 'bottom',
//                     labels: {
//                         usePointStyle: true,
//                         pointStyle: 'Line',
//                         boxWidth: 20,
//                         padding: 15,
//                         font: {
//                             size: 14
//                         }
//                     },
//                     align: 'center'
//                 }
//             }
//         }
//     });
// }

// function inicializarGraficosRosquinha() {
//     // Grafico disco rosquinha
//     const ctx = document.getElementById('discoRosquinha').getContext('2d');
//     const gradiente1 = criarGradient(ctx);

//     let valor;

//     for(i = 0; i < dados.length; i++){
//         if(dados.dadosCaptura.componente == "CPU"){
//             valor = dados.dadosCaptura.dadosCaptura;
//         }
//     }

//     const disco_Rosquinha = new Chart(ctx, {
//         type: 'doughnut',
//         data: {
//             datasets: [{
//                 data: [valor],
//                 backgroundColor: [
//                     gradiente1,
//                     '#E0E0E0'
//                 ],
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             responsive: true,
//             plugins: {
//                 legend: {
//                 position: 'bottom'
//                 }
//             }
//         }
//     });

// // Grafico ram rosquinha
//     const ctx2 = document.getElementById('ramRosquinha').getContext('2d');
//     const ram_rosquinha = new Chart(ctx2, {
//         type: 'doughnut',
//         data: {
//             datasets: [{
//                 data: [75, 25],
//                 backgroundColor: [
//                     gradiente1,
//                     '#E0E0E0'
//                 ],
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             responsive: true,
//             plugins: {
//                 legend: {
//                     position: 'bottom'
//                 }
//             }
//         }
//     });

//     // Grafico cpu rosquinha
//     const ctx3 = document.getElementById('cpuRosquinha').getContext('2d');
//     const cpu_rosquinha = new Chart(ctx3, {
//         type: 'doughnut',
//         data: {
//             datasets: [{
//                 data: [82, 18],
//                 backgroundColor: [
//                     gradiente1,
//                     '#E0E0E0'
//                 ],
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             responsive: true,
//             plugins: {
//                 legend: {
//                     position: 'bottom'
//                 }
//             }
//         }
//     });

//     // Grafico gpu rosquinha
//     const ctx5 = document.getElementById('gpuRosquinha');
//     if (ctx5) {
//         const gpu_rosquinha = new Chart(ctx5.getContext('2d'), {
//             type: 'doughnut',
//             data: {
//                 datasets: [{
//                     data: [45, 55],
//                     backgroundColor: [
//                         gradiente1,
//                         '#E0E0E0'
//                     ],
//                     borderWidth: 1
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 plugins: {
//                         legend: {
//                         position: 'bottom'
//                     }
//                 }
//             }
//         });
//     }
// }

// function atualizarVisibilidadeBotoes() {
//     const btnTemp = document.getElementById('btn_temperatura');
//     const btnBytes = document.getElementById('btn_bytes');

//     if (btnTemp) {
//         // Mostrar botão de temperatura apenas para CPU e GPU
//         if (componenteAtivo === 'cpu' || componenteAtivo === 'gpu') {
//             btnTemp.style.display = 'inline-block';
//         } else {
//             btnTemp.style.display = 'none';
//             // Se o botão estiver oculto e a métrica atual for temperatura,
//             // alteramos para uso (métrica padrão)
//             if (tipoMetrica === 'temperatura') {
//                 tipoMetrica = 'uso';
//                 atualizarBotoesMetrica();
//             }
//         }
//     }

//     if (btnBytes) {
//         // Mostrar botão de bytes apenas para Disco e RAM
//         if (componenteAtivo === 'disk' || componenteAtivo === 'ram') {
//             btnBytes.style.display = 'inline-block';
//         } else {
//             btnBytes.style.display = 'none';
//             // Se o botão estiver oculto e a métrica atual for bytes,
//             // alteramos para uso (métrica padrão)
//             if (tipoMetrica === 'bytes') {
//                 tipoMetrica = 'uso';
//                 atualizarBotoesMetrica();
//             }
//         }
//     }
// }

    // Função inicializarEventosClique para atualizar botões ao mudar o componente
//     function inicializarEventosClique() {
//         // Evento de clique para o KPI Disco
//         if (discoElement) {
//             discoElement.addEventListener('click', () => {
//                 componenteAtivo = 'disk';
//                 atualizarKPIs();
//                 atualizarVisibilidadeBotoes();
//                 renderizarGraficoLinha();
//             });
//         }

//         // Evento de clique para o KPI RAM
//         if (ramElement) {
//             ramElement.addEventListener('click', () => {
//                 componenteAtivo = 'ram';
//                 atualizarKPIs();
//                 atualizarVisibilidadeBotoes();
//                 renderizarGraficoLinha();
//             });
//         }

//     // Evento de clique para o KPI CPU
//     if (cpuElement) {
//         cpuElement.addEventListener('click', () => {
//             componenteAtivo = 'cpu';
//             atualizarKPIs();
//             atualizarVisibilidadeBotoes();
//         renderizarGraficoLinha();
//         });
//     }

//     // Evento de clique para o KPI GPU
//     if (gpuElement) {
//         gpuElement.addEventListener('click', () => {
//             componenteAtivo = 'gpu';
//             atualizarKPIs();
//             atualizarVisibilidadeBotoes();
//             renderizarGraficoLinha();
//         });
//     }

//     // Adicionar eventos para botões de alternância de métrica
//     const btnUso = document.getElementById('btn_uso');
//     const btnTemp = document.getElementById('btn_temperatura');
//     const btnBytes = document.getElementById('btn_bytes');

//     if (btnUso) {
//         btnUso.addEventListener('click', () => {
//             tipoMetrica = 'uso';
//             renderizarGraficoLinha();
//             atualizarBotoesMetrica();
//         });
//     }

//     if (btnTemp) {
//         btnTemp.addEventListener('click', () => {
//             tipoMetrica = 'temperatura';
//             renderizarGraficoLinha();
//             atualizarBotoesMetrica();
//         });
//     }

//     if (btnBytes) {
//         btnBytes.addEventListener('click', () => {
//             tipoMetrica = 'bytes';
//             renderizarGraficoLinha();
//             atualizarBotoesMetrica();
//         });
//     }
// }

// // Função para atualizar a aparência dos botões de métrica
// function atualizarBotoesMetrica() {
//     const btnUso = document.getElementById('btn_uso');
//     const btnTemp = document.getElementById('btn_temperatura');
//     const btnBytes = document.getElementById('btn_bytes');

//     if (btnUso) btnUso.classList.remove('active');
//     if (btnTemp) btnTemp.classList.remove('active');
//     if (btnBytes) btnBytes.classList.remove('active');

//     if (tipoMetrica === 'uso' && btnUso) {
//         btnUso.classList.add('active');
//     } else if (tipoMetrica === 'temperatura' && btnTemp) {
//         btnTemp.classList.add('active');
//     } else if (tipoMetrica === 'bytes' && btnBytes) {
//         btnBytes.classList.add('active');
//     }
// }

// // Função para atualizar os gráficos apartir do filtro.
// function inicializarEventosFiltroTempo() {
//     const sltTempo = document.getElementById('slt_tempo');

//     if (sltTempo) {
//         sltTempo.addEventListener('change', () => {
//             renderizarGraficoLinha();
//         });
//     }
// }

// document.addEventListener('DOMContentLoaded', function () {
//     const dropdownHeader = document.getElementById('dropdown_header');
//     const dropdownContent = document.getElementById('dropdown_content');
//     const componenteAtivo = document.getElementById('componente_ativo');
//     const dropdownItems = document.querySelectorAll('.dropdown-item');

//     // Função para abrir/fechar o dropdown
//     dropdownHeader.addEventListener('click', function () {
//         dropdownContent.classList.toggle('show');
//     });

//     // Fechar o dropdown quando clicar fora dele
//     window.addEventListener('click', function (event) {
//         if (!event.target.closest('.componente-dropdown') && dropdownContent.classList.contains('show')) {
//             dropdownContent.classList.remove('show');
//         }
//     });

//     // Atualizar o componente selecionado ao clicar em um item do dropdown
//     dropdownItems.forEach(item => {
//         item.addEventListener('click', function () {
//             const component = this.getAttribute('data-component');
//             componenteAtivo.textContent = this.textContent;
//             dropdownContent.classList.remove('show');

//             // Atualizar o componente ativo no sistema
//             if (typeof window.setComponenteAtivo === 'function') {
//                 window.setComponenteAtivo(component);
//             } else {
//                 // Fallback se a função não estiver disponível
//                 console.log('Componente selecionado:', component);
//             }
//         });
//     });
// });

// Função para inicializar a página
// function inicializar() {
//     inicializarGraficosRosquinha();
//     inicializarEventosClique();
//     inicializarEventosFiltroTempo();

//     // Renderizar o gráfico inicial (GPU por padrão)
//     renderizarGraficoLinha();

//     // Atualizar os KPIs iniciais
//     atualizarKPIs();

//     // Atualizar botões de métrica
//     atualizarBotoesMetrica();
//     atualizarVisibilidadeBotoes();
// }

// // Iniciar quando o DOM estiver carregado
// document.addEventListener('DOMContentLoaded', inicializar);