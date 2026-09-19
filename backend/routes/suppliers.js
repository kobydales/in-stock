const express = require('express')
const router = express.Router()
const supplierModel = require('../models/supplierModel')
const { requireAuth, requireAdmin } = require('../middleware/auth')
const { validate } = require('../middleware/validate')
const { supplierSchema } = require('../schemas/supplierSchemas')
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

router.post('/', requireAuth, requireAdmin, validate(supplierSchema), async (req, res) => {
  try {
    const newSupplier = await supplierModel.createSupplier(req.body, req.user.businessId)
    res.status(201).json(newSupplier)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.put('/:id', requireAuth, requireAdmin, validate(supplierSchema), async (req, res) => {
  try {
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

module.exports = router