const express = require('express')
const router = express.Router()
const dashboardModel = require('../models/dashboardModel')
const { requireAuth } = require('../middleware/auth')
const { sendServerError } = require('../utils/errors')

router.get('/stats', requireAuth, async (req, res) => {
  try {
    const stats = await dashboardModel.getStats(req.user.businessId)
    res.json(stats)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.get('/recent-movements', requireAuth, async (req, res) => {
  try {
    const movements = await dashboardModel.getRecentMovements(req.user.businessId)
    res.json(movements)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.get('/recent-products', requireAuth, async (req, res) => {
  try {
    const products = await dashboardModel.getRecentProducts(req.user.businessId)
    res.json(products)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.get('/movement-chart', requireAuth, async (req, res) => {
  try {
    const data = await dashboardModel.getMovementChartData(req.user.businessId, req.query.days)
    res.json(data)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.get('/category-chart', requireAuth, async (req, res) => {
  try {
    const data = await dashboardModel.getCategoryChartData(req.user.businessId)
    res.json(data)
  } catch (err) {
    sendServerError(res, err)
  }
})

module.exports = router