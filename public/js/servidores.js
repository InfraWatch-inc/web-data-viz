const itensPorPagina = 5;
let paginaAtual = 1;

let exemplo_objeto = [
    {
      "id": "#294",
      "nome": "PixelForge",
      "instancia": "am12masdn...",
      "nucleos": 24,
      "threads": 32,
      "qtdGpu": 4,
      "tempGpu": "70 ºC",
      "usoGpu": "60%",
      "usoCpu": "60%",
      "isAlertaGpu": true,
      "isAlertaCpu": true
    },
    {
      "id": "#293",
      "nome": "RenderTitan",
      "instancia": "ogw612n...",
      "nucleos": 8,
      "threads": 16,
      "qtdGpu": 1,
      "tempGpu": "50 ºC",
      "usoGpu": "30%",
      "usoCpu": "30%",
      "isAlertaGpu": true,
      "isAlertaCpu": false
    },
    {
      "id": "#295",
      "nome": "FrameStorm",
      "instancia": "12522874...",
      "nucleos": 16,
      "threads": 24,
      "qtdGpu": 2,
      "tempGpu": "30 ºC",
      "usoGpu": "24%",
      "usoCpu": "24%",
      "isAlertaGpu": false,
      "isAlertaCpu": false
    },
    {
      "id": "#296",
      "nome": "RayTracerX",
      "instancia": "12522874...",
      "nucleos": 16,
      "threads": 16,
      "qtdGpu": 2,
      "tempGpu": "30 ºC",
      "usoGpu": "24%",
      "usoCpu": "24%",
      "isAlertaGpu": false,
      "isAlertaCpu": false
    },
    {
      "id": "#297",
      "nome": "RayTracerY",
      "instancia": "12522874...",
      "nucleos": 16,
      "threads": 16,
      "qtdGpu": 2,
      "tempGpu": "30 ºC",
      "usoGpu": "24%",
      "usoCpu": "24%",
      "isAlertaGpu": false,
      "isAlertaCpu": false
    }
]
  

function organizarServidores(dados){
    let html = "";
    let corpoTabela = document.getElementById("corpo-tabela");
    dados.forEach((servidor) => { 
        

        html += `
        <tr>
            <td>${servidor.id}</td>
            <td><a href="./monitoramento.html">${servidor.nome}</a></td>
            <td>${servidor.instancia}</td>
            <td>${servidor.nucleos}</td>
            <td>${servidor.threads}</td>
            <td>${servidor.qtdGpu}</td>
            <td ${servidor.isAlertaGpu ? "class='alerta'" : ""}>${servidor.tempGpu}</td>
            <td ${servidor.isAlertaGpu ? "class='alerta'" : ""}>${servidor.usoGpu}</td>
            <td ${servidor.isAlertaCpu ? "class='alerta'" : ""} >${servidor.usoCpu}</td>
        </tr>
        `;
    });

    corpoTabela.innerHTML = html;
}

async function getServidores(){
    // TODO 
    organizarServidores(exemplo_objeto)
} 



function atualizarPaginacao(totalItens) {
    const totalPaginas = Math.ceil(totalItens / itensPorPagina);
    const paginacao = document.getElementById('paginacao');
    paginacao.innerHTML = '';

    for (let i = 1; i <= totalPaginas; i++) {
        const botaoPagina = document.createElement('button');
        botaoPagina.textContent = i;
        botaoPagina.className = 'pagina';
        botaoPagina.onclick = () => {
            paginaAtual = i;
            getServidores();
        };
        paginacao.appendChild(botaoPagina);
    }
}

  