const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Payment = db.sequelize.define('Payment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    paymentDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    paymentMethod: {
        type: DataTypes.ENUM('Cash', 'Card', 'Transfer', 'Check'),
        allowNull: false
    },
    transactionId: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    paranoid: true
});

module.exports = Payment;
