const paymentRepository = require('../repositories/PaymentRepository');
const invoiceRepository = require('../repositories/InvoiceRepository');

class PaymentService {
    async recordPayment(invoiceId, paymentData) {
        const invoice = await invoiceRepository.findById(invoiceId);
        if (!invoice) throw new Error('Invoice not found');

        const payment = await paymentRepository.create({
            ...paymentData,
            invoiceId
        });

        // Update invoice status
        const totalPaid = await paymentRepository.model.sum('amount', { where: { invoiceId } });
        if (totalPaid >= invoice.totalAmount) {
            await invoiceRepository.update(invoiceId, { status: 'Paid' });
        } else if (totalPaid > 0) {
            await invoiceRepository.update(invoiceId, { status: 'Partially Paid' });
        }

        return payment;
    }

    async getInvoicePayments(invoiceId) {
        return await paymentRepository.findAll({ where: { invoiceId } });
    }
}

module.exports = new PaymentService();
