const db = require('../models/index');

const bcrypt = require('bcryptjs');

class EmployeeService {
    async getAllEmployees(query = {}) {
        const { page = 1, limit = 10, search = '' } = query;
        const offset = (page - 1) * limit;

        const { Op } = require('sequelize');
        const where = { role: { [Op.ne]: 'Admin' } };

        if (search) {
            where[Op.or] = [
                { firstName: { [Op.like]: `%${search}%` } },
                { lastName: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await db.users.findAndCountAll({
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
        const userExists = await db.users.findOne({ where: { email } });
        if (userExists) throw new Error('Email already in use');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password || 'Staff@123', salt);

        return await db.users.create({
            ...employeeData,
            password: hashedPassword,
            status: 'active'
        });
    }

    async updateEmployee(id, updateData) {
        const user = await db.users.findByPk(id);
        if (!user) throw new Error('Employee not found');
        
        // Remove password from updateData to prevent accidental overrides
        const { password, ...safeData } = updateData;
        return await user.update(safeData);
    }

    async deleteEmployee(id) {
        const user = await db.users.findByPk(id);
        if (!user) throw new Error('Employee not found');
        return await user.destroy(); // soft delete due to paranoid: true
    }

    async updateEmployeeRole(id, role) {
        const user = await db.users.findByPk(id);
        if (!user) throw new Error('User not found');
        return await user.update({ role });
    }

    async toggleEmployeeStatus(id) {
        const user = await db.users.findByPk(id);
        if (!user) throw new Error('User not found');
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        return await user.update({ status: newStatus });
    }
}

module.exports = new EmployeeService();
