const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Vehicle = db.sequelize.define('Vehicle', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    make: {
        type: DataTypes.STRING,
        allowNull: false // e.g., Toyota
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false // e.g., Corolla
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    licensePlate: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    vin: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    paranoid: true
});

module.exports = Vehicle;
