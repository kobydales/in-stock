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
    `SELECT stock_movements.*, products.name AS product_name, users.name AS user_name
     FROM stock_movements
     JOIN products ON stock_movements.product_id = products.id
     LEFT JOIN users ON stock_movements.user_id = users.id
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
    `SELECT products.id, products.name, SUM(stock_movements.quantity) AS total_moved, COUNT(*) AS movement_count
     FROM stock_movements
     JOIN products ON stock_movements.product_id = products.id
     WHERE stock_movements.business_id = $1
     GROUP BY products.id, products.name
     ORDER BY total_moved DESC
     LIMIT $2`,
    [businessId, limit]
  )
  return result.rows
}

// Ranks products by how much has been sold/removed (stock-out only — this
// is meant to answer "what moves fastest off the shelf", not general
// activity). Uses a LEFT JOIN from products so items with zero stock-out
// movements still show up — that matters for "least moved", where a
// product that's never sold is exactly the point.
async function getProductVelocity(businessId, { limit = 5, order = 'most' } = {}) {
  const direction = order === 'least' ? 'ASC' : 'DESC'
  const result = await pool.query(
    `SELECT
      products.id,
      products.name,
      COALESCE(SUM(stock_movements.quantity) FILTER (WHERE stock_movements.movement_type = 'out'), 0) AS total_out,
      COUNT(stock_movements.id) FILTER (WHERE stock_movements.movement_type = 'out') AS out_count
     FROM products
     LEFT JOIN stock_movements ON stock_movements.product_id = products.id
     WHERE products.business_id = $1
     GROUP BY products.id, products.name
     ORDER BY total_out ${direction}, products.name ASC
     LIMIT $2`,
    [businessId, limit]
  )
  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    totalOut: Number(row.total_out),
    outCount: Number(row.out_count),
  }))
}

async function getValuationReport(businessId) {
  const totalsResult = await pool.query(
    `SELECT
      COALESCE(SUM(quantity * cost_price), 0) AS total_cost_value,
      COALESCE(SUM(quantity * selling_price), 0) AS total_retail_value,
      COALESCE(SUM((minimum_stock - quantity) * cost_price)
        FILTER (WHERE quantity < minimum_stock), 0) AS restock_cost
     FROM products
     WHERE business_id = $1`,
    [businessId]
  )

  // Realized profit is an ESTIMATE: it uses each product's *current*
  // cost/selling price against past "out" movements, since we don't
  // store the price that was in effect at the time of each movement.
  const realizedResult = await pool.query(
    `SELECT
      COALESCE(SUM(stock_movements.quantity * (products.selling_price - products.cost_price)), 0) AS realized_profit_estimate,
      COALESCE(SUM(stock_movements.quantity * products.selling_price), 0) AS revenue_estimate
     FROM stock_movements
     JOIN products ON stock_movements.product_id = products.id
     WHERE stock_movements.business_id = $1 AND stock_movements.movement_type = 'out'`,
    [businessId]
  )

  const totals = totalsResult.rows[0]
  const realized = realizedResult.rows[0]

  return {
    totalCostValue: Number(totals.total_cost_value),
    totalRetailValue: Number(totals.total_retail_value),
    potentialProfit: Number(totals.total_retail_value) - Number(totals.total_cost_value),
    restockCost: Number(totals.restock_cost),
    realizedProfitEstimate: Number(realized.realized_profit_estimate),
    revenueEstimate: Number(realized.revenue_estimate),
  }
}

module.exports = {
  getInventoryReport,
  getStockMovementReport,
  getLowStockReport,
  getMostMovedProducts,
  getProductVelocity,
  getValuationReport,
}