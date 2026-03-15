const userRepository = require('../repositories/UserRepository');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

class EmployeeService {
    async getAllEmployees(query = {}) {
        const { page = 1, limit = 10, search = '' } = query;
        const offset = (page - 1) * limit;

        const where = { role: { [Op.ne]: 'Admin' } };

        if (search) {
            where[Op.or] = [
                { firstName: { [Op.like]: `%${search}%` } },
                { lastName: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await userRepository.findAndCountAll({
            where,
            attributes: { exclude: ['password'] },
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        return {
            totalItems: count,
            employees: rows,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        };
    }

    async createEmployee(employeeData) {
        const { email, password } = employeeData;
        const userExists = await userRepository.findByEmail(email);
        if (userExists) throw new Error('Email already in use');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password || 'Staff@123', salt);

        return await userRepository.create({
            ...employeeData,
            password: hashedPassword,
            status: 'active'
        });
    }

    async updateEmployee(id, updateData) {
        // Remove password from updateData to prevent accidental overrides
        const { password, ...safeData } = updateData;
        const result = await userRepository.update(id, safeData);
        if (!result) throw new Error('Employee not found');
        return result;
    }

    async deleteEmployee(id) {
        const result = await userRepository.delete(id);
        if (!result) throw new Error('Employee not found');
        return true;
    }

    async updateEmployeeRole(id, role) {
        const result = await userRepository.update(id, { role });
        if (!result) throw new Error('User not found');
        return result;
    }

    async toggleEmployeeStatus(id) {
        const user = await userRepository.findById(id);
        if (!user) throw new Error('User not found');
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        return await user.update({ status: newStatus });
    }
}

module.exports = new EmployeeService();
