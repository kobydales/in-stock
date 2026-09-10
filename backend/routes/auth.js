const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

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

router.post('/signup', async (req, res) => {
  try {
    const businessName = String(req.body.businessName || '').trim()
    const name = String(req.body.name || '').trim()
    const email = String(req.body.email || '').trim().toLowerCase()
    const password = String(req.body.password || '')

    if (!businessName || !name || !email || !password) {
      return res.status(400).json({
        error: 'Business name, name, email and password are required',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

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

router.post('/login', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase()
    const password = String(req.body.password || '')

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

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

module.exports = router
