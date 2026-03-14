const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Employee = db.sequelize.define('Employee', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    hireDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    specialization: {
        type: DataTypes.STRING,
        allowNull: true
    },
    baseSalary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    }
}, {
    timestamps: true,
    paranoid: true
});

module.exports = Employee;
