const express = require('express')
const router = express.Router()
const categoryModel = require('../models/categoryModel')
const { requireAuth, requireAdmin } = require('../middleware/auth')
const { validate } = require('../middleware/validate')
const { categorySchema } = require('../schemas/categorySchemas')
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

router.post('/', requireAuth, requireAdmin, validate(categorySchema), async (req, res) => {
  try {
    const newCategory = await categoryModel.createCategory(req.body, req.user.businessId)
    res.status(201).json(newCategory)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.put('/:id', requireAuth, requireAdmin, validate(categorySchema), async (req, res) => {
  try {
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