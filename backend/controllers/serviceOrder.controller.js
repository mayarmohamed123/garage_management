const serviceOrderService = require('../services/serviceOrder.service');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { serviceOrderSchema, updateStatusSchema, addPartSchema, updateServiceOrderSchema } = require('../validators/serviceOrder.validator');

const createOrder = asyncHandler(async (req, res) => {
    const validatedData = serviceOrderSchema.parse(req.body);
    const result = await serviceOrderService.createOrder(validatedData);
    apiResponse(res, 201, "Service order created successfully", result);
});

const getOrders = asyncHandler(async (req, res) => {
    const result = await serviceOrderService.getAllOrders(req.query);
    apiResponse(res, 200, "Service orders retrieved successfully", result);
});

const getOrder = asyncHandler(async (req, res) => {
    const result = await serviceOrderService.getOrderById(req.params.id);
    apiResponse(res, 200, "Service order details retrieved", result);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const validatedData = updateStatusSchema.parse(req.body);
    const result = await serviceOrderService.updateStatus(req.params.id, validatedData.status);
    apiResponse(res, 200, "Order status updated successfully", result);
});

const updateOrder = asyncHandler(async (req, res) => {
    const validatedData = updateServiceOrderSchema.parse(req.body);
    const result = await serviceOrderService.updateOrder(req.params.id, validatedData);
    apiResponse(res, 200, "Service order updated successfully", result);
});

const addPart = asyncHandler(async (req, res) => {
    const validatedData = addPartSchema.parse(req.body);
    await serviceOrderService.addPartToOrder(req.params.id, validatedData);
    apiResponse(res, 200, "Part added to service order successfully");
});

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
    updateOrder,
    addPart
};
