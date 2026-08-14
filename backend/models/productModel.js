const pool = require('../db')

async function getAllProducts() {
  const result = await pool.query('SELECT * FROM products ORDER BY id')
  return result.rows
}

async function getProductById(id) {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [id])
  return result.rows[0]
}

async function createProduct(product) {
  const { name, sku, category_id, supplier_id, selling_price, cost_price, quantity, minimum_stock, description, status } = product

  const result = await pool.query(
    `INSERT INTO products (name, sku, category_id, supplier_id, selling_price, cost_price, quantity, minimum_stock, description, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [name, sku, category_id, supplier_id, selling_price, cost_price, quantity, minimum_stock, description, status]
  )
  return result.rows[0]
}

async function updateProduct(id, product) {
  const { name, sku, category_id, supplier_id, selling_price, cost_price, quantity, minimum_stock, description, status } = product

  const result = await pool.query(
    `UPDATE products
     SET name = $1, sku = $2, category_id = $3, supplier_id = $4, selling_price = $5,
         cost_price = $6, quantity = $7, minimum_stock = $8, description = $9, status = $10,
         updated_at = NOW()
     WHERE id = $11
     RETURNING *`,
    [name, sku, category_id, supplier_id, selling_price, cost_price, quantity, minimum_stock, description, status, id]
  )
  return result.rows[0]
}

async function deleteProduct(id) {
  const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id])
  return result.rows[0]
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}