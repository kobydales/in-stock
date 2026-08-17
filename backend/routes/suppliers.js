const express = require('express')
const router = express.Router()
const supplierModel = require('../models/supplierModel')

router.get('/', async (req, res) => {
  try {
    const suppliers = await supplierModel.getAllSuppliers()
    res.json(suppliers)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const supplier = await supplierModel.getSupplierById(req.params.id)
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' })
    res.json(supplier)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const newSupplier = await supplierModel.createSupplier(req.body)
    res.status(201).json(newSupplier)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const updated = await supplierModel.updateSupplier(req.params.id, req.body)
    if (!updated) return res.status(404).json({ error: 'Supplier not found' })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await supplierModel.deleteSupplier(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Supplier not found' })
    res.json({ message: 'Supplier deleted', supplier: deleted })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router