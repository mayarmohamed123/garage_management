const { z } = require('zod');

const serviceOrderSchema = z.object({
    vehicleId: z.string().uuid("Invalid vehicle ID"),
    technicianId: z.string().uuid("Invalid technician ID"),
    description: z.string().min(5, "Description is required"),
    estimatedCompletionDate: z.string().optional(),
    laborCost: z.preprocess((val) => parseFloat(val || 0), z.number().min(0)).optional()
});

const updateStatusSchema = z.object({
    status: z.enum(['Pending', 'In Progress', 'Waiting for Parts', 'Completed', 'Delivered'])
});

const addPartSchema = z.object({
    productId: z.string().uuid("Invalid product ID"),
    quantity: z.number().int().positive("Quantity must be positive")
});

const updateServiceOrderSchema = z.object({
    vehicleId: z.string().uuid().optional(),
    technicianId: z.string().uuid().optional(),
    description: z.string().min(5).optional(),
    estimatedCompletionDate: z.string().optional(),
    laborCost: z.preprocess((val) => parseFloat(val || 0), z.number().min(0)).optional(),
    status: z.enum(['Pending', 'In Progress', 'Waiting for Parts', 'Completed', 'Delivered']).optional()
});

module.exports = {
    serviceOrderSchema,
    updateStatusSchema,
    addPartSchema,
    updateServiceOrderSchema
};
