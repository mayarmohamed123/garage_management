const { z } = require('zod');

const paymentSchema = z.object({
    amount: z.number().positive("Amount must be positive"),
    paymentMethod: z.enum(['Cash', 'Card', 'Transfer', 'Check']),
    transactionId: z.string().optional()
});

module.exports = { paymentSchema };
