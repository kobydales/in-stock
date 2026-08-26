import { useState, useEffect } from 'react'
import { fetchLowStockProducts } from '../services/api'
import StockBadge from '../components/StockBadge'

function LowStock() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchLowStockProducts()
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading low-stock products...</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>

  return (
    <div>
      <h2>Low & Out of Stock</h2>

      {products.length === 0 ? (
        <p>No products with low or out-of-stock status right now.</p>
        ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Name</th>
              <th style={{ padding: '8px' }}>Current Quantity</th>
              <th style={{ padding: '8px' }}>Minimum Quantity</th>
              <th style={{ padding: '8px' }}>Supplier</th>
              <th style={{ padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{product.name}</td>
                <td style={{ padding: '8px' }}>{product.quantity}</td>
                <td style={{ padding: '8px' }}>{product.minimum_stock}</td>
                <td style={{ padding: '8px' }}>{product.supplier_name || '—'}</td>
                <td style={{ padding: '8px' }}><StockBadge product={product} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default LowStock

