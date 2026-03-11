const invoiceService = require('../services/invoice.service');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const generateInvoice = asyncHandler(async (req, res) => {
    const { serviceOrderId } = req.body;
    const result = await invoiceService.generateInvoice(serviceOrderId);
    apiResponse(res, 201, "Invoice generated successfully", result);
});

const getInvoices = asyncHandler(async (req, res) => {
    const result = await invoiceService.getAllInvoices();
    apiResponse(res, 200, "Invoices retrieved successfully", result);
});

const getInvoice = asyncHandler(async (req, res) => {
    const result = await invoiceService.getInvoiceById(req.params.id);
    apiResponse(res, 200, "Invoice details retrieved", result);
});

const updateInvoiceStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const result = await invoiceService.updateInvoiceStatus(req.params.id, status);
    apiResponse(res, 200, "Invoice status updated successfully", result);
});

module.exports = {
    generateInvoice,
    getInvoices,
    getInvoice,
    updateInvoiceStatus
};
