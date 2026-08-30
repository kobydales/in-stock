const express = require('express')
const router = express.Router()
const reportModel = require('../models/reportModel')
const { requireAuth } = require('../middleware/auth')

router.get('/inventory', requireAuth, async (req, res) => {
  try {
    const data = await reportModel.getInventoryReport(req.user.businessId)
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/stock-movements', requireAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    const data = await reportModel.getStockMovementReport(req.user.businessId, startDate, endDate)
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/low-stock', requireAuth, async (req, res) => {
  try {
    const data = await reportModel.getLowStockReport(req.user.businessId)
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/most-moved', requireAuth, async (req, res) => {
  try {
    const data = await reportModel.getMostMovedProducts(req.user.businessId)
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router