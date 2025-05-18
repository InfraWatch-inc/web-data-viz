let dadosObjeto;

async function carregarDados(){
    // let idServidor = req.params.idServidor;
    try{
        const resposta = await fetch(`http://127.0.0.1:8000/monitoramento/coletar/dados/3`);
        
        if(!resposta.ok){
            console.error("Erro no fecth");
            return;
        }

        const capturaObjeto = await resposta.json()
        if(Array.isArray(capturaObjeto)){
            dadosObjeto = capturaObjeto;
            tratarProcessos()
        }else {
            console.error("Resposta não é uma lista")
        }
    
    }catch(erro){
        console.error("Erro: ", erro)
    }
}



// Processos

function adicionarProcessos(process, index) {
    const processItem = document.createElement('div');
    processItem.className = 'process-item';
                
    const processName = document.createElement('div');
    processName.className = 'process-name';
    processName.innerHTML = `<span class="process-number">${index}.</span> ${process.name}`;
                
    const cpuInfo = document.createElement('div');
    cpuInfo.className = 'usage-info';
    cpuInfo.textContent = `Uso de CPU: ${process.cpu}%`;
                
    const ramInfo = document.createElement('div');
    ramInfo.className = 'usage-info';
    ramInfo.textContent = `Uso de Mem. RAM: ${process.ram}%`;
                
    const gpuInfo = document.createElement('div');
    gpuInfo.className = 'usage-info';
    gpuInfo.textContent = `Uso de GPU: ${process.gpu}%`;
                
    processItem.appendChild(processName);
    processItem.appendChild(cpuInfo);
    processItem.appendChild(ramInfo);
    processItem.appendChild(gpuInfo);
                
    document.getElementById('processList').appendChild(processItem);
}
          
function atualizarProcessosLista(processes) {
    const processListElement = document.getElementById('processList');
    processListElement.innerHTML = '';
                
    processes.forEach((process, index) => {
        adicionarProcessos(process, index + 1);
    });
}

function tratarProcessos() {

    return dadosObjeto[0].processos.map(process => {
        return {
            name: process.nome,
            cpu: parseFloat(process.uso_cpu).toFixed(2),
            ram: parseFloat(process.uso_ram).toFixed(2),
            gpu: parseFloat(process.uso_gpu).toFixed(2)
        };
    });
}
          


async function main(){
    await carregarDados();
    atualizarProcessosLista(tratarProcessos());

    setInterval(() => {
    const updatedProcesses = tratarProcessos();
    atualizarProcessosLista(updatedProcesses);
    }, 5000);
}

main();