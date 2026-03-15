const invoiceRepository = require('../repositories/InvoiceRepository');
const serviceOrderRepository = require('../repositories/ServiceOrderRepository');
const productRepository = require('../repositories/ProductRepository');
const vehicleRepository = require('../repositories/VehicleRepository');
const customerRepository = require('../repositories/CustomerRepository');
const paymentRepository = require('../repositories/PaymentRepository');
const { Op } = require('sequelize');

class InvoiceService {
    async generateInvoice(serviceOrderId) {
        const order = await serviceOrderRepository.findById(serviceOrderId, {
            include: [{ model: productRepository.model, as: 'products' }]
        });

        if (!order) throw new Error('Order not found');
        if (order.status !== 'Completed') throw new Error('Cannot generate invoice for incomplete order');

        // Check if invoice already exists
        let invoice = await invoiceRepository.findOne({ where: { serviceOrderId } });
        if (invoice) return invoice;

        // Calculate totals
        const partsTotal = order.products.reduce((sum, p) => sum + (parseFloat(p.ServicePart.unitPrice) * p.ServicePart.quantity), 0);
        const totalAmount = parseFloat(order.laborCost) + partsTotal;
        const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

        return await invoiceRepository.create({
            invoiceNumber,
            serviceOrderId,
            totalAmount,
            status: 'Unpaid'
        });
    }

    async getInvoiceById(id) {
        const invoice = await invoiceRepository.findById(id, {
            include: [
                { 
                    model: serviceOrderRepository.model, 
                    as: 'serviceOrder',
                    include: [
                        { 
                            model: vehicleRepository.model, 
                            as: 'vehicle', 
                            include: [{ model: customerRepository.model, as: 'customer' }] 
                        },
                        { model: productRepository.model, as: 'products' }
                    ]
                },
                { model: paymentRepository.model, as: 'payments' }
            ]
        });
        if (!invoice) throw new Error('Invoice not found');
        return invoice;
    }

    async getAllInvoices(query = {}) {
        const { search = '', page = 1, limit = 10 } = query;
        const offset = (page - 1) * limit;

        const where = {};
        if (search) {
            where[Op.or] = [
                { invoiceNumber: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await invoiceRepository.findAndCountAll({
            where,
            include: [
                { 
                    model: serviceOrderRepository.model, 
                    as: 'serviceOrder',
                    include: [
                        { 
                            model: vehicleRepository.model, 
                            as: 'vehicle', 
                            include: [{ model: customerRepository.model, as: 'customer' }] 
                        }
                    ]
                },
                { model: paymentRepository.model, as: 'payments' }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        return {
            totalItems: count,
            invoices: rows,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        };
    }

    async updateInvoiceStatus(id, status) {
        const result = await invoiceRepository.update(id, { status });
        if (!result) throw new Error('Invoice not found');
        return result;
    }
}

module.exports = new InvoiceService();
