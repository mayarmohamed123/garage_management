const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Invoice = db.sequelize.define('Invoice', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    invoiceNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    taxAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    discountAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    status: {
        type: DataTypes.ENUM('Unpaid', 'Partially Paid', 'Paid', 'Cancelled'),
        defaultValue: 'Unpaid'
    }
}, {
    timestamps: true,
    paranoid: true
});

module.exports = Invoice;
