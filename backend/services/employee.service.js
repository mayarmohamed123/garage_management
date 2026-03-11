const db = require('../models/index');

const bcrypt = require('bcryptjs');

class EmployeeService {
    async getAllEmployees() {
        return await db.users.findAll({
            where: { role: { [db.Sequelize.Op.ne]: 'Admin' } },
            attributes: { exclude: ['password'] }
        });
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
