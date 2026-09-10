const express = require('express')
const router = express.Router()
const reportModel = require('../models/reportModel')
const { requireAuth, requireAdmin } = require('../middleware/auth')
const { sendServerError } = require('../utils/errors')

// Reports are admin-only across the board.
router.use(requireAuth, requireAdmin)

router.get('/inventory', async (req, res) => {
  try {
    const data = await reportModel.getInventoryReport(req.user.businessId)
    res.json(data)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.get('/stock-movements', async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    const data = await reportModel.getStockMovementReport(req.user.businessId, startDate, endDate)
    res.json(data)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.get('/low-stock', async (req, res) => {
  try {
    const data = await reportModel.getLowStockReport(req.user.businessId)
    res.json(data)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.get('/most-moved', async (req, res) => {
  try {
    const data = await reportModel.getMostMovedProducts(req.user.businessId)
    res.json(data)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.get('/valuation', async (req, res) => {
  try {
    const data = await reportModel.getValuationReport(req.user.businessId)
    res.json(data)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.get('/product-velocity', async (req, res) => {
  try {
    const order = req.query.order === 'least' ? 'least' : 'most'
    const limit = Math.min(Math.max(Number(req.query.limit) || 5, 1), 20)
    const data = await reportModel.getProductVelocity(req.user.businessId, { limit, order })
    res.json(data)
  } catch (err) {
    sendServerError(res, err)
  }
})

module.exports = router