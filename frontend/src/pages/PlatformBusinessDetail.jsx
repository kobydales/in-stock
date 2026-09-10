import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchPlatformBusinessDetail } from '../services/api'
import { capitalizeWords } from '../utils/textFormat'
import AdinkraWatermark from '../components/AdinkraWatermark'
import '../pages/Pages.css'

function PlatformBusinessDetail() {
  const { id } = useParams()
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  function loadDetail() {
    setLoading(true)
    setDetail(null)
    fetchPlatformBusinessDetail(id)
      .then((data) => {
        setDetail(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadDetail()
  }, [id])

  if (loading) return <p>Loading business...</p>
  if (error) return <div className="dashboard-error"><strong>We couldn't load this business.</strong><span>{error}</span></div>
  const { business, users, stats, recentMovements } = detail

  return (
    <div className="page-shell page-platform">
      <AdinkraWatermark name="adinkrahene" className="page-watermark" />

      <Link to="/platform" style={{ fontSize: '12px' }}>&larr; Back to all businesses</Link>
      <h2 style={{ marginTop: '10px' }}>{capitalizeWords(business.name)}</h2>
      <p style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '-8px', marginBottom: '18px' }}>
        {business.created_at ? `Created ${new Date(business.created_at).toLocaleDateString()}` : ''}
      </p>

      <section className="stats-grid" style={{ marginBottom: '22px' }}>
        <div className="stat-card green">
          <div className="stat-copy"><span className="stat-label">Total Products</span><strong className="stat-value">{stats.totalProducts}</strong></div>
        </div>
        <div className="stat-card gold">
          <div className="stat-copy"><span className="stat-label">Total Stock</span><strong className="stat-value">{stats.totalQuantity}</strong></div>
        </div>
        <div className="stat-card amber">
          <div className="stat-copy"><span className="stat-label">Low Stock</span><strong className="stat-value">{stats.lowStock}</strong></div>
        </div>
        <div className="stat-card red">
          <div className="stat-copy"><span className="stat-label">Out of Stock</span><strong className="stat-value">{stats.outOfStock}</strong></div>
        </div>
      </section>

      <h3 style={{ fontSize: '14px', marginBottom: '10px' }}>Users</h3>
      {users.length === 0 ? (
        <div className="table-empty">No users found.</div>
      ) : (
        <div className="table-wrap" style={{ marginBottom: '22px' }}>
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{capitalizeWords(u.name)}</td>
                  <td>{u.email}</td>
                  <td>{u.role === 'admin' ? 'Administrator' : 'Staff'}</td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h3 style={{ fontSize: '14px', marginBottom: '10px' }}>Recent Stock Movements</h3>
      {recentMovements.length === 0 ? (
        <div className="table-empty">No stock movements yet.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Product</th><th>Type</th><th>Quantity</th><th>By</th><th>Date</th></tr></thead>
            <tbody>
              {recentMovements.map((m) => (
                <tr key={m.id}>
                  <td>{m.product_name}</td>
                  <td>{m.movement_type === 'in' ? 'Stock In' : 'Stock Out'}</td>
                  <td>{m.movement_type === 'in' ? '+' : '-'}{m.quantity}</td>
                  <td>{m.user_name || '—'}</td>
                  <td>{new Date(m.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default PlatformBusinessDetail
