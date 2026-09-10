const express = require('express')
const router = express.Router()
const stockMovementModel = require('../models/stockMovementModel')
const { requireAuth } = require('../middleware/auth')
const { sendServerError } = require('../utils/errors')

router.post('/in', requireAuth, async (req, res) => {
  try {
    const { product_id, quantity, notes } = req.body

    if (!product_id) {
      return res.status(400).json({ error: 'product_id is required' })
    }
    if (!quantity || Number(quantity) <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' })
    }

    const result = await stockMovementModel.stockIn(
      Number(product_id), Number(quantity), notes, req.user.businessId, req.user.userId
    )
    res.status(201).json(result)
  } catch (err) {
    if (err.message === 'Product not found') {
      return res.status(404).json({ error: 'Product not found' })
    }
    sendServerError(res, err)
  }
})

router.post('/out', requireAuth, async (req, res) => {
  try {
    const { product_id, quantity, notes } = req.body

    if (!product_id) {
      return res.status(400).json({ error: 'product_id is required' })
    }
    if (!quantity || Number(quantity) <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' })
    }

    const result = await stockMovementModel.stockOut(
      Number(product_id), Number(quantity), notes, req.user.businessId, req.user.userId
    )
    res.status(201).json(result)
  } catch (err) {
    if (err.message === 'Product not found') {
      return res.status(404).json({ error: 'Product not found' })
    }
    if (err.message === 'INSUFFICIENT_STOCK') {
      return res.status(409).json({ error: 'Not enough stock available for this quantity' })
    }
    sendServerError(res, err)
  }
})

router.get('/product/:productId', requireAuth, async (req, res) => {
  try {
    const movements = await stockMovementModel.getMovementsByProduct(req.params.productId, req.user.businessId)
    res.json(movements)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.get('/', requireAuth, async (req, res) => {
  try {
    const movements = await stockMovementModel.getAllMovements(req.user.businessId)
    res.json(movements)
  } catch (err) {
    sendServerError(res, err)
  }
})

module.exports = router
