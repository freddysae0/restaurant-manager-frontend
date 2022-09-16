export default class Order {

    constructor(Axios, url) {
        this.axios = Axios;
        this.url = url;
    }

    async getMenuItemsAvailable() {
        return await this.axios.get(`${this.url}/menu-items/available`);
    }

    async getTablesAvailable() {
        return await this.axios.get(`${this.url}/tables/available`);
    }

    async getOrder(id) {
        return await this.axios.get(`${this.url}/orders/${id}`);
    }

    async getOrdersPaidout() {
        return await this.axios.get(`${this.url}/orders/paidout`, {
            headers: {
                'date-current': new Date().toJSON().slice(0, 10),
            }
        });
    }

    async createOrder(params) {
        return await this.axios.post(`${this.url}/orders`, params);
    }

    async updateOrder(params, id) {
        return await this.axios.put(`${this.url}/orders/${id}`, params);
    }

    async createCashRegister(params) {
        return await this.axios.post(`${this.url}/cash-registers`, params);
    }

    async updateCashRegister(id, params) {
        return await this.axios.put(`${this.url}/cash-registers/${id}`, params);
    }

    async getCashRegisters() {
        return await this.axios.get(`${this.url}/cash-registers/by-date`);
    }

    async getAllCashRegisters() {
        return await this.axios.get(`${this.url}/cash-registers`);
    }

    async getCashRegister() {
        return await this.axios.get(`${this.url}/cash-registers/`, {
            headers: {
                'date-current': new Date().toISOString().slice(0, 10)
            }
        });
    }

    async createBoxAction(params) {
        return await this.axios.post(`${this.url}/box-actions`, params);
    }

    async getBoxActions() {
        return await this.axios.get(`${this.url}/box-actions`, {
            headers: {
                'date-current': new Date().toISOString().slice(0, 10)
            }
        });
    }

}