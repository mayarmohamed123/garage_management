const vehicleRepository = require('../repositories/VehicleRepository');
const customerRepository = require('../repositories/CustomerRepository');
const serviceOrderRepository = require('../repositories/ServiceOrderRepository');
const { Op } = require('sequelize');

class VehicleService {
    async registerVehicle(vehicleData) {
        return await vehicleRepository.create(vehicleData);
    }

    async getAllVehicles(query) {
        const { page = 1, limit = 10, search = '' } = query;
        const offset = (page - 1) * limit;

        const where = {};
        if (search) {
            where[Op.or] = [
                { make: { [Op.like]: `%${search}%` } },
                { model: { [Op.like]: `%${search}%` } },
                { licensePlate: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await vehicleRepository.findAndCountAll({
            where,
            include: [{ model: customerRepository.model, as: 'customer', attributes: ['firstName', 'lastName'] }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        return {
            totalItems: count,
            vehicles: rows,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        };
    }

    async getVehicleById(id) {
        const vehicle = await vehicleRepository.findById(id, {
            include: [
                { model: customerRepository.model, as: 'customer' },
                { model: serviceOrderRepository.model, as: 'serviceOrders' }
            ]
        });
        if (!vehicle) throw new Error('Vehicle not found');
        return vehicle;
    }

    async updateVehicle(id, updateData) {
        const result = await vehicleRepository.update(id, updateData);
        if (!result) throw new Error('Vehicle not found');
        return result;
    }

    async deleteVehicle(id) {
        const result = await vehicleRepository.delete(id);
        if (!result) throw new Error('Vehicle not found');
        return true;
    }
}

module.exports = new VehicleService();
