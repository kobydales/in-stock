const pool = require('../db')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

async function createBusinessWithAdmin({ businessName, name, email, password }) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const businessResult = await client.query(
      'INSERT INTO businesses (name) VALUES ($1) RETURNING *',
      [businessName]
    )
    const business = businessResult.rows[0]

    const passwordHash = await bcrypt.hash(password, 10)

    const userResult = await client.query(
      `INSERT INTO users (business_id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, 'admin')
       RETURNING id, business_id, name, email, role, created_at`,
      [business.id, name, email, passwordHash]
    )
    const user = userResult.rows[0]

    await client.query('COMMIT')
    return { business, user }
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT users.*, businesses.name AS business_name
     FROM users
     JOIN businesses ON businesses.id = users.business_id
     WHERE users.email = $1`,
    [email]
  )
  return result.rows[0]
}

async function createStaffUser({ businessId, name, email, password, role }) {
  const passwordHash = await bcrypt.hash(password, 10)
  const result = await pool.query(
    `INSERT INTO users (business_id, name, email, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, business_id, name, email, role, created_at`,
    [businessId, name, email, passwordHash, role]
  )
  return result.rows[0]
}

async function getUsersByBusiness(businessId) {
  const result = await pool.query(
    `SELECT
      users.id, users.name, users.email, users.role, users.created_at,
      COUNT(DISTINCT products.id) AS products_added,
      COUNT(DISTINCT stock_movements.id) AS stock_movements_recorded
     FROM users
     LEFT JOIN products ON products.created_by = users.id
     LEFT JOIN stock_movements ON stock_movements.user_id = users.id
     WHERE users.business_id = $1
     GROUP BY users.id
     ORDER BY users.created_at`,
    [businessId]
  )
  return result.rows.map((row) => ({
    ...row,
    products_added: Number(row.products_added),
    stock_movements_recorded: Number(row.stock_movements_recorded),
  }))
}

async function getUserById(id, businessId) {
  const result = await pool.query(
    'SELECT id, name, email, role, created_at FROM users WHERE id = $1 AND business_id = $2',
    [id, businessId]
  )
  return result.rows[0]
}

async function countAdmins(businessId) {
  const result = await pool.query(
    "SELECT COUNT(*) FROM users WHERE business_id = $1 AND role = 'admin'",
    [businessId]
  )
  return Number(result.rows[0].count)
}

async function deleteUser(id, businessId) {
  const result = await pool.query(
    'DELETE FROM users WHERE id = $1 AND business_id = $2 RETURNING id, name, email, role',
    [id, businessId]
  )
  return result.rows[0]
}

async function setResetToken(email) {
  const rawToken = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes

  const result = await pool.query(
    `UPDATE users
     SET reset_token_hash = $1, reset_token_expires_at = $2
     WHERE email = $3
     RETURNING id, email`,
    [tokenHash, expiresAt, email]
  )

  if (!result.rows[0]) return null
  return rawToken
}

async function resetPasswordWithToken(rawToken, newPassword) {
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')

  const userResult = await pool.query(
    `SELECT id FROM users
     WHERE reset_token_hash = $1 AND reset_token_expires_at > NOW()`,
    [tokenHash]
  )
  const user = userResult.rows[0]
  if (!user) return false

  const passwordHash = await bcrypt.hash(newPassword, 10)

  await pool.query(
    `UPDATE users
     SET password_hash = $1, reset_token_hash = NULL, reset_token_expires_at = NULL
     WHERE id = $2`,
    [passwordHash, user.id]
  )

  return true
}

async function getUserAuthById(id) {
  const result = await pool.query(
    'SELECT id, password_hash FROM users WHERE id = $1',
    [id]
  )
  return result.rows[0]
}

async function updatePassword(id, passwordHash) {
  await pool.query(
    'UPDATE users SET password_hash = $1 WHERE id = $2',
    [passwordHash, id]
  )
}

module.exports = {
  createBusinessWithAdmin,
  findUserByEmail,
  createStaffUser,
  getUsersByBusiness,
  getUserById,
  countAdmins,
  deleteUser,
  setResetToken,
  resetPasswordWithToken,
  getUserAuthById,
  updatePassword,
}