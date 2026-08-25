const pool = require('../db')

async function getAllSuppliers(businessId) {
  const result = await pool.query(
    'SELECT * FROM suppliers WHERE business_id = $1 ORDER BY id',
    [businessId]
  )
  return result.rows
}

async function getSupplierById(id, businessId) {
  const result = await pool.query(
    'SELECT * FROM suppliers WHERE id = $1 AND business_id = $2',
    [id, businessId]
  )
  return result.rows[0]
}

async function createSupplier(supplier, businessId) {
  const { name, contact_person, contact_phone, contact_email, address, notes } = supplier
  const result = await pool.query(
    `INSERT INTO suppliers (name, contact_person, contact_phone, contact_email, address, notes, business_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [name, contact_person, contact_phone, contact_email, address, notes, businessId]
  )
  return result.rows[0]
}

async function updateSupplier(id, supplier, businessId) {
  const { name, contact_person, contact_phone, contact_email, address, notes } = supplier
  const result = await pool.query(
    `UPDATE suppliers
     SET name = $1, contact_person = $2, contact_phone = $3, contact_email = $4,
         address = $5, notes = $6, updated_at = NOW()
     WHERE id = $7 AND business_id = $8
     RETURNING *`,
    [name, contact_person, contact_phone, contact_email, address, notes, id, businessId]
  )
  return result.rows[0]
}

async function deleteSupplier(id, businessId) {
  const result = await pool.query(
    'DELETE FROM suppliers WHERE id = $1 AND business_id = $2 RETURNING *',
    [id, businessId]
  )
  return result.rows[0]
}

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
}