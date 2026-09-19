const express = require('express')
const router = express.Router()
const productModel = require('../models/productModel')
const notificationModel = require('../models/notificationModel')
const { requireAuth, requireAdmin } = require('../middleware/auth')
const { validate } = require('../middleware/validate')
const { productSchema } = require('../schemas/productSchemas')
const { sendServerError } = require('../utils/errors')

router.get('/low-stock', requireAuth, async (req, res) => {
  try {
    const products = await productModel.getLowStockProducts(req.user.businessId)
    res.json(products)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.get('/', requireAuth, async (req, res) => {
  try {
    const products = await productModel.getAllProducts(req.user.businessId)
    res.json(products)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const product = await productModel.getProductById(req.params.id, req.user.businessId)
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json(product)
  } catch (err) {
    sendServerError(res, err)
  }
})

router.post('/', requireAuth, validate(productSchema), async (req, res) => {
  try {
    const newProduct = await productModel.createProduct(req.body, req.user.businessId, req.user.userId)
    res.status(201).json(newProduct)
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'A product with this SKU already exists' })
    }
    sendServerError(res, err)
  }
})

router.put('/:id', requireAuth, validate(productSchema), async (req, res) => {
  try {
    const before = await productModel.getProductById(req.params.id, req.user.businessId)
    const updatedProduct = await productModel.updateProduct(req.params.id, req.body, req.user.businessId)
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' })
    }

    // Direct edits (not via Stock In/Out) can also cross the low-stock /
    // out-of-stock threshold, so check here too rather than only on
    // stock movements.
    if (before && Number(before.quantity) !== Number(updatedProduct.quantity)) {
      const wasOut = Number(before.quantity) <= 0
      const isOut = Number(updatedProduct.quantity) <= 0
      const wasLow = Number(before.quantity) <= Number(before.minimum_stock)
      const isLow = Number(updatedProduct.quantity) <= Number(updatedProduct.minimum_stock)

      if (isOut && !wasOut) {
        await notificationModel.createNotification(
          req.user.businessId,
          updatedProduct.id,
          `${updatedProduct.name} is now out of stock.`
        )
      } else if (isLow && !wasLow) {
        await notificationModel.createNotification(
          req.user.businessId,
          updatedProduct.id,
          `${updatedProduct.name} is low on stock (${updatedProduct.quantity} remaining).`
        )
      }
    }

    res.json(updatedProduct)
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'A product with this SKU already exists' })
    }
    sendServerError(res, err)
  }
})

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const deletedProduct = await productModel.deleteProduct(req.params.id, req.user.businessId)
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json({ message: 'Product deleted', product: deletedProduct })
  } catch (err) {
    sendServerError(res, err)
  }
})

module.exports = router