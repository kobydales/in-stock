const pool = require('../db')

async function getStats() {
  const totalProductsResult = await pool.query('SELECT COUNT(*) FROM products')
  const totalQuantityResult = await pool.query('SELECT COALESCE(SUM(quantity), 0) AS total FROM products')
  const lowStockResult = await pool.query(
    'SELECT COUNT(*) FROM products WHERE quantity > 0 AND quantity <= minimum_stock'
  )
  const outOfStockResult = await pool.query('SELECT COUNT(*) FROM products WHERE quantity = 0')

  return {
    totalProducts: Number(totalProductsResult.rows[0].count),
    totalQuantity: Number(totalQuantityResult.rows[0].total),
    lowStock: Number(lowStockResult.rows[0].count),
    outOfStock: Number(outOfStockResult.rows[0].count),
  }
}


async function getRecentMovements(limit = 5) {
  const result = await pool.query(
    `SELECT stock_movements.*, products.name AS product_name
     FROM stock_movements
     JOIN products ON stock_movements.product_id = products.id
     ORDER BY stock_movements.created_at DESC
     LIMIT $1`,
    [limit]
  )
  return result.rows
}

async function getRecentProducts(limit = 5) {
  const result = await pool.query(
    'SELECT * FROM products ORDER BY created_at DESC LIMIT $1',
    [limit]
  )
  return result.rows
}

async function getMovementChartData() {
  const result = await pool.query(`
    SELECT
      DATE(created_at) AS date,
      movement_type,
      SUM(quantity) AS total
    FROM stock_movements
    WHERE created_at >= NOW() - INTERVAL '7 days'
    GROUP BY DATE(created_at), movement_type
    ORDER BY date
  `)
  return result.rows
}

async function getCategoryChartData() {
  const result = await pool.query(`
    SELECT categories.name AS category_name, COUNT(products.id) AS product_count
    FROM categories
    LEFT JOIN products ON products.category_id = categories.id
    GROUP BY categories.name
    ORDER BY product_count DESC
  `)
  return result.rows
}

module.exports = {
  getStats,
  getRecentMovements,
  getRecentProducts,
  getMovementChartData,
  getCategoryChartData,
}