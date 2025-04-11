class Validar {

    static paisesSuportados = [
        {sigla:"BR", pais:"Brasil", codTelefone:"+55"}, 
        {sigla:"US", pais:"Estados Unidos", codTelefone:"+"}, 
        {silgla:"CA", pais:"Canadá", codTelefone:"+"}, 
        {sigla:"SG", pais:"Singapura", codTelefone:"+"}, 
        {sigla:"FR", pais:"França", codTelefone:"+"}, 
        {sigla:"DE", pais:"Alemanha", codTelefone:"+"}, 
        {sigla:"CN", pais:"China", codTelefone:"+"}, 
        {sigla:"VN", pais:"Vietnã", codTelefone:"+"}, 
        {sigla:"RO", pais:"Romenia", codTelefone:"+"}
    ];

    static empresaRegexPorPais = {
        BR: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,     
        US: /^\d{2}-\d{7}$/,                          
        CA: /^\d{9}\sRC\d{4}$/,                       
        SG: /^[A-Z0-9]{9,10}$/,                       
        FR: /^\d{9}$/,                                
        DE: /^[A-Z]{1,2} \d{4,6}$/,                   
        CN: /^[0-9A-Z]{18}$/,                         
        VN: /^\d{10}$/,                               
        RO: /^\d{1,10}$/                              
    };

    static caixaPostalRegexPorPais = {
        BR: /^[0-9]{5}-?[0-9]{3}$/,      // Ex: 12345-678 ou 12345678
        US: /^\d{5}(-\d{4})?$/,          // Ex: 12345 ou 12345-6789
        CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, // Ex: K1A 0B1
        SG: /^\d{6}$/,                   // Ex: 123456
        FR: /^\d{5}$/,                   // Ex: 75001
        DE: /^\d{5}$/,                   // Ex: 10115
        CN: /^\d{6}$/,                   // Ex: 100000
        VN: /^\d{6}$/,                   // Ex: 700000
        RO: /^\d{6}$/                    // Ex: 010011
    };

    static telefoneRegexPorPais = {
        BR: /^\(?\d{2}\)?\s?\d{4,5}-\d{4}$/,                 
        US: /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,         
        CA: /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,         
        SG: /^[689]\d{7}$/,                                 
        FR: /^0[1-9](\d{2}){4}$/,                            
        DE: /^0[1-9]\d{1,4}[-.\s]?\d{3,10}$/,                
        CN: /^1[3-9]\d{9}$/,                                
        VN: /^(3|5|7|8|9)\d{8}$/,                            
        RO: /^0\d{9}$/                                       
    };

    static pessoaRegexPorPais = {
        BR: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,                        
        US: /^\d{3}-\d{2}-\d{4}$/,                                
        CA: /^\d{3} \d{3} \d{3}$/,                                
        SG: /^[STFG]\d{7}[A-Z]$/,                                 
        FR: /^[12]\d{2}(0[1-9]|1[0-2])\d{2}\d{3}\d{3}\d{2}$/,     
        DE: /^\d{11}$/,                                           
        CN: /^\d{6}(19|20)\d{2}(0[1-9]|1[0-2])([0-2][0-9]|3[0-1])\d{3}[0-9Xx]$/, 
        VN: /^\d{12}$/,                                           
        RO: /^[1-8]\d{12}$/                                       
    };

    static validarCampoVazio(valor) {
        return valor == null || valor.toString().trim() === "";
    }

    static validarSite(site) {
        const siteRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}([\/\w .-]*)*\/?$/;
        return siteRegex.test(site);
    }

    static validarCaixaPostal(caixaPostal, pais) {
        const regex = caixaPostalRegexPorPais[pais];
        return regex ? regex.test(caixaPostal) : false;
    }

    static validarSenha(senha) {
        const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return regexSenha.test(senha);
    }

    static validarTelefone(telefone, pais) {
        const regex = telefoneRegexPorPais[pais];
        return regex ? regex.test(telefone) : false;
    }

    static validarDocumentoPessoa(documento, pais) {
        const regex = pessoaRegexPorPais[pais];
        return regex ? regex.test(documento) : false;
    }

    static validarDocumentoEmpresa(documento, pais) {
        const regex = empresaRegexPorPais[pais];
        return regex ? regex.test(documento) : false;
    }
}

function listarPaises(){
    const pais = document.getElementById('slctPais');

    const infoPaises = Validar.paisesSuportados;
    let listaOpcoesPaises = "";

    infoPaises.forEach( (pais) => {
        listaOpcoesPaises += `<option value='${pais.sigla}'>${pais.pais}</option>`;
    });

    pais.innerHTML = listaOpcoesPaises;
}

listarPaises();


