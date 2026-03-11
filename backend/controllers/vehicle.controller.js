const vehicleService = require('../services/vehicle.service');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { vehicleSchema } = require('../validators/vehicle.validator');

const registerVehicle = asyncHandler(async (req, res) => {
    const validatedData = vehicleSchema.parse(req.body);
    const result = await vehicleService.registerVehicle(validatedData);
    apiResponse(res, 201, "Vehicle registered successfully", result);
});

const getVehicles = asyncHandler(async (req, res) => {
    const result = await vehicleService.getAllVehicles(req.query);
    apiResponse(res, 200, "Vehicles retrieved successfully", result);
});

const getVehicle = asyncHandler(async (req, res) => {
    const result = await vehicleService.getVehicleById(req.params.id);
    apiResponse(res, 200, "Vehicle details retrieved", result);
});

const updateVehicle = asyncHandler(async (req, res) => {
    const validatedData = vehicleSchema.parse(req.body);
    const result = await vehicleService.updateVehicle(req.params.id, validatedData);
    apiResponse(res, 200, "Vehicle updated successfully", result);
});

const deleteVehicle = asyncHandler(async (req, res) => {
    await vehicleService.deleteVehicle(req.params.id);
    apiResponse(res, 200, "Vehicle deleted successfully");
});

module.exports = {
    registerVehicle,
    getVehicles,
    getVehicle,
    updateVehicle,
    deleteVehicle
};
