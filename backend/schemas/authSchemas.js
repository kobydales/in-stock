const { z } = require('zod')

const email = z.string().trim().toLowerCase().min(1, 'Email is required').email('Enter a valid email address')
const password = z.string().min(6, 'Password must be at least 6 characters')

const signupSchema = z.object({
  businessName: z.string().trim().min(1, 'Business name is required'),
  name: z.string().trim().min(1, 'Name is required'),
  email,
  password,
})

const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
})

const forgotPasswordSchema = z.object({
  email,
})

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password,
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: password,
})

module.exports = { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema }

