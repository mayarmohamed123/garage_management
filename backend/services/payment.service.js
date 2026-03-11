const db = require('../models/index');

class PaymentService {
    async recordPayment(invoiceId, paymentData) {
        const invoice = await db.invoices.findByPk(invoiceId);
        if (!invoice) throw new Error('Invoice not found');

        const payment = await db.payments.create({
            ...paymentData,
            invoiceId
        });

        // Update invoice status
        const totalPaid = await db.payments.sum('amount', { where: { invoiceId } });
        if (totalPaid >= invoice.totalAmount) {
            invoice.status = 'Paid';
        } else if (totalPaid > 0) {
            invoice.status = 'Partially Paid';
        }
        await invoice.save();

        return payment;
    }

    async getInvoicePayments(invoiceId) {
        return await db.payments.findAll({ where: { invoiceId } });
    }
}

module.exports = new PaymentService();
