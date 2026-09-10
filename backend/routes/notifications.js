const express = require('express')
const router = express.Router()
const notificationModel = require('../models/notificationModel')
const { requireAuth } = require('../middleware/auth')
const { sendServerError } = require('../utils/errors')

router.get('/', requireAuth, async (req, res) => {
  try {
    const notifications = await notificationModel.getNotifications(req.user.businessId)
    res.json(notifications)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.get('/unread-count', requireAuth, async (req, res) => {
  try {
    const count = await notificationModel.getUnreadCount(req.user.businessId)
    res.json({ count })
  } catch (err) {
    sendServerError(res, err)
  }
})

router.put('/:id/read', requireAuth, async (req, res) => {
  try {
    const updated = await notificationModel.markAsRead(req.params.id, req.user.businessId)
    if (!updated) return res.status(404).json({ error: 'Notification not found' })
    res.json(updated)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.put('/read-all', requireAuth, async (req, res) => {
  try {
    await notificationModel.markAllAsRead(req.user.businessId)
    res.json({ message: 'All notifications marked as read' })
  } catch (err) {
    sendServerError(res, err)
  }
})

module.exports = router