class Validar {
    static validarCampoVazio(valor){
        return valor == "" || valor == undefined || valor == null;
    }

    static validarSite(site){

        const siteRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}([\/\w \.-]*)*\/?$/;
        return siteRegex.test(site);
    }

    static validarCep(cep){

        const cepRegex = /^[0-9]{8}$/;
        return cepRegex.test(cep);
    }

    static validarSenha(senha){
        
        const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return regexSenha.test(senha);
    }

    static validarTelefone(telefone, pais){

        switch (pais) {
            case "BR":
                return this.#teleofoneBr(telefone);
            case "US":
                return this.#teleofoneUs(telefone);
            case "CA":
                return this.#teleofoneCn(telefone);
            case "SG":
                return this.#teleofoneSp(telefone);
            case "FR":
                return this.#teleofoneFr(telefone);
            case "DE":
                return this.#teleofoneAl(telefone);
            case "CN":
                return this.#teleofoneCh(telefone);
            case "VN":
                return this.#teleofoneVt(telefone);
            case "RO":
                return this.#teleofoneRo(telefone);
            default:
                return false;
        }
    }

    static validarDocumentoPessoa(documento, pais){

        switch (pais) {
            case "BR":
                return this.#brazil(documento, false);
            case "US":
                return this.#usa(documento, false);
            case "CA":
                return this.#canada(documento, false);
            case "SG":
                return this.#singapore(documento, false);
            case "FR":
                return this.#french(documento, false);
            case "DE":
                return this.#germany(documento, false);
            case "CN":
                return this.#china(documento, false);
            case "VN":
                return this.#vietnam(documento, false);
            case "RO":
                return this.#romenia(documento, false);
            default:
                return false;
        }
    }

    static validarDocumentoEmpresa(documento, pais) {

        switch (pais) {
            case "BR":
                return this.#brazil(documento, true);
            case "US":
                return this.#usa(documento, true);
            case "CA":
                return this.#canada(documento, true);
            case "SG":
                return this.#singapore(documento, true);
            case "FR":
                return this.#french(documento, true);
            case "DE":
                return this.#germany(documento, true);
            case "CN":
                return this.#china(documento, true);
            case "VN":
                return this.#vietnam(documento, true);
            case "RO":
                return this.#romenia(documento, true);
            default:
                return false;
        }
    }

    static #teleofoneBr(telefone){
        const telRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
        return telRegex.test(telefone);
    }

    static #teleofoneUs(telefone){
        const telRegex = null;
        return telRegex.test(telefone);
    }

    static #teleofoneCn(telefone){
        const telRegex = null;

        return telRegex.test(telefone);
    }

    static #teleofoneSp(telefone){
        const telRegex = null;

        return telRegex.test(telefone);
    }

    static #teleofoneFr(telefone){
        const telRegex = null;

        return telRegex.test(telefone);
    }
    
    static #teleofoneAl(telefone){
        const telRegex = null;

        return telRegex.test(telefone);
    }

    static #teleofoneCh(telefone){
        const telRegex = null;

        return telRegex.test(telefone);
    }
    
    static #teleofoneVt(telefone){
        const telRegex = null;

        return telRegex.test(telefone);
    }

    static #teleofoneRo(telefone){
        const telRegex = null;

        return telRegex.test(telefone);
    }

    static #brazil(documento, isEmpresa) {
        const regexEmpresa = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
        const regexPessoa = null;

        if(isEmpresa){
            return regexEmpresa.test(documento);
        }

        return regexPessoa.test(documento);
    }


    static #usa(documento, isEmpresa) {
        const regexEmpresa = /^\d{2}-\d{7}$/;
        const regexPessoa = null;

        if(isEmpresa){
            return regexEmpresa.test(documento);
        }

        return regexPessoa.test(documento);
    }

    static #canada(documento, isEmpresa) {
        const regexEmpresa = /^\d{9}\sRC\d{4}$/;
        const regexPessoa = null;

        if(isEmpresa){
            return regexEmpresa.test(documento);
        }

        return regexPessoa.test(documento);
    }

    static #singapore(documento, isEmpresa) {
        const regexEmpresa = /^(T|S|R|F|M|W|Y|U|G)\d{2}[A-Z\d]{3}\d{3}[A-Z]$/;
        const regexPessoa = null;

        if(isEmpresa){
            return regexEmpresa.test(documento);
        }

        return regexPessoa.test(documento);
    }

    static #french(documento, isEmpresa) {
        const regexEmpresa = /^\d{9}$/;
        const regexPessoa = null;

        if(isEmpresa){
            return regexEmpresa.test(documento);
        }

        return regexPessoa.test(documento);
    }


    static #germany(documento, isEmpresa) {
        const regexEmpresa = /^\d{2} \d{3} \d{3} \d{3}$/;
        const regexPessoa = null;

        if(isEmpresa){
            return regexEmpresa.test(documento);
        }

        return regexPessoa.test(documento);
    }

    static #china(documento, isEmpresa) {
        const regexEmpresa = /^[0-9A-Z]{18}$/;
        const regexPessoa = null;

        if(isEmpresa){
            return regexEmpresa.test(documento);
        }

        return regexPessoa.test(documento);
    }

    static #vietnam(documento, isEmpresa) {
        const regexEmpresa = /^\d{10}(-\d{3})?$/;
        const regexPessoa = null;

        if(isEmpresa){
            return regexEmpresa.test(documento);
        }

        return regexPessoa.test(documento);
    }

    static #romenia(documento, isEmpresa) {
        const regexEmpresa = /^\d{2,10}$/;
        const regexPessoa = null;

        if(isEmpresa){
            return regexEmpresa.test(documento);
        }

        return regexPessoa.test(documento);
    }
}