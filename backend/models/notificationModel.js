const pool = require('../db')

async function createNotification(businessId, productId, message) {
  const result = await pool.query(
    `INSERT INTO notifications (business_id, product_id, message)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [businessId, productId, message]
  )
  return result.rows[0]
}

async function getNotifications(businessId) {
  const result = await pool.query(
    'SELECT * FROM notifications WHERE business_id = $1 ORDER BY created_at DESC LIMIT 50',
    [businessId]
  )
  return result.rows
}

async function getUnreadCount(businessId) {
  const result = await pool.query(
    'SELECT COUNT(*) FROM notifications WHERE business_id = $1 AND is_read = false',
    [businessId]
  )
  return Number(result.rows[0].count)
}

async function markAsRead(id, businessId) {
  const result = await pool.query(
    'UPDATE notifications SET is_read = true WHERE id = $1 AND business_id = $2 RETURNING *',
    [id, businessId]
  )
  return result.rows[0]
}

async function markAllAsRead(businessId) {
  await pool.query(
    'UPDATE notifications SET is_read = true WHERE business_id = $1 AND is_read = false',
    [businessId]
  )
}

module.exports = {
  createNotification,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
}