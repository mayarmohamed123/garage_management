module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const errors = err.errors || [];

    console.error(`[Error] ${statusCode} - ${message}`);
    if (errors.length) console.error(errors);

    res.status(statusCode).json({
        success: false,
        message,
        errors
    });
};
