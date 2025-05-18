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


let componenteAtivo = 'gpu';
let graficoAtual = null;
let tipoMetrica = 'uso';

let dados = [];

async function carregarDados(){
    try{
        const resposta = await fetch('http://127.0.0.1:8000/monitoramento/coletar/dados/3');

        if(!resposta.ok){
            console.error("Erro no fecth.");
            return;
        }

        const capturaObjeto = resposta.json();
        if(Array.isArray(capturaObjeto)){
            dados = capturaObjeto;
        }else{
            console.error("Resposta não é uma lista");
        }
    }catch(erro){
        console.error("Erro. ", erro);
    }


}


function atualizarKPIs() {
    // Esconde todos os KPIs primeiro
    if (discoElement) discoElement.style.display = 'flex', rm_divisao.style.display = 'flex';
    if (ramElement) ramElement.style.display = 'flex';
    if (cpuElement) cpuElement.style.display = 'flex', rm_divisao_ram.style.display = 'flex';
    if (gpuElement) gpuElement.style.display = 'flex', rm_divisao_gpu.style.display = 'flex';

    // Esconde o componente ativo (que está sendo mostrado no gráfico de linha)
    if (componenteAtivo === 'disk' && discoElement) {
        discoElement.style.display = 'none';
        rm_divisao_ram.style.display = 'none';
    } else if (componenteAtivo === 'ram' && ramElement) {
        ramElement.style.display = 'none';
        rm_divisao.style.display = 'none';
    } else if (componenteAtivo === 'cpu' && cpuElement) {
        cpuElement.style.display = 'none';
        rm_divisao.style.display = 'none';
    } else if (componenteAtivo === 'gpu' && gpuElement) {
        gpuElement.style.display = 'none';
        rm_divisao_gpu.style.display = 'none';
    }

    // Atualiza as informações dos KPIs
    if (kpi1_nome && componenteAtivo !== 'disk') {
        kpi1_nome.textContent = "Disco";
        kpi1_metrica1.textContent = kpiData.disk.usage;
        kpi1_metrica2.textContent = kpiData.disk.free;
    }

    if (kpi2_nome && componenteAtivo !== 'ram') {
        kpi2_nome.textContent = "RAM";
        kpi2_metrica1.textContent = kpiData.ram.usage;
        kpi2_metrica2.textContent = kpiData.ram.free;
    }

    if (kpi3_nome && componenteAtivo !== 'cpu') {
        kpi3_nome.textContent = "CPU";
        kpi3_metrica1.textContent = kpiData.cpu.usage;
        kpi3_metrica2.textContent = kpiData.cpu.temperature;
    }

    // O componente ativo será exibido como título do gráfico de linha
    document.getElementById('componente_ativo').textContent = componenteAtivo.toUpperCase();
}

// Função para criar a cor de degrade
function criarGradient(ctx) {
    const gradiente1 = ctx.createLinearGradient(0, 0, 200, 0);
    gradiente1.addColorStop(0.2, '#10D3F9');
    gradiente1.addColorStop(0.5, '#740BC6');
    return gradiente1;
}

// Função para renderizar o gráfico de linha com base no componente ativo
function renderizarGraficoLinha() {
    const ctx4 = document.getElementById('grafico_linha').getContext('2d');

    // Destruir gráfico anterior se existir
    if (graficoAtual !== null) {
        graficoAtual.destroy();
    }

    // Obter o valor selecionado no filtro de tempo
    const filtroTempo = document.getElementById('slt_tempo').value;

    // Obter os dados 
    let labels = [];
    let datasets = [];
    let dadosComponente;

    // Selecionar com base no filtro de tempo
    if (filtroTempo === '30s') {
        // Últimos 30 segundos de dados
        dadosComponente = {
            gpu: graphData.gpu.slice(-30),
            cpu: graphData.cpu.slice(-30),
            disk: graphData.disk.slice(-30),
            ram: graphData.ram.slice(-30)
        };
    } else if (filtroTempo === '1') {
        // Último minuto de dados (60 segundos)
        dadosComponente = {
            gpu: graphData.gpu,
            cpu: graphData.cpu,
            disk: graphData.disk,
            ram: graphData.ram
        };
    } else if (filtroTempo === '10') {
        // Últimos 10 minutos de dados
        dadosComponente = {
            gpu: graphDataMinuto.gpu.slice(-10),
            cpu: graphDataMinuto.cpu.slice(-10),
            disk: graphDataMinuto.disk.slice(-10),
            ram: graphDataMinuto.ram.slice(-10)
        };
    } else if (filtroTempo === '30m') {
        // Últimos 30 minutos de dados
        dadosComponente = {
            gpu: graphDataMinuto.gpu,
            cpu: graphDataMinuto.cpu,
            disk: graphDataMinuto.disk,
            ram: graphDataMinuto.ram
        };
    } else {
        // Padrão: últimos 30 segundos
        dadosComponente = {
            gpu: graphData.gpu.slice(-30),
            cpu: graphData.cpu.slice(-30),
            disk: graphData.disk.slice(-30),
            ram: graphData.ram.slice(-30)
        };
    }


    // Configurar os dados com base no componente selecionado
    if (componenteAtivo === 'gpu') {
        labels = dados.dataHora;

        datasets = [
            {
                label: 'GPU01',
                data: dadosComponente.gpu.map(item => item.GPU01),
                borderColor: 'blue',
                fill: false,
                tension: 0.1
            },
            {
                label: 'GPU02',
                data: dadosComponente.gpu.map(item => item.GPU02),
                borderColor: 'orange',
                fill: false,
                tension: 0.1
            },
            {
                label: 'GPU03',
                data: dadosComponente.gpu.map(item => item.GPU03),
                borderColor: 'green',
                fill: false,
                tension: 0.1
            },
            {
                label: 'GPU04',
                data: dadosComponente.gpu.map(item => item.GPU04),
                borderColor: 'lightblue',
                fill: false,
                tension: 0.1
            }
        ];
    } else if (componenteAtivo === 'cpu') {
        labels = dadosComponente.cpu.map(item => item.time);

        if (tipoMetrica === 'temperatura') {
            datasets = [
                {
                    label: 'Temperatura',
                    data: dados.dadosCaptura.map(item => item.dadosCaptura),
                    borderColor: 'red',
                    fill: false,
                    tension: 0.1
                }
            ];
        } else {
            datasets = [
                {
                    label: 'Uso',
                    data: dadosComponente.cpu.map(item => item.Usage),
                    borderColor: 'blue',
                    fill: false,
                    tension: 0.1
                }
            ];
        }
    } else if (componenteAtivo === 'disk') {
        labels = dadosComponente.disk.map(item => item.time);

        if (tipoMetrica === 'bytes') {
            datasets = [
                {
                    label: 'Uso em GB',
                    data: dadosComponente.disk.map(item => item.UsageBytes),
                    borderColor: 'purple',
                    fill: false,
                    tension: 0.1
                }
            ];
        } else {
            datasets = [
                {
                    label: 'Uso %',
                    data: dadosComponente.disk.map(item => item['Usage%']),
                    borderColor: 'blue',
                    fill: false,
                    tension: 0.1
                }
            ];
        }
    } else if (componenteAtivo === 'ram') {
        labels = dadosComponente.ram.map(item => item.time);

        if (tipoMetrica === 'bytes') {
            datasets = [
                {
                    label: 'Uso em GB',
                    data: dadosComponente.ram.map(item => item.UsageBytes),
                    borderColor: 'green',
                    fill: false,
                    tension: 0.1
                }
            ];
        } else {
            datasets = [
                {
                    label: 'Uso %',
                    data: dadosComponente.ram.map(item => item['Usage%']),
                    borderColor: 'blue',
                    fill: false,
                    tension: 0.1
                }
            ];
        }
    }

    // Configurar e criar o gráfico
    graficoAtual = new Chart(ctx4, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: tipoMetrica === 'uso' ? 100 :
                         tipoMetrica === 'temperatura' ? 100 :
                         componenteAtivo === 'cpu' && tipoMetrica === 'temperatura' ? 100 :
                         componenteAtivo === 'disk' && tipoMetrica === 'bytes' ? 600 :
                         componenteAtivo === 'ram' && tipoMetrica === 'bytes' ? 16 : 80,
                    ticks: {
                        stepSize: 10,
                        callback: function (value) {
                            if (tipoMetrica === 'temperatura') {
                                return value + '°C';
                            } else if (tipoMetrica === 'bytes') {
                                return componenteAtivo === 'ram' ? value + 'GB' : value + 'GB';
                            } else {
                                return value + '%';
                            }
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'Line',
                        boxWidth: 20,
                        padding: 15,
                        font: {
                            size: 14
                        }
                    },
                    align: 'center'
                }
            }
        }
    });
}

function inicializarGraficosRosquinha() {
    // Grafico disco rosquinha
    const ctx = document.getElementById('discoRosquinha').getContext('2d');
    const gradiente1 = criarGradient(ctx);

    let valor;

    for(i = 0; i < dados.length; i++){
        if(dados.dadosCaptura.componente == "CPU"){
            valor = dados.dadosCaptura.dadosCaptura;
        }
    }

    const disco_Rosquinha = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [valor],
                backgroundColor: [
                    gradiente1,
                    '#E0E0E0'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                position: 'bottom'
                }
            }
        }
    });

// Grafico ram rosquinha
    const ctx2 = document.getElementById('ramRosquinha').getContext('2d');
    const ram_rosquinha = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [75, 25],
                backgroundColor: [
                    gradiente1,
                    '#E0E0E0'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Grafico cpu rosquinha
    const ctx3 = document.getElementById('cpuRosquinha').getContext('2d');
    const cpu_rosquinha = new Chart(ctx3, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [82, 18],
                backgroundColor: [
                    gradiente1,
                    '#E0E0E0'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Grafico gpu rosquinha
    const ctx5 = document.getElementById('gpuRosquinha');
    if (ctx5) {
        const gpu_rosquinha = new Chart(ctx5.getContext('2d'), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [45, 55],
                    backgroundColor: [
                        gradiente1,
                        '#E0E0E0'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                        legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

function atualizarVisibilidadeBotoes() {
    const btnTemp = document.getElementById('btn_temperatura');
    const btnBytes = document.getElementById('btn_bytes');

    if (btnTemp) {
        // Mostrar botão de temperatura apenas para CPU e GPU
        if (componenteAtivo === 'cpu' || componenteAtivo === 'gpu') {
            btnTemp.style.display = 'inline-block';
        } else {
            btnTemp.style.display = 'none';
            // Se o botão estiver oculto e a métrica atual for temperatura,
            // alteramos para uso (métrica padrão)
            if (tipoMetrica === 'temperatura') {
                tipoMetrica = 'uso';
                atualizarBotoesMetrica();
            }
        }
    }

    if (btnBytes) {
        // Mostrar botão de bytes apenas para Disco e RAM
        if (componenteAtivo === 'disk' || componenteAtivo === 'ram') {
            btnBytes.style.display = 'inline-block';
        } else {
            btnBytes.style.display = 'none';
            // Se o botão estiver oculto e a métrica atual for bytes,
            // alteramos para uso (métrica padrão)
            if (tipoMetrica === 'bytes') {
                tipoMetrica = 'uso';
                atualizarBotoesMetrica();
            }
        }
    }
}

    // Função inicializarEventosClique para atualizar botões ao mudar o componente
    function inicializarEventosClique() {
        // Evento de clique para o KPI Disco
        if (discoElement) {
            discoElement.addEventListener('click', () => {
                componenteAtivo = 'disk';
                atualizarKPIs();
                atualizarVisibilidadeBotoes();
                renderizarGraficoLinha();
            });
        }

        // Evento de clique para o KPI RAM
        if (ramElement) {
            ramElement.addEventListener('click', () => {
                componenteAtivo = 'ram';
                atualizarKPIs();
                atualizarVisibilidadeBotoes();
                renderizarGraficoLinha();
            });
        }

    // Evento de clique para o KPI CPU
    if (cpuElement) {
        cpuElement.addEventListener('click', () => {
            componenteAtivo = 'cpu';
            atualizarKPIs();
            atualizarVisibilidadeBotoes();
        renderizarGraficoLinha();
        });
    }

    // Evento de clique para o KPI GPU
    if (gpuElement) {
        gpuElement.addEventListener('click', () => {
            componenteAtivo = 'gpu';
            atualizarKPIs();
            atualizarVisibilidadeBotoes();
            renderizarGraficoLinha();
        });
    }

    // Adicionar eventos para botões de alternância de métrica
    const btnUso = document.getElementById('btn_uso');
    const btnTemp = document.getElementById('btn_temperatura');
    const btnBytes = document.getElementById('btn_bytes');

    if (btnUso) {
        btnUso.addEventListener('click', () => {
            tipoMetrica = 'uso';
            renderizarGraficoLinha();
            atualizarBotoesMetrica();
        });
    }

    if (btnTemp) {
        btnTemp.addEventListener('click', () => {
            tipoMetrica = 'temperatura';
            renderizarGraficoLinha();
            atualizarBotoesMetrica();
        });
    }

    if (btnBytes) {
        btnBytes.addEventListener('click', () => {
            tipoMetrica = 'bytes';
            renderizarGraficoLinha();
            atualizarBotoesMetrica();
        });
    }
}

// Função para atualizar a aparência dos botões de métrica
function atualizarBotoesMetrica() {
    const btnUso = document.getElementById('btn_uso');
    const btnTemp = document.getElementById('btn_temperatura');
    const btnBytes = document.getElementById('btn_bytes');

    if (btnUso) btnUso.classList.remove('active');
    if (btnTemp) btnTemp.classList.remove('active');
    if (btnBytes) btnBytes.classList.remove('active');

    if (tipoMetrica === 'uso' && btnUso) {
        btnUso.classList.add('active');
    } else if (tipoMetrica === 'temperatura' && btnTemp) {
        btnTemp.classList.add('active');
    } else if (tipoMetrica === 'bytes' && btnBytes) {
        btnBytes.classList.add('active');
    }
}

// Função para atualizar os gráficos apartir do filtro.
function inicializarEventosFiltroTempo() {
    const sltTempo = document.getElementById('slt_tempo');

    if (sltTempo) {
        sltTempo.addEventListener('change', () => {
            renderizarGraficoLinha();
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const dropdownHeader = document.getElementById('dropdown_header');
    const dropdownContent = document.getElementById('dropdown_content');
    const componenteAtivo = document.getElementById('componente_ativo');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    // Função para abrir/fechar o dropdown
    dropdownHeader.addEventListener('click', function () {
        dropdownContent.classList.toggle('show');
    });

    // Fechar o dropdown quando clicar fora dele
    window.addEventListener('click', function (event) {
        if (!event.target.closest('.componente-dropdown') && dropdownContent.classList.contains('show')) {
            dropdownContent.classList.remove('show');
        }
    });

    // Atualizar o componente selecionado ao clicar em um item do dropdown
    dropdownItems.forEach(item => {
        item.addEventListener('click', function () {
            const component = this.getAttribute('data-component');
            componenteAtivo.textContent = this.textContent;
            dropdownContent.classList.remove('show');

            // Atualizar o componente ativo no sistema
            if (typeof window.setComponenteAtivo === 'function') {
                window.setComponenteAtivo(component);
            } else {
                // Fallback se a função não estiver disponível
                console.log('Componente selecionado:', component);
            }
        });
    });
});

// Função para inicializar a página
function inicializar() {
    inicializarGraficosRosquinha();
    inicializarEventosClique();
    inicializarEventosFiltroTempo();

    // Renderizar o gráfico inicial (GPU por padrão)
    renderizarGraficoLinha();

    // Atualizar os KPIs iniciais
    atualizarKPIs();

    // Atualizar botões de métrica
    atualizarBotoesMetrica();
    atualizarVisibilidadeBotoes();
}

// Iniciar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', inicializar);