const express = require('express')
const router = express.Router()
const supplierModel = require('../models/supplierModel')
const { requireAuth, requireAdmin } = require('../middleware/auth')
const { sendServerError } = require('../utils/errors')

router.get('/', requireAuth, async (req, res) => {
  try {
    const suppliers = await supplierModel.getAllSuppliers(req.user.businessId)
    res.json(suppliers)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const supplier = await supplierModel.getSupplierById(req.params.id, req.user.businessId)
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' })
    res.json(supplier)
  } catch (err) {
    sendServerError(res, err)
  }
})

function validateSupplierBody(body) {
  const name = String(body.name || '').trim()
  if (!name) return 'Supplier name is required'
  if (name.length > 200) return 'Supplier name must be under 200 characters'
  return null
}

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const validationError = validateSupplierBody(req.body)
    if (validationError) {
      return res.status(400).json({ error: validationError })
    }
    const newSupplier = await supplierModel.createSupplier(req.body, req.user.businessId)
    res.status(201).json(newSupplier)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const validationError = validateSupplierBody(req.body)
    if (validationError) {
      return res.status(400).json({ error: validationError })
    }
    const updated = await supplierModel.updateSupplier(req.params.id, req.body, req.user.businessId)
    if (!updated) return res.status(404).json({ error: 'Supplier not found' })
    res.json(updated)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const deleted = await supplierModel.deleteSupplier(req.params.id, req.user.businessId)
    if (!deleted) {
      return res.status(404).json({ error: 'Supplier not found' })
    }
    res.json({ message: 'Supplier deleted', supplier: deleted })
  } catch (err) {
    if (err.code === '23503') {
      return res.status(409).json({
        error: 'Cannot delete this supplier — it is still assigned to one or more products. Reassign or remove those products first.',
      })
    }
    sendServerError(res, err)
  }
})

module.exports = router;
