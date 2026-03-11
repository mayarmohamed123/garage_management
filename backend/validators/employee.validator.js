const { z } = require('zod');

const createEmployeeSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    role: z.enum(['Manager', 'Technician', 'Accountant']).default('Technician')
});

const updateEmployeeSchema = z.object({
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    email: z.string().email().optional(),
    role: z.enum(['Manager', 'Technician', 'Accountant']).optional(),
    status: z.enum(['active', 'inactive']).optional()
});

module.exports = {
    createEmployeeSchema,
    updateEmployeeSchema
};
