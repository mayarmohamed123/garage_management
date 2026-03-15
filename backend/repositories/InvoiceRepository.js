const BaseRepository = require('./BaseRepository');
const Invoice = require('../models/Invoice');

class InvoiceRepository extends BaseRepository {
    constructor() {
        super(Invoice);
    }

    async findByInvoiceNumber(invoiceNumber) {
        return await this.model.findOne({ where: { invoiceNumber } });
    }
}

module.exports = new InvoiceRepository();
