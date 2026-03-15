const customerRepository = require('../repositories/CustomerRepository');
const vehicleRepository = require('../repositories/VehicleRepository');
const { Op } = require('sequelize');

class CustomerService {
    async createCustomer(customerData) {
        return await customerRepository.create(customerData);
    }

    async getAllCustomers(query) {
        const { page = 1, limit = 10, search = '' } = query;
        const offset = (page - 1) * limit;
        
        const where = {};
        if (search) {
            where[Op.or] = [
                { firstName: { [Op.like]: `%${search}%` } },
                { lastName: { [Op.like]: `%${search}%` } },
                { phoneNumber: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await customerRepository.findAndCountAll({
            where,
            include: [{ model: vehicleRepository.model, as: 'vehicles' }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
            distinct: true
        });

        return {
            totalItems: count,
            customers: rows,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        };
    }

    async getCustomerById(id) {
        const customer = await customerRepository.findById(id, {
            include: [{ model: vehicleRepository.model, as: 'vehicles' }]
        });
        if (!customer) throw new Error('Customer not found');
        return customer;
    }

    async updateCustomer(id, updateData) {
        const result = await customerRepository.update(id, updateData);
        if (!result) throw new Error('Customer not found');
        return result;
    }

    async deleteCustomer(id) {
        const result = await customerRepository.delete(id);
        if (!result) throw new Error('Customer not found');
        return true;
    }
}

module.exports = new CustomerService();
