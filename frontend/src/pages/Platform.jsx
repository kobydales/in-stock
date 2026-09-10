import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchPlatformOverview, fetchPlatformBusinesses } from '../services/api'
import { capitalizeWords } from '../utils/textFormat'
import AdinkraWatermark from '../components/AdinkraWatermark'
import Icon from '../components/Icon'
import '../pages/Pages.css'
import '../pages/Dashboard.css'

function Platform() {
  const [overview, setOverview] = useState(null)
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    Promise.all([fetchPlatformOverview(), fetchPlatformBusinesses()])
      .then(([overviewData, businessesData]) => {
        setOverview(overviewData)
        setBusinesses(businessesData)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const filteredBusinesses = businesses.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <p>Loading platform overview...</p>
  if (error) return <div className="dashboard-error"><strong>We couldn't load the platform overview.</strong><span>{error}</span></div>

  const statCards = [
    { label: 'Businesses', value: overview.totalBusinesses, detail: 'Workspaces on the platform', icon: 'building', tone: 'green' },
    { label: 'Users', value: overview.totalUsers, detail: 'Across every business', icon: 'package', tone: 'gold' },
    { label: 'Products', value: overview.totalProducts, detail: 'Total catalogue items', icon: 'box', tone: 'amber' },
    { label: 'Stock Movements', value: overview.totalStockMovements, detail: 'All-time stock in/out', icon: 'history', tone: 'red' },
  ]

  return (
    <div className="page-shell page-platform">
      <AdinkraWatermark name="adinkrahene" className="page-watermark" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Platform Overview</h2>
      </div>
      <p style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '-8px', marginBottom: '18px' }}>
        Visible only to the platform owner. Every business below remains fully isolated from the others.
      </p>

      <section className="stats-grid" style={{ marginBottom: '22px' }}>
        {statCards.map((card) => (
          <div key={card.label} className={`stat-card ${card.tone}`}>
            <div className="stat-copy">
              <span className="stat-label">{card.label}</span>
              <strong className="stat-value">{card.value}</strong>
              <span className="stat-detail">{card.detail}</span>
            </div>
            <span className="stat-icon"><Icon name={card.icon} size={21} /></span>
          </div>
        ))}
      </section>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '14px' }}>All Businesses</h3>
        <input
          type="text"
          placeholder="Search businesses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', width: '100%', maxWidth: '260px' }}
        />
      </div>

      {filteredBusinesses.length === 0 ? (
        <div className="table-empty">No businesses match your search.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Business</th>
                <th>Users</th>
                <th>Products</th>
                <th>Total Stock</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredBusinesses.map((b) => (
                <tr key={b.id}>
                  <td><strong>{capitalizeWords(b.name)}</strong></td>
                  <td>{b.user_count}</td>
                  <td>{b.product_count}</td>
                  <td>{b.total_stock_quantity}</td>
                  <td>{b.created_at ? new Date(b.created_at).toLocaleDateString() : '—'}</td>
                  <td><Link to={`/platform/businesses/${b.id}`}>View details</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Platform
