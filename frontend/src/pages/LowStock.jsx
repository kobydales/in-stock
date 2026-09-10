import { useState, useEffect } from 'react'
import { fetchLowStockProducts } from '../services/api'
import StockBadge from '../components/StockBadge'
import AdinkraWatermark from '../components/AdinkraWatermark'
import { capitalizeWords } from '../utils/textFormat'

import './Pages.css'

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
    <div className="page-shell page-lowstock">
      <AdinkraWatermark name="dwennimmen" className="page-watermark lowstock-watermark" />
      <AdinkraWatermark name="sankofa" className="page-watermark-secondary" />
      <h2>Low & Out of Stock</h2>

      {products.length === 0 ? (
        <p>No products with low or out-of-stock status right now.</p>
        ) : (
        <>
        <div className="desktop-table-wrap">
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
                  <td style={{ padding: '8px' }}>{capitalizeWords(product.name)}</td>
                  <td style={{ padding: '8px' }}>{product.quantity}</td>
                  <td style={{ padding: '8px' }}>{product.minimum_stock}</td>
                  <td style={{ padding: '8px' }}>{product.supplier_name ? capitalizeWords(product.supplier_name) : '—'}</td>
                  <td style={{ padding: '8px' }}><StockBadge product={product} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mobile-card-list">
          {products.map((product) => (
            <article className="mobile-record-card low-stock-card" key={`mobile-${product.id}`}>
              <div className="record-card-top">
                <div>
                  <h3>{capitalizeWords(product.name)}</h3>
                  <span className="record-subtle">Needs attention</span>
                </div>
                <StockBadge product={product} />
              </div>
              <div className="stock-alert-number">
                <div><span>Current stock</span><strong>{product.quantity}</strong></div>
                <div><span>Minimum</span><strong>{product.minimum_stock}</strong></div>
              </div>
              <div className="record-detail-list compact">
                <div><span>Supplier</span><strong>{product.supplier_name ? capitalizeWords(product.supplier_name) : '—'}</strong></div>
              </div>
            </article>
          ))}
        </div>
        </>
      )}
    </div>
  )
}

export default LowStock

