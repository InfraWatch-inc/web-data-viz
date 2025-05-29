var express = require("express");
var router = express.Router();


let dadosExternosProblemas = [
    {
        "mes": "Janeiro",
        "ano": 2023,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 1
    },
    {
        "mes": "Janeiro",
        "ano": 2023,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 5
    },
    {
        "mes": "Fevereiro",
        "ano": 2023,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 2
    },
    {
        "mes": "Fevereiro",
        "ano": 2023,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 7
    },
    {
        "mes": "Março",
        "ano": 2023,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 3
    },
    {
        "mes": "Março",
        "ano": 2023,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 6
    },
    {
        "mes": "Abril",
        "ano": 2023,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 2
    },
    {
        "mes": "Abril",
        "ano": 2023,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 8
    },
    {
        "mes": "Maio",
        "ano": 2023,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 4
    },
    {
        "mes": "Maio",
        "ano": 2023,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 10
    },
    {
        "mes": "Junho",
        "ano": 2023,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 2
    },
    {
        "mes": "Junho",
        "ano": 2023,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 9
    },
    {
        "mes": "Julho",
        "ano": 2023,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 1
    },
    {
        "mes": "Julho",
        "ano": 2023,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 7
    },
    {
        "mes": "Agosto",
        "ano": 2023,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 3
    },
    {
        "mes": "Agosto",
        "ano": 2023,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 11
    },
    {
        "mes": "Setembro",
        "ano": 2023,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 5
    },
    {
        "mes": "Setembro",
        "ano": 2023,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 6
    },
    {
        "mes": "Outubro",
        "ano": 2023,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 4
    },
    {
        "mes": "Outubro",
        "ano": 2023,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 5
    },
    {
        "mes": "Novembro",
        "ano": 2023,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 2
    },
    {
        "mes": "Novembro",
        "ano": 2023,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 3
    },
    {
        "mes": "Dezembro",
        "ano": 2023,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 3
    },
    {
        "mes": "Dezembro",
        "ano": 2023,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 4
    },
    {
        "mes": "Janeiro",
        "ano": 2024,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 2
    },
    {
        "mes": "Janeiro",
        "ano": 2024,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 8
    },
    {
        "mes": "Fevereiro",
        "ano": 2024,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 1
    },
    {
        "mes": "Fevereiro",
        "ano": 2024,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 12
    },
    {
        "mes": "Março",
        "ano": 2024,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 3
    },
    {
        "mes": "Março",
        "ano": 2024,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 15
    },
    {
        "mes": "Abril",
        "ano": 2024,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 4
    },
    {
        "mes": "Abril",
        "ano": 2024,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 18
    },
    {
        "mes": "Maio",
        "ano": 2024,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 2
    },
    {
        "mes": "Maio",
        "ano": 2024,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 22
    },
    {
        "mes": "Junho",
        "ano": 2024,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 1
    },
    {
        "mes": "Junho",
        "ano": 2024,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": "NA"
    },
    {
        "mes": "Julho",
        "ano": 2024,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": "NA"
    },
    {
        "mes": "Julho",
        "ano": 2024,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 20
    },
    {
        "mes": "Agosto",
        "ano": 2024,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 3
    },
    {
        "mes": "Agosto",
        "ano": 2024,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": "NA"
    },
    {
        "mes": "Setembro",
        "ano": 2024,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 5
    },
    {
        "mes": "Setembro",
        "ano": 2024,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": "NA"
    },
    {
        "mes": "Outubro",
        "ano": 2024,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 4
    },
    {
        "mes": "Outubro",
        "ano": 2024,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 9
    },
    {
        "mes": "Novembro",
        "ano": 2024,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 2
    },
    {
        "mes": "Novembro",
        "ano": 2024,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 6
    },
    {
        "mes": "Dezembro",
        "ano": 2024,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 1
    },
    {
        "mes": "Dezembro",
        "ano": 2024,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 4
    },
    {
        "mes": "Janeiro",
        "ano": 2025,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 8
    },
    {
        "mes": "Janeiro",
        "ano": 2025,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 3
    },
    {
        "mes": "Fevereiro",
        "ano": 2025,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": "NA"
    },
    {
        "mes": "Fevereiro",
        "ano": 2025,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 5
    },
    {
        "mes": "Março",
        "ano": 2025,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 15
    },
    {
        "mes": "Março",
        "ano": 2025,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 8
    },
    {
        "mes": "Abril",
        "ano": 2025,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 18
    },
    {
        "mes": "Abril",
        "ano": 2025,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 12
    },
    {
        "mes": "Maio",
        "ano": 2025,
        "tipo_problema": "picos.de.energia",
        "qtd_alertas": 22
    },
    {
        "mes": "Maio",
        "ano": 2025,
        "tipo_problema": "excesso.de.umidade",
        "qtd_alertas": 15
    }
]



router.get("/envioDadosExternos", function (req, res) {
    return res.status(200).json(dadosExternosProblemas);
});


module.exports = router;