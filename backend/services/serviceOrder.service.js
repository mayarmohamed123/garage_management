const serviceOrderRepository = require('../repositories/ServiceOrderRepository');
const vehicleRepository = require('../repositories/VehicleRepository');
const customerRepository = require('../repositories/CustomerRepository');
const userRepository = require('../repositories/UserRepository');
const productRepository = require('../repositories/ProductRepository');
const invoiceRepository = require('../repositories/InvoiceRepository');
const servicePartRepository = require('../repositories/ServicePartRepository');
const { Op } = require('sequelize');

class ServiceOrderService {
    async createOrder(orderData) {
        const orderCount = await serviceOrderRepository.count();
        const orderNumber = `SO-${1000 + orderCount + 1}`;
        
        return await serviceOrderRepository.create({
            ...orderData,
            orderNumber
        });
    }

    async getAllOrders(query) {
        const { status, technicianId, vehicleId, page = 1, limit = 10, search = '' } = query;
        const offset = (page - 1) * limit;

        const where = {};
        if (status) where.status = status;
        if (technicianId) where.technicianId = technicianId;
        if (vehicleId) where.vehicleId = vehicleId;

        if (search) {
            where[Op.or] = [
                { orderNumber: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await serviceOrderRepository.findAndCountAll({
            where,
            include: [
                { model: vehicleRepository.model, as: 'vehicle', include: [{ model: customerRepository.model, as: 'customer' }] },
                { model: userRepository.model, as: 'technician', attributes: ['firstName', 'lastName'] },
                { model: productRepository.model, as: 'products' }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        return {
            totalItems: count,
            serviceOrders: rows,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        };
    }

    async getOrderById(id) {
        const order = await serviceOrderRepository.findById(id, {
            include: [
                { model: vehicleRepository.model, as: 'vehicle', include: [{ model: customerRepository.model, as: 'customer' }] },
                { model: userRepository.model, as: 'technician', attributes: ['firstName', 'lastName'] },
                { model: productRepository.model, as: 'products' },
                { model: invoiceRepository.model, as: 'invoice' }
            ]
        });
        if (!order) throw new Error('Order not found');
        return order;
    }

    async updateStatus(id, status) {
        const result = await serviceOrderRepository.update(id, { status });
        if (!result) throw new Error('Order not found');
        return result;
    }

    async updateOrder(id, data) {
        const result = await serviceOrderRepository.update(id, data);
        if (!result) throw new Error('Order not found');
        return result;
    }

    async addPartToOrder(orderId, partData) {
        const { productId, quantity } = partData;
        
        const order = await serviceOrderRepository.findById(orderId);
        const product = await productRepository.findById(productId);

        if (!order || !product) throw new Error('Order or Product not found');
        if (product.stockQuantity < quantity) throw new Error('Insufficient stock');

        // Check if part already added
        let servicePart = await servicePartRepository.findOne({
            where: { serviceOrderId: orderId, productId }
        });

        if (servicePart) {
            servicePart.quantity += quantity;
            await servicePart.save();
        } else {
            await servicePartRepository.create({
                serviceOrderId: orderId,
                productId,
                quantity,
                unitPrice: product.price
            });
        }

        // Deduct stock
        product.stockQuantity -= quantity;
        await product.save();

        return true;
    }
}

module.exports = new ServiceOrderService();
