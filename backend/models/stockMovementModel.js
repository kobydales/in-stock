const pool = require('../db')

async function stockIn(productId, quantity, notes) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const productResult = await client.query('SELECT * FROM products WHERE id = $1', [productId])
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
      `INSERT INTO stock_movements (product_id, quantity, movement_type, notes)
       VALUES ($1, $2, 'in', $3)
       RETURNING *`,
      [productId, quantity, notes]
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

async function getMovementsByProduct(productId) {
  const result = await pool.query(
    'SELECT * FROM stock_movements WHERE product_id = $1 ORDER BY created_at DESC',
    [productId]
  )
  return result.rows
}

module.exports = {
  stockIn,
  getMovementsByProduct,
}