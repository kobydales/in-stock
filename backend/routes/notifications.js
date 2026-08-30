const express = require('express')
const router = express.Router()
const notificationModel = require('../models/notificationModel')
const { requireAuth } = require('../middleware/auth')

router.get('/', requireAuth, async (req, res) => {
  try {
    const notifications = await notificationModel.getNotifications(req.user.businessId)
    res.json(notifications)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/unread-count', requireAuth, async (req, res) => {
  try {
    const count = await notificationModel.getUnreadCount(req.user.businessId)
    res.json({ count })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id/read', requireAuth, async (req, res) => {
  try {
    const updated = await notificationModel.markAsRead(req.params.id, req.user.businessId)
    if (!updated) return res.status(404).json({ error: 'Notification not found' })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/read-all', requireAuth, async (req, res) => {
  try {
    await notificationModel.markAllAsRead(req.user.businessId)
    res.json({ message: 'All notifications marked as read' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router