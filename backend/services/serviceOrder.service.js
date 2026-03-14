const db = require('../models/index');

class ServiceOrderService {
    async createOrder(orderData) {
        const orderCount = await db.serviceOrders.count();
        const orderNumber = `SO-${1000 + orderCount + 1}`;
        
        return await db.serviceOrders.create({
            ...orderData,
            orderNumber
        });
    }

    async getAllOrders(query) {
        const { status, technicianId, vehicleId, page = 1, limit = 10, search = '' } = query;
        const offset = (page - 1) * limit;

        const { Op } = require('sequelize');
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

        const { count, rows } = await db.serviceOrders.findAndCountAll({
            where,
            include: [
                { model: db.vehicles, as: 'vehicle', include: [{ model: db.customers, as: 'customer' }] },
                { model: db.users, as: 'technician', attributes: ['firstName', 'lastName'] },
                { model: db.products, as: 'products' }
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
        const order = await db.serviceOrders.findByPk(id, {
            include: [
                { model: db.vehicles, as: 'vehicle', include: [{ model: db.customers, as: 'customer' }] },
                { model: db.users, as: 'technician', attributes: ['firstName', 'lastName'] },
                { model: db.products, as: 'products' },
                { model: db.invoices, as: 'invoice' }
            ]
        });
        if (!order) throw new Error('Order not found');
        return order;
    }

    async updateStatus(id, status) {
        const order = await db.serviceOrders.findByPk(id);
        if (!order) throw new Error('Order not found');
        return await order.update({ status });
    }

    async updateOrder(id, data) {
        const order = await db.serviceOrders.findByPk(id);
        if (!order) throw new Error('Order not found');
        return await order.update(data);
    }

    async addPartToOrder(orderId, partData) {
        const { productId, quantity } = partData;
        
        const order = await db.serviceOrders.findByPk(orderId);
        const product = await db.products.findByPk(productId);

        if (!order || !product) throw new Error('Order or Product not found');
        if (product.stockQuantity < quantity) throw new Error('Insufficient stock');

        // Check if part already added
        let servicePart = await db.serviceParts.findOne({
            where: { serviceOrderId: orderId, productId }
        });

        if (servicePart) {
            servicePart.quantity += quantity;
            await servicePart.save();
        } else {
            await db.serviceParts.create({
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
