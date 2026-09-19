import { useState, useEffect, useMemo } from 'react'
import { fetchDashboardStats, fetchRecentMovements, fetchMovementChart, fetchLowStockProducts, fetchProductVelocity } from '../services/api'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCurrentUser, isAdmin } from '../utils/auth'
import Icon from '../components/Icon'
import DateRangePicker from '../components/DateRangePicker'
import { DATE_RANGE_PRESETS } from '../utils/dateRange'
import AdinkraWatermark from '../components/AdinkraWatermark'
import AdinkraIcon from '../components/AdinkraIcon'
import { capitalizeWords } from '../utils/textFormat'
import './Dashboard.css'

const MotionLink = motion(Link)

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [movements, setMovements] = useState([])
  const [chartData, setChartData] = useState([])
  const [chartDays, setChartDays] = useState(7)
  const [chartLoading, setChartLoading] = useState(false)
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [fastestMoving, setFastestMoving] = useState([])
  const [slowestMoving, setSlowestMoving] = useState([])
  const userIsAdmin = isAdmin()
  const [error, setError] = useState(null)
  const user = getCurrentUser()
  const rawName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'
  const name = user?.name ? capitalizeWords(rawName) : rawName

  useEffect(() => {
    Promise.all([
      fetchDashboardStats(),
      fetchRecentMovements(),
      fetchMovementChart(chartDays),
      fetchLowStockProducts(),
    ])
      .then(([statsData, movementsData, chartDataRes, lowStockData]) => {
        setStats(statsData)
        setMovements(movementsData)
        setChartData(chartDataRes)
        setLowStockProducts(lowStockData)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!userIsAdmin) return
    Promise.all([fetchProductVelocity('most', 4), fetchProductVelocity('least', 4)])
      .then(([fastest, slowest]) => {
        setFastestMoving(fastest)
        setSlowestMoving(slowest)
      })
      .catch(() => {
        // Non-critical for the dashboard as a whole — the rest of the page
        // still works if this one section fails to load.
      })
  }, [userIsAdmin])

  function handleChartRangeChange(days) {
    setChartDays(days)
    setChartLoading(true)
    fetchMovementChart(days)
      .then((data) => {
        setChartData(data)
        setChartLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setChartLoading(false)
      })
  }

  const chartBars = useMemo(() => {
    if (!chartData.length) return []
    const max = Math.max(...chartData.map((row) => Number(row.total) || 0), 1)
    return chartData.map((row, i) => ({
      ...row,
      height: Math.max(8, ((Number(row.total) || 0) / max) * 130),
      symbol: row.movement_type === 'in' ? (i % 2 === 0 ? 'nyameDua' : 'mpatapo') : (i % 2 === 0 ? 'sankofa' : 'dwennimmen'),
    }))
  }, [chartData])

  if (loading) {
    return <div className="dashboard-loading"><div className="loading-spinner" /> Loading your dashboard...</div>
  }

  if (error) {
    return <div className="dashboard-error"><strong>We couldn't load the dashboard.</strong><span>{error}</span></div>
  }

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, detail: 'Items in your catalogue', icon: 'package', tone: 'green', link: '/products' },
    { label: 'Total Stock', value: stats.totalQuantity, detail: 'Units currently available', icon: 'box', tone: 'gold' },
    { label: 'Out of Stock', value: stats.outOfStock, detail: 'Currently unavailable', icon: 'package', tone: 'red', link: '/low-stock' },
  ]

  return (
    <div className="dashboard-page">
      <AdinkraWatermark name="gyeNyame" className="dashboard-watermark dashboard-watermark-one" />
      <AdinkraWatermark name="sankofa" className="dashboard-watermark dashboard-watermark-two" />
      <section className="dashboard-intro">
        <div>
          <p className="eyebrow">INVENTORY OVERVIEW</p>
          <h2>Akwaba, {name} <span aria-hidden="true">👋</span></h2>
          <p>Here&apos;s what&apos;s happening with your inventory today.</p>
        </div>
        <div className="quick-actions" data-tour="quick-actions">
          <MotionLink
            to="/stock-in"
            className="quick-action quick-action-in"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <span className="quick-action-icon"><AdinkraIcon name="nyameDua" /></span>
            <span><strong>Stock In</strong><small>Add stock</small></span>
          </MotionLink>
          <MotionLink
            to="/stock-out"
            className="quick-action quick-action-out"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <span className="quick-action-icon"><AdinkraIcon name="sankofa" /></span>
            <span><strong>Stock Out</strong><small>Remove stock</small></span>
          </MotionLink>
          <MotionLink
            to="/products"
            className="quick-action quick-action-product"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <span className="quick-action-icon"><AdinkraIcon name="mpatapo" /></span>
            <span><strong>Add Product</strong><small>New item</small></span>
          </MotionLink>
        </div>
      </section>

      <section className="stats-grid" data-tour="stats-grid">
        {statCards.map((card, index) => {
          const content = (
            <motion.div
              className={`stat-card ${card.tone}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.08, ease: 'easeOut' }}
              whileHover={{ y: -3 }}
            >
              <div className="stat-copy">
                <span className="stat-label">{card.label}</span>
                <strong className="stat-value">{card.value}</strong>
                <span className="stat-detail">{card.detail}</span>
              </div>
              <span className="stat-icon"><Icon name={card.icon} size={21} /></span>
            </motion.div>
          )
          return card.link ? <Link key={card.label} to={card.link} className="stat-link">{content}</Link> : <div key={card.label}>{content}</div>
        })}
      </section>

      <section className="dashboard-main-grid">
        <div className="glass-panel chart-panel">
          <div className="panel-heading">
            <div><h3>Stock Movement</h3><p>Activity over the last {DATE_RANGE_PRESETS.find((p) => p.value === chartDays)?.label.toLowerCase()}</p></div>
          </div>
          <DateRangePicker value={chartDays} onChange={handleChartRangeChange} />
          <div style={{ marginTop: '14px' }}>
          {chartLoading ? (
            <div className="empty-chart">Loading chart...</div>
          ) : chartBars.length === 0 ? (
            <div className="empty-chart">No stock movement in this period.</div>
          ) : (
            <div className="bar-chart" aria-label="Stock movement chart">
              <div className="chart-grid-lines"><span /><span /><span /><span /></div>
              {chartBars.map((row, i) => (
                <div className="bar-column" key={`${row.movement_type}-${i}`}>
                  <motion.div
                    className={`bar ${row.movement_type === 'in' ? 'in' : 'out'}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${row.height}px` }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
                    title={`${row.movement_type}: ${row.total}`}
                  >
                    <AdinkraWatermark name={row.symbol} className="bar-watermark" />
                  </motion.div>
                  <span>{row.movement_type === 'in' ? 'In' : 'Out'}</span>
                  <small>{row.total}</small>
                </div>
              ))}
            </div>
          )}
          </div>
          <div className="chart-legend"><span><i className="legend-dot in" />Stock In</span><span><i className="legend-dot out" />Stock Out</span></div>
        </div>

        <div className="glass-panel low-stock-panel">
          <div className="panel-heading">
            <div><h3>Low Stock</h3><p>Products that need attention</p></div>
            <Link to="/low-stock" className="view-link">View all</Link>
          </div>
          <div className="stock-list">
            {lowStockProducts.length === 0 ? (
              <div className="mini-empty"><span>✓</span><p>Everything looks healthy.</p></div>
            ) : (
              lowStockProducts.slice(0, 5).map((product) => (
                <div className="stock-list-item" key={product.id}>
                  <span className="product-status-dot" aria-hidden="true" />
                  <div className="product-info"><strong>{capitalizeWords(product.name)}</strong>{product.sku && <small>{product.sku}</small>}</div>
                  <span className="stock-count">{product.quantity} left</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {userIsAdmin && (fastestMoving.length > 0 || slowestMoving.length > 0) && (
        <Link to="/reports?tab=activity" className="glass-panel dashboard-velocity-panel dashboard-velocity-card">
          <div className="panel-heading">
            <div><h3>Product Movement</h3><p>Fastest &amp; slowest sellers (Stock Out)</p></div>
            <Icon name="chevron" size={16} className="dashboard-velocity-arrow" />
          </div>
          <div className="dashboard-velocity-summary">
            {fastestMoving[0] && (
              <div className="dashboard-velocity-row">
                <span className="dashboard-velocity-tag fast">Fastest</span>
                <strong>{capitalizeWords(fastestMoving[0].name)}</strong>
                <span className="dashboard-velocity-count">{fastestMoving[0].totalOut} sold</span>
              </div>
            )}
            {slowestMoving[0] && (
              <div className="dashboard-velocity-row">
                <span className="dashboard-velocity-tag slow">Slowest</span>
                <strong>{capitalizeWords(slowestMoving[0].name)}</strong>
                <span className="dashboard-velocity-count">{slowestMoving[0].totalOut} sold</span>
              </div>
            )}
          </div>
        </Link>
      )}

      <section className="dashboard-bottom-grid">
        <div className="glass-panel transactions-panel">
          <div className="panel-heading">
            <div><h3>Recent Transactions</h3><p>The latest inventory activity</p></div>
            <Link to="/history" className="view-link">View history</Link>
          </div>
          {movements.length === 0 ? (
            <div className="table-empty">No recent transactions.</div>
          ) : (
            <div className="transaction-table-wrap">
              <table className="transaction-table">
                <thead><tr><th>Product</th><th>Type</th><th>Quantity</th><th>Date</th></tr></thead>
                <tbody>
                  {movements.slice(0, 6).map((m) => (
                    <tr key={m.id}>
                      <td><strong>{m.product_name}</strong></td>
                      <td><span className={`movement-badge ${m.movement_type === 'in' ? 'stock-in' : 'stock-out'}`}>{m.movement_type === 'in' ? 'Stock In' : 'Stock Out'}</span></td>
                      <td className={`quantity ${m.movement_type === 'in' ? 'positive' : 'negative'}`}>{m.movement_type === 'in' ? '+' : '-'}{m.quantity}</td>
                      <td className="date-cell">{new Date(m.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Dashboard