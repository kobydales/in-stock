const pool = require('../db')

async function getAllSuppliers() {
  const result = await pool.query('SELECT * FROM suppliers ORDER BY id')
  return result.rows
}

async function getSupplierById(id) {
  const result = await pool.query('SELECT * FROM suppliers WHERE id = $1', [id])
  return result.rows[0]
}

async function createSupplier(supplier) {
  const { name, contact_person, contact_phone, contact_email, address, notes } = supplier
  const result = await pool.query(
    `INSERT INTO suppliers (name, contact_person, contact_phone, contact_email, address, notes)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [name, contact_person, contact_phone, contact_email, address, notes]
  )
  return result.rows[0]
}

async function updateSupplier(id, supplier) {
  const { name, contact_person, contact_phone, contact_email, address, notes } = supplier
  const result = await pool.query(
    `UPDATE suppliers
     SET name = $1, contact_person = $2, contact_phone = $3, contact_email = $4,
         address = $5, notes = $6, updated_at = NOW()
     WHERE id = $7
     RETURNING *`,
    [name, contact_person, contact_phone, contact_email, address, notes, id]
  )
  return result.rows[0]
}

async function deleteSupplier(id) {
  const result = await pool.query('DELETE FROM suppliers WHERE id = $1 RETURNING *', [id])
  return result.rows[0]
}

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
}