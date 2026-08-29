const pool = require('../db')


async function stockIn(productId, quantity, notes, businessId, userId) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const productResult = await client.query(
      'SELECT * FROM products WHERE id = $1 AND business_id = $2',
      [productId, businessId]
    )
    const product = productResult.rows[0]
    if (!product) {
      throw new Error('Product not found')
    }

    const newQuantity = product.quantity + quantity

    await client.query(
      'UPDATE products SET quantity = $1, updated_at = NOW() WHERE id = $2',
      [newQuantity, productId]
    )

    const movementResult = await client.query(
      `INSERT INTO stock_movements (product_id, quantity, movement_type, notes, business_id, user_id)
       VALUES ($1, $2, 'in', $3, $4, $5)
       RETURNING *`,
      [productId, quantity, notes, businessId, userId]
    )

    await client.query('COMMIT')
    return { movement: movementResult.rows[0], newQuantity }
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

async function stockOut(productId, quantity, notes, businessId, userId) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const productResult = await client.query(
      'SELECT * FROM products WHERE id = $1 AND business_id = $2',
      [productId, businessId]
    )
    const product = productResult.rows[0]
    if (!product) {
      throw new Error('Product not found')
    }

    if (product.quantity < quantity) {
      throw new Error('INSUFFICIENT_STOCK')
    }

    const newQuantity = product.quantity - quantity

    await client.query(
      'UPDATE products SET quantity = $1, updated_at = NOW() WHERE id = $2',
      [newQuantity, productId]
    )

    const movementResult = await client.query(
      `INSERT INTO stock_movements (product_id, quantity, movement_type, notes, business_id, user_id)
       VALUES ($1, $2, 'out', $3, $4, $5)
       RETURNING *`,
      [productId, quantity, notes, businessId, userId]
    )

    await client.query('COMMIT')
    return { movement: movementResult.rows[0], newQuantity }
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

async function getMovementsByProduct(productId, businessId) {
  const result = await pool.query(
    'SELECT * FROM stock_movements WHERE product_id = $1 AND business_id = $2 ORDER BY created_at DESC',
    [productId, businessId]
  )
  return result.rows
}

async function getAllMovements(businessId) {
  const result = await pool.query(
    `SELECT stock_movements.*, products.name AS product_name, users.name AS user_name
     FROM stock_movements
     JOIN products ON stock_movements.product_id = products.id
     LEFT JOIN users ON stock_movements.user_id = users.id
     WHERE stock_movements.business_id = $1
     ORDER BY stock_movements.created_at DESC`,
    [businessId]
  )
  return result.rows
}

module.exports = {
  stockIn,
  stockOut,
  getMovementsByProduct,
  getAllMovements,
}