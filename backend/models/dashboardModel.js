const pool = require('../db')

async function getStats(businessId) {
  const totalProductsResult = await pool.query(
    'SELECT COUNT(*) FROM products WHERE business_id = $1', [businessId]
  )
  const totalQuantityResult = await pool.query(
    'SELECT COALESCE(SUM(quantity), 0) AS total FROM products WHERE business_id = $1', [businessId]
  )
  const lowStockResult = await pool.query(
    'SELECT COUNT(*) FROM products WHERE quantity <= minimum_stock AND business_id = $1',
    [businessId]
  )
  const outOfStockResult = await pool.query(
    'SELECT COUNT(*) FROM products WHERE quantity = 0 AND business_id = $1', [businessId]
  )

  return {
    totalProducts: Number(totalProductsResult.rows[0].count),
    totalQuantity: Number(totalQuantityResult.rows[0].total),
    lowStock: Number(lowStockResult.rows[0].count),
    outOfStock: Number(outOfStockResult.rows[0].count),
  }
}

async function getRecentMovements(businessId, limit = 5) {
  const result = await pool.query(
    `SELECT stock_movements.*, products.name AS product_name
     FROM stock_movements
     JOIN products ON stock_movements.product_id = products.id
     WHERE stock_movements.business_id = $1
     ORDER BY stock_movements.created_at DESC
     LIMIT $2`,
    [businessId, limit]
  )
  return result.rows
}

async function getRecentProducts(businessId, limit = 5) {
  const result = await pool.query(
    'SELECT * FROM products WHERE business_id = $1 ORDER BY created_at DESC LIMIT $2',
    [businessId, limit]
  )
  return result.rows
}

async function getMovementChartData(businessId, days = 7) {
  const safeDays = Math.min(Math.max(Number(days) || 7, 1), 365)
  const result = await pool.query(
    `SELECT
      DATE(created_at) AS date,
      movement_type,
      SUM(quantity) AS total
    FROM stock_movements
    WHERE created_at >= NOW() - ($2 * INTERVAL '1 day') AND business_id = $1
    GROUP BY DATE(created_at), movement_type
    ORDER BY date`,
    [businessId, safeDays]
  )
  return result.rows
}

async function getCategoryChartData(businessId) {
  const result = await pool.query(
    `SELECT categories.name AS category_name, COUNT(products.id) AS product_count
     FROM categories
     LEFT JOIN products ON products.category_id = categories.id AND products.business_id = $1
     WHERE categories.business_id = $1
     GROUP BY categories.name
     ORDER BY product_count DESC`,
    [businessId]
  )
  return result.rows
}

module.exports = {
  getStats,
  getRecentMovements,
  getRecentProducts,
  getMovementChartData,
  getCategoryChartData,
}