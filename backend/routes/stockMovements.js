const express = require('express')
const router = express.Router()
const stockMovementModel = require('../models/stockMovementModel')
const { requireAuth } = require('../middleware/auth')

router.post('/in', requireAuth, async (req, res) => {
  try {
    const { product_id, quantity, notes } = req.body

    if (!product_id) {
      return res.status(400).json({ error: 'product_id is required' })
    }
    if (!quantity || Number(quantity) <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' })
    }

    const result = await stockMovementModel.stockIn(Number(product_id), Number(quantity), notes, req.user.businessId)
    res.status(201).json(result)
  } catch (err) {
    if (err.message === 'Product not found') {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.status(500).json({ error: err.message })
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

    const result = await stockMovementModel.stockOut(Number(product_id), Number(quantity), notes, req.user.businessId)
    res.status(201).json(result)
  } catch (err) {
    if (err.message === 'Product not found') {
      return res.status(404).json({ error: 'Product not found' })
    }
    if (err.message === 'INSUFFICIENT_STOCK') {
      return res.status(409).json({ error: 'Not enough stock available for this quantity' })
    }
    res.status(500).json({ error: err.message })
  }
})

router.get('/product/:productId', requireAuth, async (req, res) => {
  try {
    const movements = await stockMovementModel.getMovementsByProduct(req.params.productId, req.user.businessId)
    res.json(movements)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router