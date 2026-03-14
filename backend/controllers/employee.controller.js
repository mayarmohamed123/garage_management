const employeeService = require('../services/employee.service');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { createEmployeeSchema, updateEmployeeSchema } = require('../validators/employee.validator');

const getEmployees = asyncHandler(async (req, res) => {
    const result = await employeeService.getAllEmployees(req.query);
    apiResponse(res, 200, "Employees retrieved successfully", result);
});

const createEmployee = asyncHandler(async (req, res) => {
    const validatedData = createEmployeeSchema.parse(req.body);
    const result = await employeeService.createEmployee(validatedData);
    apiResponse(res, 201, "Employee created successfully", result);
});

const updateEmployee = asyncHandler(async (req, res) => {
    const validatedData = updateEmployeeSchema.parse(req.body);
    const result = await employeeService.updateEmployee(req.params.id, validatedData);
    apiResponse(res, 200, "Employee updated successfully", result);
});

const deleteEmployee = asyncHandler(async (req, res) => {
    await employeeService.deleteEmployee(req.params.id);
    apiResponse(res, 200, "Employee deleted successfully");
});

const updateRole = asyncHandler(async (req, res) => {
    const { role } = req.body;
    const result = await employeeService.updateEmployeeRole(req.params.id, role);
    apiResponse(res, 200, "Employee role updated successfully", result);
});

const toggleStatus = asyncHandler(async (req, res) => {
    const result = await employeeService.toggleEmployeeStatus(req.params.id);
    apiResponse(res, 200, `Employee status changed to ${result.status}`, result);
});

module.exports = {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    updateRole,
    toggleStatus
};
