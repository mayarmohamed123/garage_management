const { z } = require('zod');

const productSchema = z.object({
    name: z.string().min(2, "Name is required"),
    sku: z.string().min(3, "SKU is required"),
    description: z.string().optional(),
    price: z.preprocess((val) => parseFloat(val), z.number().positive()),
    stockQuantity: z.preprocess((val) => parseInt(val), z.number().int().min(0)),
    minStock: z.preprocess((val) => parseInt(val || 5), z.number().int().min(0)).optional(),
    category: z.string().optional(),
    image: z.string().optional()
});

module.exports = { productSchema };
