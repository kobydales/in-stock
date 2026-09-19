const { z } = require('zod')

const categorySchema = z.object({
  name: z.string().trim().min(1, 'Category name is required').max(200, 'Category name must be under 200 characters'),
  description: z.string().trim().max(1000, 'Description must be under 1000 characters').optional().nullable().or(z.literal('')),
  status: z.string().optional(),
})

module.exports = { categorySchema }
