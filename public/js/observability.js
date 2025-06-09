const componentesKpi = [
    { idCanvas: 'chartKpiDisco', idSpan: 'valorUsoDisco', componente: 'DISCO', metrica: '%' },
    { idCanvas: 'chartKpiRam', idSpan: 'valorUsoRam', componente: 'RAM', metrica: '%' },
    { idCanvas: 'chartKpiCpu', idSpan: 'valorUsoCpu', componente: 'CPU', metrica: '%' }
];

function carregarDados(){
    // TODO bucar dados com o fetch

    // Exemplo de dados fictícios
    const dados = {
        disco: { usado: 70, livre: 30},
        ram: { usado: 60, livre: 40 },
        cpu: { usado: 80, livre: 20, temperatura: 70}
    };

    construirDash(dados);
}

function construirDash(dados){
    construirGraficosKpi(dados);
    construirGraficoDestaque();
}

function criarGradient(ctx) {
    const gradiente1 = ctx.createLinearGradient(0, 0, 200, 0);
    gradiente1.addColorStop(0.2, '#10D3F9');
    gradiente1.addColorStop(0.5, '#740BC6');
    return gradiente1;
}

function construirGraficosKpi(dados){
    componentesKpi.forEach(componente => {
        const canvasElement = document.getElementById(componente.idCanvas);
        if (canvasElement) {
            const ctx = canvasElement.getContext('2d');
            const gradiente = criarGradient(ctx);

            if (!dados || !dados[componente.componente.toLowerCase()]) {
                console.error(`Dados não encontrados para o componente: ${componente.componente}`);
                return;
            }

            const usado = dados[componente.componente.toLowerCase()].usado;
            const livre = dados[componente.componente.toLowerCase()].livre;

            document.getElementById(componente.idSpan).textContent = `${usado.toFixed(1)}${componente.metrica}`;

            let className = usado > 75 ? 'text-danger' : usado > 50 ? 'text-alert' : 'text-fine';
            document.getElementById(componente.idSpan).classList.add(className);

            if(componente.componente === 'CPU') {
                const temp = dados[componente.componente.toLowerCase()].temperatura;
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

function construirGraficoDestaque(){

}

carregarDados();