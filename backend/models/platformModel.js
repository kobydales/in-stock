const pool = require('../db')

// These queries intentionally are NOT scoped by business_id — they are only
// ever reachable through routes protected by requirePlatformOwner, which
// checks the `platformOwner` flag baked into the JWT at login/signup time
// (derived server-side from PLATFORM_OWNER_EMAIL, not from client input).

async function getPlatformOverview() {
  const businessCount = await pool.query('SELECT COUNT(*) FROM businesses')
  const userCount = await pool.query('SELECT COUNT(*) FROM users')
  const productCount = await pool.query('SELECT COUNT(*) FROM products')
  const movementCount = await pool.query('SELECT COUNT(*) FROM stock_movements')

  return {
    totalBusinesses: Number(businessCount.rows[0].count),
    totalUsers: Number(userCount.rows[0].count),
    totalProducts: Number(productCount.rows[0].count),
    totalStockMovements: Number(movementCount.rows[0].count),
  }
}

async function getAllBusinesses() {
  const result = await pool.query(`
    SELECT
      businesses.id,
      businesses.name,
      businesses.created_at,
      COUNT(DISTINCT users.id) AS user_count,
      COUNT(DISTINCT products.id) AS product_count,
      COALESCE(SUM(products.quantity), 0) AS total_stock_quantity
    FROM businesses
    LEFT JOIN users ON users.business_id = businesses.id
    LEFT JOIN products ON products.business_id = businesses.id
    GROUP BY businesses.id, businesses.name, businesses.created_at
    ORDER BY businesses.created_at DESC
  `)
  return result.rows
}

async function getBusinessDetail(businessId) {
  const businessResult = await pool.query(
    'SELECT id, name, created_at FROM businesses WHERE id = $1',
    [businessId]
  )
  const business = businessResult.rows[0]
  if (!business) return null

  const usersResult = await pool.query(
    'SELECT id, name, email, role, created_at FROM users WHERE business_id = $1 ORDER BY created_at',
    [businessId]
  )

  const statsResult = await pool.query(
    `SELECT
      COUNT(*) AS total_products,
      COALESCE(SUM(quantity), 0) AS total_quantity,
      COUNT(*) FILTER (WHERE quantity <= minimum_stock) AS low_stock,
      COUNT(*) FILTER (WHERE quantity = 0) AS out_of_stock,
      COALESCE(SUM(quantity * cost_price), 0) AS total_cost_value,
      COALESCE(SUM(quantity * selling_price), 0) AS total_retail_value
     FROM products
     WHERE business_id = $1`,
    [businessId]
  )

  const recentMovementsResult = await pool.query(
    `SELECT stock_movements.*, products.name AS product_name, users.name AS user_name
     FROM stock_movements
     JOIN products ON stock_movements.product_id = products.id
     LEFT JOIN users ON stock_movements.user_id = users.id
     WHERE stock_movements.business_id = $1
     ORDER BY stock_movements.created_at DESC
     LIMIT 20`,
    [businessId]
  )

  return {
    business,
    users: usersResult.rows,
    stats: {
      totalProducts: Number(statsResult.rows[0].total_products),
      totalQuantity: Number(statsResult.rows[0].total_quantity),
      lowStock: Number(statsResult.rows[0].low_stock),
      outOfStock: Number(statsResult.rows[0].out_of_stock),
      totalCostValue: Number(statsResult.rows[0].total_cost_value),
      totalRetailValue: Number(statsResult.rows[0].total_retail_value),
    },
    recentMovements: recentMovementsResult.rows,
  }
}

module.exports = {
  getPlatformOverview,
  getAllBusinesses,
  getBusinessDetail,
}
