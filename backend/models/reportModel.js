const pool = require('../db')

async function getInventoryReport(businessId) {
  const result = await pool.query(
    `SELECT products.id, products.name, products.sku, products.quantity, products.minimum_stock,
            products.status, categories.name AS category_name, suppliers.name AS supplier_name
     FROM products
     LEFT JOIN categories ON products.category_id = categories.id
     LEFT JOIN suppliers ON products.supplier_id = suppliers.id
     WHERE products.business_id = $1
     ORDER BY products.name`,
    [businessId]
  )
  return result.rows
}

async function getStockMovementReport(businessId, startDate, endDate) {
  const params = [businessId]
  let dateFilter = ''

  if (startDate) {
    params.push(startDate)
    dateFilter += ` AND stock_movements.created_at >= $${params.length}`
  }
  if (endDate) {
    params.push(endDate + ' 23:59:59')
    dateFilter += ` AND stock_movements.created_at <= $${params.length}`
  }

  const result = await pool.query(
    `SELECT stock_movements.*, products.name AS product_name
     FROM stock_movements
     JOIN products ON stock_movements.product_id = products.id
     WHERE stock_movements.business_id = $1 ${dateFilter}
     ORDER BY stock_movements.created_at DESC`,
    params
  )
  return result.rows
}

async function getLowStockReport(businessId) {
  const result = await pool.query(
    `SELECT products.name, products.quantity, products.minimum_stock, suppliers.name AS supplier_name
     FROM products
     LEFT JOIN suppliers ON products.supplier_id = suppliers.id
     WHERE products.quantity <= products.minimum_stock AND products.business_id = $1
     ORDER BY products.quantity ASC`,
    [businessId]
  )
  return result.rows
}

async function getMostMovedProducts(businessId, limit = 10) {
  const result = await pool.query(
    `SELECT products.name, SUM(stock_movements.quantity) AS total_moved, COUNT(*) AS movement_count
     FROM stock_movements
     JOIN products ON stock_movements.product_id = products.id
     WHERE stock_movements.business_id = $1
     GROUP BY products.name
     ORDER BY total_moved DESC
     LIMIT $2`,
    [businessId, limit]
  )
  return result.rows
}

module.exports = {
  getInventoryReport,
  getStockMovementReport,
  getLowStockReport,
  getMostMovedProducts,
}