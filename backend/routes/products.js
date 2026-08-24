const express = require('express')
const router = express.Router()
const productModel = require('../models/productModel')
const { requireAuth } = require('../middleware/auth')

router.get('/low-stock', requireAuth, async (req, res) => {
  try {
    const products = await productModel.getLowStockProducts(req.user.businessId)
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/', requireAuth, async (req, res) => {
  try {
    const products = await productModel.getAllProducts(req.user.businessId)
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
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
    res.status(500).json({ error: err.message })
  }
})

router.post('/', requireAuth, async (req, res) => {
  try {
    const newProduct = await productModel.createProduct(req.body, req.user.businessId)
    res.status(201).json(newProduct)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const updatedProduct = await productModel.updateProduct(req.params.id, req.body, req.user.businessId)
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json(updatedProduct)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deletedProduct = await productModel.deleteProduct(req.params.id, req.user.businessId)
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json({ message: 'Product deleted', product: deletedProduct })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router