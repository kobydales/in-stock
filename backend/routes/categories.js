const express = require('express')
const router = express.Router()
const categoryModel = require('../models/categoryModel')
const { requireAuth } = require('../middleware/auth')

router.get('/', requireAuth, async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories(req.user.businessId)
    res.json(categories)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const category = await categoryModel.getCategoryById(req.params.id, req.user.businessId)
    if (!category) return res.status(404).json({ error: 'Category not found' })
    res.json(category)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', requireAuth, async (req, res) => {
  try {
    const newCategory = await categoryModel.createCategory(req.body, req.user.businessId)
    res.status(201).json(newCategory)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const updated = await categoryModel.updateCategory(req.params.id, req.body, req.user.businessId)
    if (!updated) return res.status(404).json({ error: 'Category not found' })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await categoryModel.deleteCategory(req.params.id, req.user.businessId)
    if (!deleted) return res.status(404).json({ error: 'Category not found' })
    res.json({ message: 'Category deleted', category: deleted })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router