const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const { validate } = require('../middleware/validate')
const { sendPasswordResetEmail } = require('../utils/email')
const { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } = require('../schemas/authSchemas')
const { requireAuth } = require('../middleware/auth')

function createToken(user) {
  const isPlatformOwner = Boolean(
    process.env.PLATFORM_OWNER_EMAIL &&
    user.email.toLowerCase() === process.env.PLATFORM_OWNER_EMAIL.toLowerCase()
  )

  return jwt.sign(
    {
      userId: user.id,
      businessId: user.business_id,
      role: user.role,
      platformOwner: isPlatformOwner,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

router.post('/signup', validate(signupSchema), async (req, res) => {
  try {
    const { businessName, name, email, password } = req.body

    const existingUser = await userModel.findUserByEmail(email)
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' })
    }

    const { user } = await userModel.createBusinessWithAdmin({
      businessName,
      name,
      email,
      password,
    })

    const token = createToken(user)

    res.status(201).json({
      token,
      user: {
        id: user.id,
        business_id: user.business_id,
        business_name: businessName,
        name: user.name,
        email: user.email,
        role: user.role,
        platformOwner: false,
      },
    })
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'An account with this email already exists' })
    }
    console.error('Signup error:', err)
    res.status(500).json({ error: 'Unable to create account' })
  }
})

router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await userModel.findUserByEmail(email)
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash)
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = createToken(user)
    const isPlatformOwner = Boolean(
      process.env.PLATFORM_OWNER_EMAIL &&
      user.email.toLowerCase() === process.env.PLATFORM_OWNER_EMAIL.toLowerCase()
    )

    res.json({
      token,
      user: {
        id: user.id,
        business_id: user.business_id,
        business_name: user.business_name,
        name: user.name,
        email: user.email,
        role: user.role,
        platformOwner: isPlatformOwner,
      },
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Unable to log in' })
  }
})

router.put('/change-password', requireAuth, validate(changePasswordSchema), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await userModel.getUserAuthById(req.user.userId)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const passwordMatches = await bcrypt.compare(currentPassword, user.password_hash)
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10)
    await userModel.updatePassword(user.id, newPasswordHash)

    res.json({ message: 'Password updated successfully' })
  } catch (err) {
    console.error('Change password error:', err)
    res.status(500).json({ error: 'Unable to change password' })
  }
})

router.post('/forgot-password', validate(forgotPasswordSchema), async (req, res) => {
  try {
    const { email } = req.body
    const rawToken = await userModel.setResetToken(email)

    // Always respond the same way whether or not the email exists —
    // otherwise this endpoint becomes a way to check which emails are registered
    if (rawToken) {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`
      await sendPasswordResetEmail({ to: email, resetUrl }).catch((err) => {
        console.error('Failed to send reset email:', err)
      })
    }

    res.json({ message: 'If that email is registered, a reset link has been sent.' })
  } catch (err) {
    console.error('Forgot password error:', err)
    res.status(500).json({ error: 'Unable to process request' })
  }
})

router.post('/reset-password', validate(resetPasswordSchema), async (req, res) => {
  try {
    const { token, password } = req.body
    const success = await userModel.resetPasswordWithToken(token, password)

    if (!success) {
      return res.status(400).json({ error: 'This reset link is invalid or has expired' })
    }

    res.json({ message: 'Password has been reset. You can now log in.' })
  } catch (err) {
    console.error('Reset password error:', err)
    res.status(500).json({ error: 'Unable to reset password' })
  }
})

module.exports = router