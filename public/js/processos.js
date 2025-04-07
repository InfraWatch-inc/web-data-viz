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
          
// dados de test, temporário
const testProcesses = [
    { name: 'maya', cpu: 20, ram: 27, gpu: 7 },
    { name: 'blender', cpu: 15, ram: 18, gpu: 20 },
    { name: 'c4d', cpu: 10, ram: 11, gpu: 12 },
    { name: 'afterEffects', cpu: 32, ram: 34, gpu: 34 },
    { name: 'davinci', cpu: 12, ram: 10, gpu: 17 }
];
              
atualizarProcessosLista(testProcesses);
          
function testDataUpdate() {
    return testProcesses.map(process => {
        return {
            name: process.name,
            cpu: Math.max(1, Math.min(100, process.cpu + Math.floor(Math.random() * 5) - 2)),
            ram: Math.max(1, Math.min(100, process.ram + Math.floor(Math.random() * 5) - 2)),
            gpu: Math.max(1, Math.min(100, process.gpu + Math.floor(Math.random() * 5) - 2))
        };
    });
}
          
setInterval(() => {
    const updatedProcesses = testDataUpdate();
    atualizarProcessosLista(updatedProcesses);
}, 5000);