const authService = require('../services/auth.service');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

const register = asyncHandler(async (req, res) => {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.register(validatedData);
    apiResponse(res, 201, "User registered successfully", result);
});

const login = asyncHandler(async (req, res) => {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.login(validatedData.email, validatedData.password);
    apiResponse(res, 200, "Login successful", result);
});

const getMe = asyncHandler(async (req, res) => {
    const user = {
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        role: req.user.role
    };
    apiResponse(res, 200, "User profile retrieved", user);
});

module.exports = {
    register,
    login,
    getMe
};
