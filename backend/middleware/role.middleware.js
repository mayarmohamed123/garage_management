const apiResponse = require('../utils/apiResponse');

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return apiResponse(res, 403, `User role ${req.user.role} is not authorized to access this route`, {}, false);
        }
        next();
    };
};

module.exports = { authorize };
