import { useState, useEffect } from 'react'
import { fetchDashboardStats, fetchRecentMovements, fetchMovementChart } from '../services/api'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [movements, setMovements] = useState([])
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([fetchDashboardStats(), fetchRecentMovements(), fetchMovementChart()])
      .then(([statsData, movementsData, chartDataRes]) => {
        setStats(statsData)
        setMovements(movementsData)
        setChartData(chartDataRes)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading dashboard...</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>

  const cardStyle = {
    flex: 1,
    padding: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    textAlign: 'center',
  }

  return (
    <div>
      <h2>Dashboard</h2>

      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <div style={cardStyle}>
          <div style={{ fontSize: '0.85em', color: '#666' }}>Total Products</div>
          <div style={{ fontSize: '1.8em', fontWeight: 'bold' }}>{stats.totalProducts}</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: '0.85em', color: '#666' }}>Total Stock</div>
          <div style={{ fontSize: '1.8em', fontWeight: 'bold' }}>{stats.totalQuantity}</div>
        </div>
        <div style={{ ...cardStyle, borderColor: stats.lowStock > 0 ? '#e0a800' : '#ddd' }}>
          <div style={{ fontSize: '0.85em', color: '#666' }}>Low Stock</div>
          <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: stats.lowStock > 0 ? '#e0a800' : 'inherit' }}>
            {stats.lowStock}
          </div>
        </div>
        <div style={{ ...cardStyle, borderColor: stats.outOfStock > 0 ? '#d9534f' : '#ddd' }}>
          <div style={{ fontSize: '0.85em', color: '#666' }}>Out of Stock</div>
          <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: stats.outOfStock > 0 ? '#d9534f' : 'inherit' }}>
            {stats.outOfStock}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <h3>Stock Movement (Last 7 Days)</h3>
        {chartData.length === 0 ? (
          <p>No stock movement in the last 7 days.</p>
        ) : (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '150px', marginTop: '12px' }}>
            {chartData.map((row, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '40px',
                    height: `${Math.min(Number(row.total), 150)}px`,
                    backgroundColor: row.movement_type === 'in' ? '#5cb85c' : '#d9534f',
                    borderRadius: '4px 4px 0 0',
                  }}
                  title={`${row.movement_type}: ${row.total}`}
                />
                <div style={{ fontSize: '0.75em', marginTop: '4px' }}>
                  {row.movement_type} ({row.total})
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '24px' }}>
        <h3>Recent Transactions</h3>
        {movements.length === 0 ? (
          <p>No recent transactions.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>Product</th>
                <th style={{ padding: '8px' }}>Type</th>
                <th style={{ padding: '8px' }}>Quantity</th>
                <th style={{ padding: '8px' }}>Notes</th>
                <th style={{ padding: '8px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{m.product_name}</td>
                  <td style={{ padding: '8px', color: m.movement_type === 'in' ? '#5cb85c' : '#d9534f' }}>
                    {m.movement_type === 'in' ? 'Stock In' : 'Stock Out'}
                  </td>
                  <td style={{ padding: '8px' }}>{m.quantity}</td>
                  <td style={{ padding: '8px' }}>{m.notes || '—'}</td>
                  <td style={{ padding: '8px' }}>{new Date(m.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Dashboard