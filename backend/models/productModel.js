const pool = require('../db')

async function getAllProducts(businessId) {
  const result = await pool.query(`
    SELECT products.*, categories.name AS category_name, suppliers.name AS supplier_name
    FROM products
    LEFT JOIN categories ON products.category_id = categories.id
    LEFT JOIN suppliers ON products.supplier_id = suppliers.id
    WHERE products.business_id = $1
    ORDER BY products.id
  `, [businessId])
  return result.rows
}

async function getProductById(id, businessId) {
  const result = await pool.query(
    'SELECT * FROM products WHERE id = $1 AND business_id = $2',
    [id, businessId]
  )
  return result.rows[0]
}

async function createProduct(product, businessId) {
  const { name, sku, category_id, supplier_id, selling_price, cost_price, quantity, minimum_stock, description, status } = product

  const result = await pool.query(
    `INSERT INTO products (name, sku, category_id, supplier_id, selling_price, cost_price, quantity, minimum_stock, description, status, business_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [name, sku, category_id, supplier_id, selling_price, cost_price, quantity, minimum_stock, description, status, businessId]
  )
  return result.rows[0]
}

async function updateProduct(id, product, businessId) {
  const { name, sku, category_id, supplier_id, selling_price, cost_price, quantity, minimum_stock, description, status } = product

  const result = await pool.query(
    `UPDATE products
     SET name = $1, sku = $2, category_id = $3, supplier_id = $4, selling_price = $5,
         cost_price = $6, quantity = $7, minimum_stock = $8, description = $9, status = $10,
         updated_at = NOW()
     WHERE id = $11 AND business_id = $12
     RETURNING *`,
    [name, sku, category_id, supplier_id, selling_price, cost_price, quantity, minimum_stock, description, status, id, businessId]
  )
  return result.rows[0]
}

async function deleteProduct(id, businessId) {
  const result = await pool.query(
    'DELETE FROM products WHERE id = $1 AND business_id = $2 RETURNING *',
    [id, businessId]
  )
  return result.rows[0]
}

async function getLowStockProducts(businessId) {
  const result = await pool.query(`
    SELECT products.*, categories.name AS category_name, suppliers.name AS supplier_name
    FROM products
    LEFT JOIN categories ON products.category_id = categories.id
    LEFT JOIN suppliers ON products.supplier_id = suppliers.id
    WHERE products.quantity <= products.minimum_stock AND products.business_id = $1
    ORDER BY products.quantity ASC
  `, [businessId])
  return result.rows
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
}