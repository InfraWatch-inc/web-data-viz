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

function coletarDados() {
    let dtInicial = iptDtInicial.value;
    let dtFinal = iptDtFinal.value;

    let periodo = 1;
    let dataInicial = undefined;
    let dataFinal = undefined;

    let dataInicialFormatada = undefined;
    let dataFinalFormatada = undefined;

    if (dtInicial === '' && dtFinal === '') {
        periodo = 6;
        dataInicial = new Date();
        dataInicial.setMonth(dataInicial.getMonth() - periodo);

        let dia = String(dataInicial.getDate()).padStart(2, '0');
        let mes = String(dataInicial.getMonth() + 1).padStart(2, '0');
        let ano = dataInicial.getFullYear();
        dataInicialFormatada = `${ano}-${mes}-${dia}`;

        dataFinal = new Date();
        dia = String(dataFinal.getDate()).padStart(2, '0');
        mes = String(dataFinal.getMonth() + 1).padStart(2, '0');
        ano = dataFinal.getFullYear();
        dataFinalFormatada = `${ano}-${mes}-${dia}`;
    } else if (dtInicial === '' && dtFinal !== '') {
        dataInicial = new Date();
        let dia = String(dataInicial.getDate()).padStart(2, '0');
        let mes = String(dataInicial.getMonth() + 1).padStart(2, '0');
        let ano = dataInicial.getFullYear();
        dataInicialFormatada = `${ano}-${mes}-${dia}`;
        iptDtInicial.value = dataInicialFormatada;

        dataFinal = new Date(dtFinal);
        dataFinalFormatada = dtFinal;
    } else if (dtInicial !== '' && dtFinal !== '') {
        dataInicial = new Date(dtInicial);
        dataFinal = new Date(dtFinal);
        dataInicialFormatada = dtInicial;
        dataFinalFormatada = dtFinal;
    } else {
        alert('Data final inválida');
        return;
    }

    if (dataInicial > dataFinal) {
        alert('Data inicial maior que a final. Verifique.');
        return;
    }

    iptDtInicial.value = dataInicialFormatada;
    iptDtFinal.value = dataFinalFormatada;

    // Título do dashboard
    const tituloDash = document.getElementById('tituloDash');
    const dataInicio = new Date(dataInicialFormatada);
    const dataFim = new Date(dataFinalFormatada);
    const diferencaMs = dataFim.getTime() - dataInicio.getTime();
    const dias = Math.ceil(diferencaMs / (1000 * 60 * 60 * 24));
    const meses = (dataFim.getFullYear() - dataInicio.getFullYear()) * 12 + (dataFim.getMonth() - dataInicio.getMonth());

    let textoTitulo = 'Insights de Processos';

    const hoje = new Date();
    const hojeStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
    const dataFinalEhHoje = dataFinalFormatada === hojeStr;

    if (meses === 0 && dias < 30) {
        textoTitulo += ` nos últimos ${dias} dia${dias === 1 ? '' : 's'}`;
    } else if (meses === 1) {
        textoTitulo += ` no último Mês`;
    } else if (meses === 3) {
        textoTitulo += ` no último Trimestre`;
    } else if (meses === 6) {
        textoTitulo += ` no último Semestre`;
    } else if (meses === 12) {
        textoTitulo += ` no último Ano`;
    } else if (meses > 1) {
        textoTitulo += ` nos últimos ${meses} Meses`;
    }

    if (dataFinalEhHoje) {
        let tempoTexto = '';
        if (meses === 0 && dias < 30) {
            tempoTexto = `${dias} dia${dias === 1 ? '' : 's'}`;
        } else if (meses === 6) {
            tempoTexto = `1 semestre`;
        } else if (meses === 12) {
            tempoTexto = `1 ano`;
        } else {
            tempoTexto = `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
        }
        textoTitulo = `Insights de Processos nos últimos ${tempoTexto} desde ${dataInicialFormatada}`;
    }

    tituloDash.innerText = textoTitulo +":";

    fetch(`/insights/processos/${sessionStorage.ID_EMPRESA}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            dataInicial: dataInicialFormatada,
            dataFinal: dataFinalFormatada
        })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`Erro na requisição: ${res.status}`);
        }
        return res.json();
    })
    .then(dados => {
        // todo substituir dados depois
        console.log(dados);
        organizarDados(dados);
    })
    .catch(error => {
        console.error('Erro ao buscar dados:', error);
        alert('Falha ao buscar dados do dashboard.');

        const dadosMocados = {
            processoMaisCritico: 'Blender',
            processoMaisAtencao: 'Maya',
            componenteMaisConsumido: 'CPU',
            dadosProcessosAlertas: [
                { nome: 'Blender', alertasAtencao: 13, alertasCritico: 23 },
                { nome: 'Maya', alertasAtencao: 14, alertasCritico: 8 },
                { nome: 'After Effects', alertasAtencao: 14, alertasCritico: 7 },
                { nome: 'Unity', alertasAtencao: 13, alertasCritico: 6 },
                { nome: 'DaVinci', alertasAtencao: 6, alertasCritico: 1 }
            ],
            dadosProcessosConsumo: {
                cpu: [
                    { nome: 'Blender', manha: 28, tarde: 58, noite: 82 },
                    { nome: 'Maya', manha: 26, tarde: 33, noite: 60 },
                    { nome: 'AfterEffects', manha: 38, tarde: 27, noite: 53 },
                    { nome: 'Unity', manha: 38, tarde: 32, noite: 22 },
                    { nome: 'DaVinci', manha: 14, tarde: 13, noite: 15 }
                ],
                gpu: [
                    { nome: 'Blender', manha: 34, tarde: 52, noite: 92 },
                    { nome: 'AfterEffects', manha: 22, tarde: 25, noite: 38 },
                    { nome: 'Unity', manha: 41, tarde: 48, noite: 49 }
                ],
                ram: [
                    { nome: 'Maya', manha: 30, tarde: 20, noite: 10 },
                    { nome: 'Blender', manha: 20, tarde: 30, noite: 10 },
                    { nome: 'DaVinci', manha: 10, tarde: 5, noite: 1 },
                    { nome: 'AfterEffects', manha: 5, tarde: 25, noite: 38 },
                    { nome: 'Unity', manha: 1, tarde: 48, noite: 49 }
                ]
            }
        };
        organizarDados(dadosMocados);
    });
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
        dadosDash.consumoProcessos.gpu.dados.manha.push(processo.manha);
        dadosDash.consumoProcessos.gpu.dados.tarde.push(processo.tarde);
        dadosDash.consumoProcessos.gpu.dados.noite.push(processo.noite);
    });
    
    dados.dadosProcessosConsumo.cpu.forEach((processo) => {
        dadosDash.consumoProcessos.cpu.processos.push(processo.nome);
        dadosDash.consumoProcessos.cpu.dados.manha.push(processo.manha);
        dadosDash.consumoProcessos.cpu.dados.tarde.push(processo.tarde);
        dadosDash.consumoProcessos.cpu.dados.noite.push(processo.noite);
    });

    dados.dadosProcessosConsumo.ram.forEach((processo) => {
        dadosDash.consumoProcessos.ram.processos.push(processo.nome);
        dadosDash.consumoProcessos.ram.dados.manha.push(processo.manha);
        dadosDash.consumoProcessos.ram.dados.tarde.push(processo.tarde);
        dadosDash.consumoProcessos.ram.dados.noite.push(processo.noite);
    });   

    atualizarFront(); 
}

function resetarGraficos(){
    dadosDash = {
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

    const chartConsumo = document.getElementById('chartConsumoProcessos');
    if (chartConsumo) {
        chartConsumo.remove(); 
    }

    const chartAlertas = document.getElementById('chartAlertasProcessos');
    if (chartAlertas) {
        chartAlertas.remove(); 
    }

    const canvasConsumo = `<canvas id="chartConsumoProcessos"></canvas>`;

    const canvasAlertas = '<canvas id="chartAlertasProcessos"></canvas>';

    document.getElementById('campoChartConsumo').innerHTML = canvasConsumo;
    document.getElementById('campoChartAlertas').innerHTML = canvasAlertas;
}

function atualizarFront(){
    kpiComponente.innerText = dadosDash.componenteUso;
    kpiAlertasAtencao.innerText = dadosDash.kpiAtencao;
    kpiAlertasCritico.innerText = dadosDash.kpiCritico;

    carregarGraficoAlertasProcessos(dadosDash.alertasProcessos.processos, dadosDash.alertasProcessos.alertas);
    let componente = document.getElementById('slctComponente').value;

    if(document.getElementById('slctComponente').value == '' || document.getElementById('slctComponente').value == undefined || document.getElementById('slctComponente').value == null){
        componente = dadosDash.componenteUso;
        document.getElementById('slctComponente').selectedIndex = componente.toLowerCase() == 'cpu' ? 0 : componente.toLowerCase() == 'gpu' ? 1 : 2; 
    } 
    
    let dadosConsumo = dadosDash.consumoProcessos[componente.toLowerCase()]
    let processos = dadosDash.consumoProcessos[componente.toLowerCase()].processos
    carregarGraficoConsumoProcessos(componente, processos, dadosConsumo);
}

function carregarGraficoConsumoProcessos(componente, processos, dadosConsumo){
    const consumo = document.getElementById('chartConsumoProcessos');

    new Chart(consumo, {
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
                    text: `Processos que mais Consumem ${componente.toUpperCase()} por Período em Porcentagem (%)`,
                    font: {
                        size: 19,
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
                    text: 'Processos com mais Alertas Críticos e Moderados',
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