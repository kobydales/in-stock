const pool = require('../db')

async function getAllCategories(businessId) {
  const result = await pool.query(
    'SELECT * FROM categories WHERE business_id = $1 ORDER BY id',
    [businessId]
  )
  return result.rows
}

async function getCategoryById(id, businessId) {
  const result = await pool.query(
    'SELECT * FROM categories WHERE id = $1 AND business_id = $2',
    [id, businessId]
  )
  return result.rows[0]
}

async function createCategory(category, businessId) {
  const { name, description, status } = category
  const result = await pool.query(
    `INSERT INTO categories (name, description, status, business_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, description || null, status || 'active', businessId]
  )
  return result.rows[0]
}

async function updateCategory(id, category, businessId) {
  const { name, description, status } = category
  const result = await pool.query(
    `UPDATE categories
     SET name = $1, description = $2, status = $3, updated_at = NOW()
     WHERE id = $4 AND business_id = $5
     RETURNING *`,
    [name, description || null, status || 'active', id, businessId]
  )
  return result.rows[0]
}

async function deleteCategory(id, businessId) {
  const result = await pool.query(
    'DELETE FROM categories WHERE id = $1 AND business_id = $2 RETURNING *',
    [id, businessId]
  )
  return result.rows[0]
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
}