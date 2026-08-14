const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 5050

app.use(cors())
app.use(express.json())

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})