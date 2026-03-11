const paymentService = require('../services/payment.service');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { paymentSchema } = require('../validators/payment.validator');

const recordPayment = asyncHandler(async (req, res) => {
    const validatedData = paymentSchema.parse(req.body);
    const result = await paymentService.recordPayment(req.params.invoiceId, validatedData);
    apiResponse(res, 201, "Payment recorded successfully", result);
});

const getPayments = asyncHandler(async (req, res) => {
    const result = await paymentService.getInvoicePayments(req.params.invoiceId);
    apiResponse(res, 200, "Payments retrieved successfully", result);
});

module.exports = {
    recordPayment,
    getPayments
};
