require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const pool = require('./db')

const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products')
const categoryRoutes = require('./routes/categories')
const supplierRoutes = require('./routes/suppliers')
const stockMovementRoutes = require('./routes/stockMovements')
const dashboardRoutes = require('./routes/dashboard')
const notificationRoutes = require('./routes/notifications')
const reportRoutes = require('./routes/reports')
const platformRoutes = require('./routes/platform')
const userRoutes = require('./routes/users')

const app = express()
const PORT = process.env.PORT || 5050

// Allowed frontend origins
const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : '*',
  })
)

app.use(helmet())
app.use(express.json({ limit: '1mb' }))

// Rate limit login/signup attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts, please try again later' },
})

// Log PostgreSQL errors
pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err)
})

// Database test
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json({
      status: 'ok',
      time: result.rows[0].now
    })
  } catch (err) {
    console.error('DB test error:', err)
    res.status(500).json({
      status: 'error',
      error: err.message
    })
  }
})

// Routes
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/suppliers', supplierRoutes)
app.use('/api/stock-movements', stockMovementRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/platform', platformRoutes)
app.use('/api/users', userRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

// Graceful shutdown
function shutdown(signal) {
  console.log(`${signal} received, shutting down gracefully`)

  server.close(() => {
    pool.end().then(() => {
      console.log('Database pool closed')
      process.exit(0)
    })
  })
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))