const { DataTypes } = require('sequelize');
const db = require('../config/db');

const ServiceOrder = db.sequelize.define('ServiceOrder', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    orderNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'In Progress', 'Waiting for Parts', 'Completed', 'Delivered'),
        defaultValue: 'Pending'
    },
    laborCost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    estimatedCompletionDate: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true,
    paranoid: true
});

module.exports = ServiceOrder;
