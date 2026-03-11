const { z } = require('zod');

const customerSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address").optional().or(z.literal('')),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
    address: z.string().optional()
});

module.exports = { customerSchema };
