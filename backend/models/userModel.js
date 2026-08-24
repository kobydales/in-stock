const pool = require('../db')
const bcrypt = require('bcrypt')

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
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
  return result.rows[0]
}

module.exports = {
  createBusinessWithAdmin,
  findUserByEmail,
}
