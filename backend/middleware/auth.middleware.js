const jwt = require('jsonwebtoken');
const config = require('../config/env');
const db = require('../models/index');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return apiResponse(res, 401, "Not authorized to access this route", {}, false);
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = await db.users.findByPk(decoded.id);
        
        if (!req.user) {
            return apiResponse(res, 401, "User no longer exists", {}, false);
        }

        next();
    } catch (error) {
        return apiResponse(res, 401, "Token failed", {}, false);
    }
});

module.exports = { protect };
