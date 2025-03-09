class TaxpayerIdentificationValidator {
    constructor(tin, country) {
        this.tin = tin;
        this.country = country;
    }


    validate() {
        switch (this.country) {
            case "BR":
                return this.#brazil();
            case "USA":
                return this.#usa();
            case "CA":
                return this.#canada();
            case "SG":
                return this.#singapore();
            case "FR":
                return this.#french();
            case "DE":
                return this.#germany();
            case "CN":
                return this.#china();
            case "VN":
                return this.#vietnam();
            case "RO":
                return this.#romenia();
            default:
                return false;
        }
    }



    #brazil() {
        const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

        return regex.test(this.tin);
    }


    #usa() {
        const regex = /^\d{2}-\d{7}$/;

        return regex.test(this.tin);
    }

    #canada() {
        const regex = /^\d{9}\sRC\d{4}$/;

        return regex.test(this.tin);
    }

    #singapore() {
        const regex = /^(T|S|R|F|M|W|Y|U|G)\d{2}[A-Z\d]{3}\d{3}[A-Z]$/;

        return regex.test(this.tin);
    }

    #french() {
        const regex = /^\d{9}$/;

        return regex.test(this.tin);
    }


    #germany() {
        const regex = /^\d{2} \d{3} \d{3} \d{3}$/;

        return regex.test(this.tin);
    }

    #china() {
        const regex = /^[0-9A-Z]{18}$/;

        return regex.test(this.tin);
    }

    #vietnam() {
        const regex = /^\d{10}(-\d{3})?$/;

        return regex.test(this.tin);
    }

    #romenia() {
        const regex = /^\d{2,10}$/;

        return regex.test(this.tin);
    }
}