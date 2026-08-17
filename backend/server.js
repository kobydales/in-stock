const express = require('express')
const cors = require('cors')
const pool = require('./db')
const app = express()
const PORT = 5050
const productRoutes = require('./routes/products')
const categoryRoutes = require('./routes/categories')
const supplierRoutes = require('./routes/suppliers')

app.use(cors())
app.use(express.json())
app.use('/api/suppliers', supplierRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)

app.get('/', (req, res) => {
  res.send('In-Stock API is running')
})

app.get('/api', (req, res) => {
  res.json({ message: 'API is working' })
})

app.get('/api/test', (req, res) => {
  res.json({
    status: 'success',
    data: [
      { id: 1, name: 'Sample Item A' },
      { id: 2, name: 'Sample Item B' }
    ]
  })
})

app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json({ status: 'connected', time: result.rows[0] })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})