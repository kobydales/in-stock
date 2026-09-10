import { useEffect, useMemo, useState } from 'react'
import { fetchProducts } from '../services/api'
import StockBadge from '../components/StockBadge'
import AdinkraWatermark from '../components/AdinkraWatermark'
import { capitalizeWords } from '../utils/textFormat'
import './Pages.css'

function Inventory() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim()
    if (!term) return products
    return products.filter((p) =>
      p.name.toLowerCase().includes(term) ||
      (p.sku && p.sku.toLowerCase().includes(term))
    )
  }, [products, search])

  const totalUnits = products.reduce((sum, p) => sum + Number(p.quantity || 0), 0)
  const lowStock = products.filter((p) => Number(p.quantity) > 0 && Number(p.quantity) <= Number(p.minimum_stock)).length
  const outOfStock = products.filter((p) => Number(p.quantity) <= 0).length

  if (loading) return <p>Loading inventory...</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>

  return (
    <div className="page-shell page-inventory">
      <AdinkraWatermark name="adinkrahene" className="page-watermark inventory-watermark" />
      <AdinkraWatermark name="gyeNyame" className="page-watermark-secondary" />
      <div className="inventory-intro">
        <div>
          <h2>Inventory</h2>
          <p>See the current stock position across your products.</p>
        </div>
        <div className="inventory-summary-pills">
          <span>{products.length} products</span>
          <span>{totalUnits} units</span>
        </div>
      </div>

      <div className="inventory-stat-grid">
        <div className="inventory-stat-card"><span>Total Products</span><strong>{products.length}</strong><small>Active catalogue</small></div>
        <div className="inventory-stat-card"><span>Total Units</span><strong>{totalUnits}</strong><small>Currently in stock</small></div>
        <div className="inventory-stat-card warning"><span>Low Stock</span><strong>{lowStock}</strong><small>Needs attention</small></div>
        <div className="inventory-stat-card danger"><span>Out of Stock</span><strong>{outOfStock}</strong><small>Currently unavailable</small></div>
      </div>

      <div className="inventory-toolbar">
        <input
          type="search"
          placeholder="Search products or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="result-count">Showing {filtered.length} of {products.length}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-symbol">✣</div>
          <h3>No inventory items found</h3>
          <p>{search ? `Nothing matches “${search}”.` : 'Add a product to begin tracking inventory.'}</p>
        </div>
      ) : (
        <div className="compact-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th className="hide-on-compact">SKU</th>
                <th>Quantity</th>
                <th className="hide-on-compact">Minimum</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td data-label="Product"><strong>{capitalizeWords(p.name)}</strong></td>
                  <td data-label="Category">{p.category_name ? capitalizeWords(p.category_name) : '—'}</td>
                  <td data-label="SKU" className="hide-on-compact">{p.sku || '—'}</td>
                  <td data-label="Quantity"><strong>{p.quantity}</strong></td>
                  <td data-label="Minimum" className="hide-on-compact">{p.minimum_stock}</td>
                  <td data-label="Status"><StockBadge product={p} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Inventory
