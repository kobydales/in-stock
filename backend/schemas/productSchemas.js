const { z } = require('zod')

const productSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required').max(200, 'Product name must be under 200 characters'),
  sku: z.string().trim().max(100, 'SKU must be under 100 characters').optional().nullable().or(z.literal('')),
  category_id: z.union([z.number(), z.string()]).optional().nullable(),
  supplier_id: z.union([z.number(), z.string()]).optional().nullable(),
  selling_price: z.coerce.number().min(0, 'Selling price cannot be negative').optional(),
  cost_price: z.coerce.number().min(0, 'Cost price cannot be negative').optional(),
  quantity: z.coerce.number().min(0, 'Quantity cannot be negative').optional(),
  minimum_stock: z.coerce.number().min(0, 'Minimum stock cannot be negative').optional(),
  description: z.string().trim().optional().nullable().or(z.literal('')),
  status: z.string().optional(),
})

module.exports = { productSchema }
