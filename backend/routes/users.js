const express = require('express')
const router = express.Router()
const userModel = require('../models/userModel')
const { requireAuth, requireAdmin } = require('../middleware/auth')
const { validate } = require('../middleware/validate')
const { createUserSchema } = require('../schemas/userSchemas')
const { sendServerError } = require('../utils/errors')

// Everything here is admin-only: staff can't see, add, or remove teammates.
router.use(requireAuth, requireAdmin)

router.get('/', async (req, res) => {
  try {
    const users = await userModel.getUsersByBusiness(req.user.businessId)
    res.json(users)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.post('/', validate(createUserSchema), async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    const existingUser = await userModel.findUserByEmail(email)
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' })
    }

    const user = await userModel.createStaffUser({
      businessId: req.user.businessId,
      name,
      email,
      password,
      role: role || 'staff',
    })
    res.status(201).json(user)
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'An account with this email already exists' })
    }
    sendServerError(res, err)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const targetId = Number(req.params.id)

    if (targetId === req.user.userId) {
      return res.status(400).json({ error: 'You cannot remove your own account' })
    }

    const target = await userModel.getUserById(targetId, req.user.businessId)
    if (!target) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (target.role === 'admin') {
      const adminCount = await userModel.countAdmins(req.user.businessId)
      if (adminCount <= 1) {
        return res.status(400).json({ error: 'Cannot remove the only admin on this account' })
      }
    }

    await userModel.deleteUser(targetId, req.user.businessId)
    res.json({ message: 'User removed', user: target })
  } catch (err) {
    sendServerError(res, err)
  }
})

module.exports = router