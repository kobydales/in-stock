const express = require('express')
const router = express.Router()
const productModel = require('../models/productModel')

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await productModel.getAllProducts()
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await productModel.getProductById(req.params.id)
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create product
router.post('/', async (req, res) => {
  try {
    const newProduct = await productModel.createProduct(req.body)
    res.status(201).json(newProduct)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await productModel.updateProduct(req.params.id, req.body)
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json(updatedProduct)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await productModel.deleteProduct(req.params.id)
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json({ message: 'Product deleted', product: deletedProduct })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router