const componentesKpi = [
    { idCanvas: 'chartKpiDisco', idSpan: 'valorUsoDisco', componente: 'DISCO', metrica: '%' },
    { idCanvas: 'chartKpiRam', idSpan: 'valorUsoRam', componente: 'RAM', metrica: '%' },
    { idCanvas: 'chartKpiCpu', idSpan: 'valorUsoCpu', componente: 'CPU', metrica: '%' }
];

let isPrimeiroConsumo = true;
let dadosMonitoramento = undefined;

async function carregarDados(){
    // TODO bucar dados com o fetch
    await fetch(`/monitoramento/instancia?isPrimeiro=${isPrimeiroConsumo}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`Erro na requisição: ${res.status}`);
        }
        return res.json();
    })
    .then(dados => {
        if(isPrimeiroConsumo){
            dadosMonitoramento = dados;
        } else {
            dadosMonitoramento.add(dados)
        }
    })
    .catch(error => {
        console.error('Erro ao buscar dados:', error);
        alert('Falha ao buscar dados do dashboard.');
    });

    construirDash(dadosMonitoramento);
}

function organizarDados(){
    let espacoTempo = Number(slctTempo.value); // espaco de tempo definido pelo user

    let objeto = {
        componenteMaisUtilizado: 'cpu',
        dados: {
            cpu: [], // {usado:, livre:, temperatura:}
            disco: [],
            ram: [],
        },
        labels: [] // str dos horarios normal 
    }
    
    // componente mais utilizado 
    if(dadosMonitoramento[dadosMonitoramento.length -1].memoria > 60 || dadosMonitoramento[dadosMonitoramento.length -1].memoria > dadosMonitoramento[dadosMonitoramento.length -1].cpu){
        objeto.componenteMaisUsado = 'ram'
    } 

    let qtdCapturas = espacoTempo * 60 / 30;
    let ultimoIndex = dadosMonitoramento.length -1;

    let startIndex = Math.max(0, ultimoIndex - qtdCapturas);
    let dadosPeriodo = dadosMonitoramento.slice(startIndex, ultimoIndex);
   
    dadosPeriodo.forEach((captura) => {
        console.log(captura);
        objeto.labels.push(captura.data_hora)
     
        let objCpu = {usado:captura.cpu, livre:captura.cpu - 100, temperatura:captura.temperatura}
        let objRam = {usado:captura.memoria, livre:captura.memoria - 100}
        let objDisco = {usado:captura.disco, livre:captura.disco - 100}

        objeto.dados.cpu.push(objCpu);
        objeto.dados.ram.push(objRam);
        objeto.dados.disco.push(objDisco);
    });
    
    return objeto;
}

function construirDash(dados){
    const dadosMonitor= organizarDados();
    slctComponente.value = dadosMonitor.componenteMaisUsado;
    
    construirGraficosKpi(dadosMonitor.dados);
    construirGraficoDestaque(dadosMonitor.dados[dadosMonitor.componenteMaisUsado], dadosMonitor.labels, dadosMonitor.componenteMaisUsado);
}

function criarGradient(ctx) {
    const gradiente1 = ctx.createLinearGradient(0, 0, 200, 0);
    gradiente1.addColorStop(0.2, '#10D3F9');
    gradiente1.addColorStop(0.5, '#740BC6');
    return gradiente1;
}

function construirGraficosKpi(dados){
    console.log(dados)
    componentesKpi.forEach(componente => {
        const canvasElement = document.getElementById(componente.idCanvas);
        if (canvasElement) {
            const ctx = canvasElement.getContext('2d');
            const gradiente = criarGradient(ctx);

            if (!dados || !dados[componente.componente.toLowerCase()]) {
                console.error(`Dados não encontrados para o componente: ${componente.componente}`);
                return;
            }

            let array = dados[componente.componente.toLowerCase()]

            const usado = array[array.length - 1].usado;
            const livre = array[array.length - 1].livre;

            document.getElementById(componente.idSpan).textContent = `${usado.toFixed(1)}${componente.metrica}`;

            let className = usado > 75 ? 'text-danger' : usado > 50 ? 'text-alert' : 'text-fine';
            document.getElementById(componente.idSpan).classList.add(className);

            if(componente.componente === 'CPU') {
                const temp = array[array.length - 1].temperatura;
                document.getElementById('valorTempCpu').textContent = `${temp}°C`;
                className = temp > 75 ? 'text-danger' : temp > 50 ? 'text-alert' : 'text-fine';
                document.getElementById('valorTempCpu').classList.add(className);
            }
                       
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [usado, livre], 
                        backgroundColor: [gradiente, '#E0E0E0'], 
                        borderColor: '#FFFFFF',
                        borderWidth: 2,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '60%',
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    let label = (context.dataIndex === 0) ? `Uso ${componente.componente}` : 'Livre';
                                    return `${label}: ${context.parsed.toFixed(1)}${componente.metrica}`;
                                }
                            }
                        }
                    }
                }
            });
        }
    });
}

function construirGraficoDestaque(dados, label, componente){
    

    graficoAtualLinha = new Chart(chartComponente, {
        type: 'line',
        data: {
            labels: label, // LABELS DAS DATAS CAPTURA
            datasets: [{
                label: `Uso do ${componente}`,
                data: dados,
                borderColor: '#740BC6',
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
                    title: {
                        display: true,
                        text: `Consumo da ${componente} (%)`,
                        font:{
                            size: 26
                        },
                        color:'#333333'
                    },
                    ticks: {
                        font:{
                            size: 20
                        }
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 0,
                        autoSkip: true,
                        font:{
                            size: 20
                        }
                    },
                    title: {
                        display: true,
                        text: 'Horário Captura',
                        font:{
                            size: 26
                        },
                        color:'#333333'
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: { 
                    display: true,
                    position: 'top',
                    align: 'center',
                    labels: {
                        font: {
                            size: 20
                        }
                    }
                },
                title: {
                    display: true,
                    text: `Dado em tempo real do Uso da ${componente}`,
                    font: {
                        size: 28,
                        weight: 'bold'
                    },
                    color:'#333333'
                }
            },
            interaction: { mode: 'index', intersect: false },
        }
    });
}

carregarDados();