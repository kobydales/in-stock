const express = require('express')
const router = express.Router()
const stockMovementModel = require('../models/stockMovementModel')
const { requireAuth } = require('../middleware/auth')
const { validate } = require('../middleware/validate')
const { stockMovementSchema } = require('../schemas/stockMovementSchemas')
const { sendServerError } = require('../utils/errors')

router.post('/in', requireAuth, validate(stockMovementSchema), async (req, res) => {
  try {
    const { product_id, quantity, notes } = req.body
    const result = await stockMovementModel.stockIn(
      product_id, quantity, notes, req.user.businessId, req.user.userId
    )
    res.status(201).json(result)
  } catch (err) {
    if (err.message === 'Product not found') {
      return res.status(404).json({ error: 'Product not found' })
    }
    sendServerError(res, err)
  }
})

router.post('/out', requireAuth, validate(stockMovementSchema), async (req, res) => {
  try {
    const { product_id, quantity, notes } = req.body
    const result = await stockMovementModel.stockOut(
      product_id, quantity, notes, req.user.businessId, req.user.userId
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