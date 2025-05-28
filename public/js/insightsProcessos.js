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
            dados:{
                manha:[],
                tarde:[],
                noite:[]
            }
        },
        cpu:{
            processos:[],
            dados:{
                manha:[],
                tarde:[],
                noite:[]
            }
        },
        ram:{
            processos:[],
            dados:{
                manha:[],
                tarde:[],
                noite:[]
            }
        }
    }
}

let chartInstance;

function coletarDados(){
    let dtInicial = iptDtInicial.value;
    let dtFinal = iptDtFinal.value;

    let periodo = 1;
    let dataInicial = undefined;
    let dataFinal = undefined;

    let dataFinalFormatada = undefined;
    let dataInicialFormatada = undefined;

    if(dtInicial == '' && dtFinal == ''){
        periodo = 6;
        dataInicial = new Date(Date.now());
        dataInicial.setMonth(dataInicial.getMonth() - periodo);
        console.log(dataInicial)

        let dia = String(dataInicial.getDate()).padStart(2, '0');
        let mes = String(dataInicial.getMonth() + 1).padStart(2, '0');
        let ano = dataInicial.getFullYear();
        dataInicialFormatada = `${ano}-${mes}-${dia}`;

        dataFinal = dataInicial;

        dia = String(dataInicial.getDate()).padStart(2, '0');
        mes = String(dataInicial.getMonth() + 1).padStart(2, '0');
        ano = dataInicial.getFullYear();
        dataFinalFormatada = `${ano}-${mes}-${dia}`;
    }

    if(dtInicial == '' && dtFinal != ''){
        dataInicial = new Date(Date.now());
        const dia = String(dataInicial.getDate()).padStart(2, '0');
        const mes = String(dataInicial.getMonth() + 1).padStart(2, '0');
        const ano = dataInicial.getFullYear();
        dataInicialFormatada = `${ano}-${mes}-${dia}`;
        iptDtInicial.value = dataInicialFormatada;
    } else {
        // TODO popar erro data final
    } 

    if(dataInicial >= dataFinal){
        // TODO popar erro
    }

    // TODO validar as data para preencher o #tituloDash
       // msg default: Insights de Processos
       // se for de 3 meses, escrever: Insights de Processos no último Trimestre
       // se for de 6 meses, escrever: Insights de Processos no último Semestre
       // se for de 12 meses, escrever: Insights de Processos no último Ano
       // se for meses quebrados fora esses, mostra os meses de fato
       // se for menos que 1 mes, escrever: Insights de Processos nos ultimos X dias 
       // verificar pluralidade de meses 
           // se for 1 mes, escrever: Insights de Processos no último Mês
           // se for mais que 1 mes, escrever: Insights de Processos nos últimos X Meses
       // verificar se a data inicial é maior que a data final
           // popar erro 
       // verificar se a data atual é a de hoje
           // msg vai mudar para: Insights de Processos no(s) ultimo(s) "X" "tempo" desde a data "dataFormatada"

 
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
            cpu: [
                {nome:'Blender', capturaManha:28, capturaTarde:58, capturaNoite:82},
                {nome:'Maya', capturaManha:26, capturaTarde:33, capturaNoite:60},
                {nome:'AfterEffects', capturaManha:38, capturaTarde:27, capturaNoite:53},
                {nome:'Unity', capturaManha:38, capturaTarde:32, capturaNoite:22},
                {nome:'DaVinci', capturaManha:14, capturaTarde:13, capturaNoite:15}
            ],
            gpu: [
                {nome:'Blender', capturaManha:34, capturaTarde:52, capturaNoite:92},
                {nome:'AfterEffects', capturaManha:22, capturaTarde:25, capturaNoite:38},
                {nome:'Unity', capturaManha:41, capturaTarde:48, capturaNoite:49}
            ],
            ram: [
                {nome:'Maya', capturaManha:30, capturaTarde:20, capturaNoite:10},
                {nome:'Blender', capturaManha:20, capturaTarde:30, capturaNoite:10},
                {nome:'DaVinci', capturaManha:10, capturaTarde:5, capturaNoite:1},
                {nome:'AfterEffects', capturaManha:5, capturaTarde:25, capturaNoite:38},
                {nome:'Unity', capturaManha:1, capturaTarde:48, capturaNoite:49}
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
        dadosDash.consumoProcessos.gpu.dados.manha.push(processo.capturaManha);
        dadosDash.consumoProcessos.gpu.dados.tarde.push(processo.capturaTarde);
        dadosDash.consumoProcessos.gpu.dados.noite.push(processo.capturaNoite);
    });
    
    dados.dadosProcessosConsumo.cpu.forEach((processo) => {
        dadosDash.consumoProcessos.cpu.processos.push(processo.nome);
        dadosDash.consumoProcessos.cpu.dados.manha.push(processo.capturaManha);
        dadosDash.consumoProcessos.cpu.dados.tarde.push(processo.capturaTarde);
        dadosDash.consumoProcessos.cpu.dados.noite.push(processo.capturaNoite);
    });

    dados.dadosProcessosConsumo.ram.forEach((processo) => {
        dadosDash.consumoProcessos.ram.processos.push(processo.nome);
        dadosDash.consumoProcessos.ram.dados.manha.push(processo.capturaManha);
        dadosDash.consumoProcessos.ram.dados.tarde.push(processo.capturaTarde);
        dadosDash.consumoProcessos.ram.dados.noite.push(processo.capturaNoite);
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
    let dadosConsumo = eval(`dadosDash.consumoProcessos.${componente.toLowerCase()}`)
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
                    label: 'Manhã',
                    data: dadosConsumo.dados.manha,
                    backgroundColor: '#2AACC5',
                    borderRadius: 5
                },
                {
                    label: 'Tarde',
                    data: dadosConsumo.dados.tarde,
                    backgroundColor: '#FF5F2F',
                    borderRadius: 5
                },
                {
                    label: 'Noite',
                    data: dadosConsumo.dados.noite,
                    backgroundColor: '#004755',
                    borderRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Processos que mais Consumem ${componente} por Período`,
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
                    label: 'Críticos',
                    data: dadoAlertas.critico,
                    backgroundColor: '#CD3030',
                    borderRadius: 5,
                },
                {
                    label: 'Moderados',
                    data: dadoAlertas.atencao,
                    backgroundColor: '#FFA100',
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