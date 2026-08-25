const pool = require('../db')

async function stockIn(productId, quantity, notes, businessId) {
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
      `INSERT INTO stock_movements (product_id, quantity, movement_type, notes, business_id)
       VALUES ($1, $2, 'in', $3, $4)
       RETURNING *`,
      [productId, quantity, notes, businessId]
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

async function stockOut(productId, quantity, notes, businessId) {
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
      `INSERT INTO stock_movements (product_id, quantity, movement_type, notes, business_id)
       VALUES ($1, $2, 'out', $3, $4)
       RETURNING *`,
      [productId, quantity, notes, businessId]
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

module.exports = {
  stockIn,
  stockOut,
  getMovementsByProduct,
}