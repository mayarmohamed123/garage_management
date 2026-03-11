const db = require('../models/index');

class CustomerService {
    async createCustomer(customerData) {
        return await db.customers.create(customerData);
    }

    async getAllCustomers(query) {
        const { page = 1, limit = 10, search = '' } = query;
        const offset = (page - 1) * limit;
        
        const where = {};
        if (search) {
            const { Op } = require('sequelize');
            where[Op.or] = [
                { firstName: { [Op.like]: `%${search}%` } },
                { lastName: { [Op.like]: `%${search}%` } },
                { phoneNumber: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await db.customers.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        return {
            totalItems: count,
            customers: rows,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        };
    }

    async getCustomerById(id) {
        const customer = await db.customers.findByPk(id, {
            include: [{ model: db.vehicles, as: 'vehicles' }]
        });
        if (!customer) throw new Error('Customer not found');
        return customer;
    }

    async updateCustomer(id, updateData) {
        const customer = await db.customers.findByPk(id);
        if (!customer) throw new Error('Customer not found');
        return await customer.update(updateData);
    }

    async deleteCustomer(id) {
        const customer = await db.customers.findByPk(id);
        if (!customer) throw new Error('Customer not found');
        await customer.destroy(); // Soft delete
        return true;
    }
}

module.exports = new CustomerService();
