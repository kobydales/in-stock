const { z } = require('zod')

const stockMovementSchema = z.object({
  product_id: z.coerce.number({ invalid_type_error: 'product_id must be a number' }).int().positive('product_id is required'),
  quantity: z.coerce.number({ invalid_type_error: 'Quantity must be a number' }).positive('Quantity must be greater than 0'),
  notes: z.string().trim().max(500).optional().nullable().or(z.literal('')),
})

module.exports = { stockMovementSchema }
