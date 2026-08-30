import { useState, useEffect } from 'react'
import { fetchAllMovements, fetchProducts } from '../services/api'

function History() {
  const [movements, setMovements] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [productFilter, setProductFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    Promise.all([fetchAllMovements(), fetchProducts()])
      .then(([movementsData, productsData]) => {
        setMovements(movementsData)
        setProducts(productsData)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const filteredMovements = movements.filter((m) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      m.product_name.toLowerCase().includes(term) ||
      (m.notes && m.notes.toLowerCase().includes(term))

    const matchesType = typeFilter === '' || m.movement_type === typeFilter
    const matchesProduct = productFilter === '' || m.product_id === Number(productFilter)

    const movementDate = new Date(m.created_at)
    const matchesStart = startDate === '' || movementDate >= new Date(startDate)
    const matchesEnd = endDate === '' || movementDate <= new Date(endDate + 'T23:59:59')

    return matchesSearch && matchesType && matchesProduct && matchesStart && matchesEnd
  })

  if (loading) return <p>Loading history...</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>

  return (
    <div>
      <h2>Inventory History</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
        <input
          type="text"
          placeholder="Search product or notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', width: '220px' }}
        />

        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ padding: '8px' }}>
          <option value="">All Types</option>
          <option value="in">Stock In</option>
          <option value="out">Stock Out</option>
        </select>

        <select value={productFilter} onChange={(e) => setProductFilter(e.target.value)} style={{ padding: '8px' }}>
          <option value="">All Products</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ padding: '8px' }}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ padding: '8px' }}
        />
      </div>

      {filteredMovements.length === 0 ? (
        <p style={{ marginTop: '16px' }}>No movements match your filters.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Date</th>
              <th style={{ padding: '8px' }}>Product</th>
              <th style={{ padding: '8px' }}>Type</th>
              <th style={{ padding: '8px' }}>Quantity</th>
              <th style={{ padding: '8px' }}>User</th>
              <th style={{ padding: '8px' }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredMovements.map((m) => (
              <tr key={m.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{new Date(m.created_at).toLocaleString()}</td>
                <td style={{ padding: '8px' }}>{m.product_name}</td>
                <td style={{ padding: '8px', color: m.movement_type === 'in' ? '#5cb85c' : '#d9534f' }}>
                  {m.movement_type === 'in' ? 'Stock In' : 'Stock Out'}
                </td>
                <td style={{ padding: '8px' }}>{m.quantity}</td>
                <td style={{ padding: '8px' }}>{m.user_name || '—'}</td>
                <td style={{ padding: '8px' }}>{m.notes || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default History