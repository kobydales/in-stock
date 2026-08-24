const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

router.post('/signup', async (req, res) => {
  try {
    const { businessName, name, email, password } = req.body

    if (!businessName || !name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    const existingUser = await userModel.findUserByEmail(email)
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' })
    }

    const { business, user } = await userModel.createBusinessWithAdmin({
      businessName,
      name,
      email,
      password,
    })

    const token = jwt.sign(
      { userId: user.id, businessId: user.business_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({ token, user, business })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

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

    const token = jwt.sign(
      { userId: user.id, businessId: user.business_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        business_id: user.business_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router