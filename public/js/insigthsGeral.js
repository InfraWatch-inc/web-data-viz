isChart = false;
function carregarDados(){
    let periodo = slt_tempo.value; 

    fetch(`/insights/alertasComponentes/${periodo}/${sessionStorage.ID_EMPRESA}`, {
        method: 'GET',
        headers: {
            'Content-Type':'application/json',
        }
    })
    .then(res => {
        res.json()
        .then(dados => {
            console.log(dados);
            atribuirKpi(dados.totalAlertasMemoria, dados.totalAlertasProcessamento);
            construirGrafico(dados.componentes, dados.dadosCriticos, dados.dadosModerados);
        })
    })
    .catch(error => {
        console.error('Erro ao buscar dados:', error);
        alert('Falha ao buscar dados do dashboard.');
    });
}

function atribuirKpi(alertasMemoria, alertasProcessamento){
    spanAlertasProcessamento.innerText = `${alertasProcessamento} Alertas`;
    spanAlertasMemoria.innerText = `${alertasMemoria} Alertas`;

}

function construirGrafico(componentes, dadosCriticos, dadosModerados){
    if(isChart){
        const chart = document.getElementById('myChart');
        if (chart) {
            chart.remove(); 
        }

        const canvas = `<canvas id="myChart"></canvas>`;
        document.getElementById('div_canva').innerHTML = canvas;
    } 
    
    const ctx = document.getElementById("myChart");

    new Chart(ctx, {
    type: "bar",
    data: {
        labels: componentes,
        datasets: [
        {
            label: "Moderado",
            data: dadosModerados,
            borderWidth: 1,
            backgroundColor: 'rgba(255, 161, 0)',
            borderRadius: 5,
            borderSkipped: false,
            order: 1
        },
        {
            label: "Críticos",
            data: dadosCriticos,
            borderWidth: 1,
            backgroundColor: 'rgba(	205, 48, 48)',
            borderRadius: 5,
            borderSkipped: false,
            order: 2
        },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x',
        barPercentage: 0.7,
        categoryPercentage: 0.8,
        scales: {
        y: {
            beginAtZero: true,
            ticks: {
            stepSize: 5,
            font: {
                size: 12
            }
            },
            title: {
            display: true,
            text: 'Quantidade de Alertas',
            font: {
                size: 20
            }
            },
            grid: {
            color: 'rgba(0, 0, 0, 0.1)'
            }
        },
        x: {
            title: {
            display: true,
            text: 'Componentes',
            font: {
                size: 20
            }
            },
            grid: {
            display: false
            }
        }
        },
        plugins: {
        legend: {
            labels: {
            usePointStyle: true,
            boxWidth: 40,
            padding: 40
            }
        },
        title: {
            display: true,
            position: "top",
            text: "Distribuição de Alertas por Componente",
            font: {
            size: 25,
            weight: 'bold'
            },
            padding: {
            top: 10,
            bottom: 30,
            },
        },
        },
    },
    });
    isChart = true;

}

carregarDados();
