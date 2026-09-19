const { z } = require('zod')

const supplierSchema = z.object({
  name: z.string().trim().min(1, 'Supplier name is required').max(200, 'Supplier name must be under 200 characters'),
  contact_person: z.string().trim().max(200).optional().nullable().or(z.literal('')),
  contact_phone: z.string().trim().max(50).optional().nullable().or(z.literal('')),
  contact_email: z.string().trim().email('Enter a valid email address').max(200).optional().nullable().or(z.literal('')),
  address: z.string().trim().max(500).optional().nullable().or(z.literal('')),
  notes: z.string().trim().max(1000).optional().nullable().or(z.literal('')),
})

module.exports = { supplierSchema }
