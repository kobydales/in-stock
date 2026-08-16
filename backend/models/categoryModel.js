const pool = require('../db')

async function getAllCategories() {
  const result = await pool.query('SELECT * FROM categories ORDER BY id')
  return result.rows
}

async function getCategoryById(id) {
  const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id])
  return result.rows[0]
}

async function createCategory(category) {
  const { name, description, status } = category
  const result = await pool.query(
    `INSERT INTO categories (name, description, status)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, description, status]
  )
  return result.rows[0]
}

async function updateCategory(id, category) {
  const { name, description, status } = category
  const result = await pool.query(
    `UPDATE categories
     SET name = $1, description = $2, status = $3, updated_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [name, description, status, id]
  )
  return result.rows[0]
}

async function deleteCategory(id) {
  const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id])
  return result.rows[0]
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
}