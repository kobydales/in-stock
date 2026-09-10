const express = require('express')
const router = express.Router()
const categoryModel = require('../models/categoryModel')
const { requireAuth, requireAdmin } = require('../middleware/auth')
const { sendServerError } = require('../utils/errors')

router.get('/', requireAuth, async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories(req.user.businessId)
    res.json(categories)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const category = await categoryModel.getCategoryById(req.params.id, req.user.businessId)
    if (!category) return res.status(404).json({ error: 'Category not found' })
    res.json(category)
  } catch (err) {
    sendServerError(res, err)
  }
})

function validateCategoryBody(body) {
  const name = String(body.name || '').trim()
  if (!name) return 'Category name is required'
  if (name.length > 200) return 'Category name must be under 200 characters'
  return null
}

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const validationError = validateCategoryBody(req.body)
    if (validationError) {
      return res.status(400).json({ error: validationError })
    }
    const newCategory = await categoryModel.createCategory(req.body, req.user.businessId)
    res.status(201).json(newCategory)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const validationError = validateCategoryBody(req.body)
    if (validationError) {
      return res.status(400).json({ error: validationError })
    }
    const updated = await categoryModel.updateCategory(req.params.id, req.body, req.user.businessId)
    if (!updated) return res.status(404).json({ error: 'Category not found' })
    res.json(updated)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const deleted = await categoryModel.deleteCategory(req.params.id, req.user.businessId)
    if (!deleted) return res.status(404).json({ error: 'Category not found' })
    res.json({ message: 'Category deleted', category: deleted })
  } catch (err) {
    sendServerError(res, err)
  }
})

module.exports = router