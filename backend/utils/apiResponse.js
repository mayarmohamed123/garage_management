const apiResponse = (res, statusCode, message, data = {}, success = true) => {
    return res.status(statusCode).json({
        success,
        message,
        data
    });
};

module.exports = apiResponse;
