var express = require("express");
var router = express.Router();
var desempenhoController = require("../controllers/desempenhoController");


// POST /desempenho/buscar/chamado
router.post("/buscar/chamado", (req, res) => {
  
    console.log("Recebido do Python:", req.body);

    desempenhoController.receberChamado(req, res)

    // Aqui você pode processar os dados como quiser, ou salvar em banco
});

router.post("/buscar/concluido", async (req, res) => {
    try {
        await desempenhoController.receberConcluidos(req, res);
    } catch (error) {
        console.error("Erro na rota:", error);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
});

router.get("/recebe/chamado", (req, res) => {
    desempenhoController.pegarChamado(req, res)
})

router.get('/dados/python', (req, res) => desempenhoController.buscarDadosPython(req,res))

// ROTA RESOLVIDOSS
// router.post("/buscar/chamadoResolvido", (req, res) => {
  
//     console.log("resolvidos do Python:", req.body);

//     desempenhoController.receberChamadosResolvidos(req, res)
// });

// // router.get("/recebe/chamadoResolvido", (req, res) => {
// //     desempenhoController.pegarChamadoResolvido(req, res)
// // })


module.exports = router;
