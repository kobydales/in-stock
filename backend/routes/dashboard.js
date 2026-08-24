const express = require('express')
const router = express.Router()
const dashboardModel = require('../models/dashboardModel')
const { requireAuth } = require('../middleware/auth')


router.get('/stats', requireAuth, async (req, res) => {
  try {
    const stats = await dashboardModel.getStats()
    res.json(stats)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/recent-movements', async (req, res) => {
  try {
    const movements = await dashboardModel.getRecentMovements()
    res.json(movements)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/recent-products', async (req, res) => {
  try {
    const products = await dashboardModel.getRecentProducts()
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/movement-chart', async (req, res) => {
  try {
    const data = await dashboardModel.getMovementChartData()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/category-chart', async (req, res) => {
  try {
    const data = await dashboardModel.getCategoryChartData()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router