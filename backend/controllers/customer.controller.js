const customerService = require('../services/customer.service');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { customerSchema } = require('../validators/customer.validator');

const createCustomer = asyncHandler(async (req, res) => {
    const validatedData = customerSchema.parse(req.body);
    const result = await customerService.createCustomer(validatedData);
    apiResponse(res, 201, "Customer created successfully", result);
});

const getCustomers = asyncHandler(async (req, res) => {
    const result = await customerService.getAllCustomers(req.query);
    apiResponse(res, 200, "Customers retrieved successfully", result);
});

const getCustomer = asyncHandler(async (req, res) => {
    const result = await customerService.getCustomerById(req.params.id);
    apiResponse(res, 200, "Customer details retrieved", result);
});

const updateCustomer = asyncHandler(async (req, res) => {
    const validatedData = customerSchema.parse(req.body);
    const result = await customerService.updateCustomer(req.params.id, validatedData);
    apiResponse(res, 200, "Customer updated successfully", result);
});

const deleteCustomer = asyncHandler(async (req, res) => {
    await customerService.deleteCustomer(req.params.id);
    apiResponse(res, 200, "Customer deleted successfully");
});

module.exports = {
    createCustomer,
    getCustomers,
    getCustomer,
    updateCustomer,
    deleteCustomer
};
