const { z } = require('zod');

const vehicleSchema = z.object({
    make: z.string().min(2, "Make is required"),
    model: z.string().min(1, "Model is required"),
    year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
    licensePlate: z.string().min(3, "License plate is required"),
    vin: z.string().optional(),
    color: z.string().optional(),
    customerId: z.string().uuid("Invalid customer ID")
});

module.exports = { vehicleSchema };
