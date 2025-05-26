let dadosDash = {
    kpiCritico: 'NA',
    kpiAtencao: 'NA',
    componenteUso: 'NA',
    alertasProcessos:{
        processos:[],
        alertas:{
            atencao:[],
            critico:[]
        }
    },
    consumoProcessos:{
        gpu:{
            processos:[],
            dados:[]
        },
        cpu:{
            processos:[],
            dados:[]
        },
        ram:{
            processos:[],
            dados:[]
        }
    }
}

let chartInstance;

function coletarDados(){
    let dtInicial = iptDtInicial.value;

    let quantidade = iptQuantidade.value;
    let meses = slctPeriodo.value;

    let periodo = 1;
    let dataInicial = undefined;
    let dataFinal = undefined;

    let dataFinalFormatada = undefined;
    let dataInicialFormatada = undefined;

    if(dtInicial == ''){
        dataInicial = new Date(Date.now());
        const dia = String(dataInicial.getDate()).padStart(2, '0');
        const mes = String(dataInicial.getMonth() + 1).padStart(2, '0');
        const ano = dataInicial.getFullYear();
        dataInicialFormatada = `${ano}-${mes}-${dia}`;
        iptDtInicial.value = dataInicialFormatada;
    } else {
        dataInicial = new Date(dtInicial);
    }

    if((quantidade == '' || quantidade == undefined || quantidade == NaN )&& meses == '1'){
        quantidade = '1';
        meses = '6';
        iptQuantidade.value = quantidade;
        slctPeriodo.value = meses;

    } else if(quantidade == ''){
        quantidade = '1';
        iptQuantidade.value = quantidade;
    }

    
    periodo = Number(quantidade) * Number(meses);
    console.log(periodo);
    console.log(dataInicial) // funciona
    dataInicial.setMonth(dataInicial.getMonth() - periodo);
    console.log(dataInicial) // da erro
    const dia = String(dataInicial.getDate()).padStart(2, '0');
    const mes = String(dataInicial.getMonth() + 1).padStart(2, '0');
    const ano = dataInicial.getFullYear();
    dataFinalFormatada = `${ano}-${mes}-${dia}`;

    console.log(dataFinalFormatada);
    
    // TODO BUSCAR NO BANCO OS DADOS DE ALERTAS DENTRO DAS DATAS INFORMADAS
    


    dados = {
        processoMaisCritico:'Blender',
        processoMaisAtencao:'Maya',
        componenteMaisConsumido:'CPU',
        dadosProcessosAlertas:[
            {nome:'Blender', alertasAtencao:13, alertasCritico:23},
            {nome:'Maya', alertasAtencao:14, alertasCritico:8},
            {nome:'After Effects', alertasAtencao:14, alertasCritico:7},
            {nome:'Unity', alertasAtencao:13, alertasCritico:6},
            {nome:'DaVinci', alertasAtencao:6, alertasCritico:1}
        ],
        dadosProcessosConsumo:{
            gpu:[
                {nome:'Blender', captura:92},
                {nome:'Maya', captura:79},
                {nome:'After Effects', captura:74},
                {nome:'Unity', captura:49},
                {nome:'DaVinci', captura:47}
            ],
            cpu:[
                {nome:'Blender', captura:93},
                {nome:'Maya', captura:88},
                {nome:'After Effects', captura:74},
                {nome:'Unity', captura:34},
                {nome:'DaVinci', captura:29}
            ],
            ram:[
                {nome:'Blender', captura:80},
                {nome:'Maya', captura:75},
                {nome:'After Effects', captura:68},
                {nome:'Unity', captura:43},
                {nome:'DaVinci', captura:21}
            ]
            
        }
    }

    organizarDados(dados);   
}

function organizarDados(dados){
    dadosDash.kpiCritico = dados.processoMaisCritico;
    dadosDash.kpiAtencao = dados.processoMaisAtencao;
    dadosDash.componenteUso = dados.componenteMaisConsumido;

    dados.dadosProcessosAlertas.forEach((processo)=>{
        dadosDash.alertasProcessos.processos.push(processo.nome);
        dadosDash.alertasProcessos.alertas.atencao.push(processo.alertasAtencao);
        dadosDash.alertasProcessos.alertas.critico.push(processo.alertasCritico);
    });

    dados.dadosProcessosConsumo.gpu.forEach((processo) => {
        dadosDash.consumoProcessos.gpu.processos.push(processo.nome);
        dadosDash.consumoProcessos.gpu.dados.push(processo.captura);
    });

    dados.dadosProcessosConsumo.cpu.forEach((processo) => {
        dadosDash.consumoProcessos.cpu.processos.push(processo.nome);
        dadosDash.consumoProcessos.cpu.dados.push(processo.captura);
    });

    dados.dadosProcessosConsumo.ram.forEach((processo) => {
        dadosDash.consumoProcessos.ram.processos.push(processo.nome);
        dadosDash.consumoProcessos.ram.dados.push(processo.captura);
    });

    atualizarFront(); 
}

function alterarComponente(componente){
    let dadosConsumo = eval(`dadosDash.consumoProcessos.${componente.toLowerCase()}`)
    let processos = eval(`dadosDash.consumoProcessos.${componente.toLowerCase()}.processos`)
    carregarGraficoConsumoProcessos(componente, processos, dadosConsumo);
}

function atualizarFront(){
    kpiComponente.innerText = dadosDash.componenteUso;
    kpiAlertasAtencao.innerText = dadosDash.kpiAtencao;
    kpiAlertasCritico.innerText = dadosDash.kpiCritico;

    carregarGraficoAlertasProcessos(dadosDash.alertasProcessos.processos, dadosDash.alertasProcessos.alertas);

    let componente = dadosDash.componenteUso;
    let dadosConsumo = eval(`dadosDash.consumoProcessos.${componente.toLowerCase()}.dados`)
    let processos = eval(`dadosDash.consumoProcessos.${componente.toLowerCase()}.processos`)
    carregarGraficoConsumoProcessos(componente, processos, dadosConsumo);
}

function carregarGraficoConsumoProcessos(componente, processos, dadosConsumo){
    const consumo = document.getElementById('chartConsumoProcessos').getContext('2d');

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(consumo, {
        type: 'bar',
        data: {
            labels: processos,
            datasets: [
                {
                    label: 'Consumo',
                    data: dadosConsumo,
                    backgroundColor: '#7728B5',
                    borderRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Processos que mais Consumem ${componente}`,
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                },

            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: `Consumo da ${componente} (%)`
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Processos'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function carregarGraficoAlertasProcessos(processos, dadoAlertas){
    const alertas = document.getElementById('chartAlertasProcessos');

    new Chart(alertas, {
        type: 'bar',
        data: {
            labels: processos,
            datasets: [
                {
                    label: 'Atenção',
                    data: dadoAlertas.atencao,
                    backgroundColor: '#7728B5',
                    borderRadius: 5,
                },
                {
                    label: 'Críticos',
                    data: dadoAlertas.critico,
                    backgroundColor: '#33CDEB',
                    borderRadius: 5,
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Processos com mais Alertas',
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                },

            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Quantidade de Alertas'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Processos'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

coletarDados();