const db = require('../models/index');

class InvoiceService {
    async generateInvoice(serviceOrderId) {
        const order = await db.serviceOrders.findByPk(serviceOrderId, {
            include: [{ model: db.products, as: 'products' }]
        });

        if (!order) throw new Error('Order not found');
        if (order.status !== 'Completed') throw new Error('Cannot generate invoice for incomplete order');

        // Check if invoice already exists
        let invoice = await db.invoices.findOne({ where: { serviceOrderId } });
        if (invoice) return invoice;

        // Calculate totals
        const partsTotal = order.products.reduce((sum, p) => sum + (parseFloat(p.ServicePart.unitPrice) * p.ServicePart.quantity), 0);
        const totalAmount = parseFloat(order.laborCost) + partsTotal;
        const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

        return await db.invoices.create({
            invoiceNumber,
            serviceOrderId,
            totalAmount,
            status: 'Unpaid'
        });
    }

    async getInvoiceById(id) {
        const invoice = await db.invoices.findByPk(id, {
            include: [
                { 
                    model: db.serviceOrders, 
                    as: 'serviceOrder',
                    include: [
                        { model: db.vehicles, as: 'vehicle', include: [{ model: db.customers, as: 'customer' }] },
                        { model: db.products, as: 'products' }
                    ]
                },
                { model: db.payments, as: 'payments' }
            ]
        });
        if (!invoice) throw new Error('Invoice not found');
        return invoice;
    }

    async getAllInvoices() {
        return await db.invoices.findAll({
            include: [{ model: db.serviceOrders, as: 'serviceOrder' }],
            order: [['createdAt', 'DESC']]
        });
    }

    async updateInvoiceStatus(id, status) {
        const invoice = await db.invoices.findByPk(id);
        if (!invoice) throw new Error('Invoice not found');
        return await invoice.update({ status });
    }
}

module.exports = new InvoiceService();
