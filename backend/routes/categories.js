const express = require('express')
const router = express.Router()
const categoryModel = require('../models/categoryModel')

router.get('/', async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories()
    res.json(categories)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const category = await categoryModel.getCategoryById(req.params.id)
    if (!category) return res.status(404).json({ error: 'Category not found' })
    res.json(category)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const newCategory = await categoryModel.createCategory(req.body)
    res.status(201).json(newCategory)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const updated = await categoryModel.updateCategory(req.params.id, req.body)
    if (!updated) return res.status(404).json({ error: 'Category not found' })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await categoryModel.deleteCategory(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Category not found' })
    res.json({ message: 'Category deleted', category: deleted })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router