const jwt = require('jsonwebtoken');
const config = require('../config/env');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, config.JWT_SECRET, {
        expiresIn: '24h'
    });
};

module.exports = generateToken;
