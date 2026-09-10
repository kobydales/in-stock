import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  fetchInventoryReport,
  fetchLowStockReport,
  fetchMostMovedReport,
  fetchProductVelocity,
  fetchStockMovementReport,
  fetchValuationReport,
} from '../services/api'

import AdinkraWatermark from '../components/AdinkraWatermark'
import DateRangePicker from '../components/DateRangePicker'
import { rangeFromDays } from '../utils/dateRange'
import { capitalizeWords } from '../utils/textFormat'
import './Pages.css'
import './Dashboard.css'

function toCSV(rows, columns) {
  const header = columns.map((c) => c.label).join(',')
  const body = rows
    .map((row) => columns.map((c) => `"${row[c.key] ?? ''}"`).join(','))
    .join('\n')
  return `${header}\n${body}`
}

function downloadCSV(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function Reports() {
  const [searchParams] = useSearchParams()
  const validTabs = ['inventory', 'movements', 'lowstock', 'activity', 'valuation']
  const initialTab = validTabs.includes(searchParams.get('tab')) ? searchParams.get('tab') : 'inventory'
  const [activeReport, setActiveReport] = useState(initialTab)
  const [inventory, setInventory] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [mostMoved, setMostMoved] = useState([])
  const [fastestMoving, setFastestMoving] = useState([])
  const [slowestMoving, setSlowestMoving] = useState([])
  const [movements, setMovements] = useState([])
  const [valuation, setValuation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [rangeDays, setRangeDays] = useState(7)
  const [customDate, setCustomDate] = useState(null)

  useEffect(() => {
    loadAll()
  }, [])

  function loadAll() {
    setLoading(true)
    const { startDate, endDate } = rangeFromDays(rangeDays)
    Promise.all([
      fetchInventoryReport(),
      fetchLowStockReport(),
      fetchMostMovedReport(),
      fetchProductVelocity('most', 5),
      fetchProductVelocity('least', 5),
      fetchStockMovementReport(startDate, endDate),
      fetchValuationReport(),
    ])
      .then(([inv, low, moved, fastest, slowest, moves, val]) => {
        setInventory(inv)
        setLowStock(low)
        setMostMoved(moved)
        setFastestMoving(fastest)
        setSlowestMoving(slowest)
        setMovements(moves)
        setValuation(val)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  function handleRangeChange(days) {
    setRangeDays(days)
    setCustomDate(null)
    const { startDate, endDate } = rangeFromDays(days)
    fetchStockMovementReport(startDate, endDate)
      .then(setMovements)
      .catch((err) => setError(err.message))
  }

  function handleCustomDateChange(date) {
    setCustomDate(date)
    if (!date) return
    fetchStockMovementReport(date, date)
      .then(setMovements)
      .catch((err) => setError(err.message))
  }

  if (loading) return <p>Loading reports...</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>

  const tabStyle = (tab) => ({
    padding: '8px 16px',
    border: 'none',
    borderBottom: activeReport === tab ? '2px solid #333' : '2px solid transparent',
    background: 'none',
    cursor: 'pointer',
    fontWeight: activeReport === tab ? 'bold' : 'normal',
  })

  return (
    <div className="page-shell page-reports">
      <AdinkraWatermark name="gyeNyame" className="page-watermark reports-watermark" />
      <AdinkraWatermark name="adinkrahene" className="page-watermark-secondary" />
      <h2>Reports</h2>

      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid #ddd', marginTop: '16px' }}>
        <button style={tabStyle('inventory')} onClick={() => setActiveReport('inventory')}>Inventory</button>
        <button style={tabStyle('movements')} onClick={() => setActiveReport('movements')}>Stock Movements</button>
        <button style={tabStyle('lowstock')} onClick={() => setActiveReport('lowstock')}>Low Stock</button>
        <button style={tabStyle('activity')} onClick={() => setActiveReport('activity')}>Product Activity</button>
        <button style={tabStyle('valuation')} onClick={() => setActiveReport('valuation')}>Valuation</button>
      </div>

      {activeReport === 'inventory' && (
        <div style={{ marginTop: '16px' }}>
          <button onClick={() => downloadCSV('inventory-report.csv', toCSV(inventory, [
            { key: 'name', label: 'Name' },
            { key: 'sku', label: 'SKU' },
            { key: 'category_name', label: 'Category' },
            { key: 'supplier_name', label: 'Supplier' },
            { key: 'quantity', label: 'Quantity' },
            { key: 'minimum_stock', label: 'Minimum Stock' },
            { key: 'status', label: 'Status' },
          ]))}>
            Export CSV
          </button>
          <div className="compact-table-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>Product</th>
                <th style={{ padding: '8px' }}>Category</th>
                <th style={{ padding: '8px' }}>Supplier</th>
                <th style={{ padding: '8px' }}>Quantity</th>
                <th style={{ padding: '8px' }}>Minimum</th>
                <th style={{ padding: '8px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td data-label="Product" style={{ padding: '8px' }}>{capitalizeWords(p.name)}</td>
                  <td data-label="Category" style={{ padding: '8px' }}>{p.category_name ? capitalizeWords(p.category_name) : '—'}</td>
                  <td data-label="Supplier" style={{ padding: '8px' }}>{p.supplier_name ? capitalizeWords(p.supplier_name) : '—'}</td>
                  <td data-label="Quantity" style={{ padding: '8px' }}>{p.quantity}</td>
                  <td data-label="Minimum" style={{ padding: '8px' }}>{p.minimum_stock}</td>
                  <td data-label="Status" style={{ padding: '8px' }}>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {activeReport === 'movements' && (
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <DateRangePicker
              value={rangeDays}
              onChange={handleRangeChange}
              allowCustomDate
              customDate={customDate}
              onCustomDateChange={handleCustomDateChange}
            />
            <button onClick={() => downloadCSV('stock-movements-report.csv', toCSV(movements, [
              { key: 'created_at', label: 'Date' },
              { key: 'product_name', label: 'Product' },
              { key: 'movement_type', label: 'Type' },
              { key: 'quantity', label: 'Quantity' },
              { key: 'notes', label: 'Notes' },
              { key: 'user_name', label: 'Staff' },
            ]))}>
              Export CSV
            </button>
          </div>
          <div className="compact-table-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>Date</th>
                <th style={{ padding: '8px' }}>Product</th>
                <th style={{ padding: '8px' }}>Type</th>
                <th style={{ padding: '8px' }}>Quantity</th>
                <th style={{ padding: '8px' }} className="hide-on-compact">Notes</th>
                <th style={{ padding: '8px' }}>Staff</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td data-label="Date" style={{ padding: '8px' }}>{new Date(m.created_at).toLocaleDateString()}</td>
                  <td data-label="Product" style={{ padding: '8px' }}>{capitalizeWords(m.product_name)}</td>
                  <td data-label="Type" style={{ padding: '8px', color: m.movement_type === 'in' ? '#5cb85c' : '#d9534f' }}>
                    {m.movement_type === 'in' ? 'Stock In' : 'Stock Out'}
                  </td>
                  <td data-label="Quantity" style={{ padding: '8px' }}>{m.quantity}</td>
                  <td data-label="Notes" style={{ padding: '8px' }} className="hide-on-compact">{m.notes ? capitalizeWords(m.notes) : '—'}</td>
                  <td data-label="Staff" style={{ padding: '8px' }}>{m.user_name ? capitalizeWords(m.user_name) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {activeReport === 'lowstock' && (
        <div style={{ marginTop: '16px' }}>
          <button onClick={() => downloadCSV('low-stock-report.csv', toCSV(lowStock, [
            { key: 'name', label: 'Product' },
            { key: 'quantity', label: 'Quantity' },
            { key: 'minimum_stock', label: 'Minimum Stock' },
            { key: 'supplier_name', label: 'Supplier' },
          ]))}>
            Export CSV
          </button>
          {lowStock.length === 0 ? (
            <p style={{ marginTop: '12px' }}>No products are currently low on stock.</p>
          ) : (
            <div className="compact-table-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Product</th>
                  <th style={{ padding: '8px' }}>Quantity</th>
                  <th style={{ padding: '8px' }}>Minimum</th>
                  <th style={{ padding: '8px' }} className="hide-on-compact">Supplier</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                    <td data-label="Product" style={{ padding: '8px' }}>{capitalizeWords(p.name)}</td>
                    <td data-label="Quantity" style={{ padding: '8px' }}>{p.quantity}</td>
                    <td data-label="Minimum" style={{ padding: '8px' }}>{p.minimum_stock}</td>
                    <td data-label="Supplier" style={{ padding: '8px' }} className="hide-on-compact">{p.supplier_name ? capitalizeWords(p.supplier_name) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      )}

      {activeReport === 'activity' && (
        <div style={{ marginTop: '16px' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '4px' }}>Product Velocity (Stock-Out)</h3>
          <p style={{ color: 'var(--muted)', fontSize: '11px', marginTop: 0, marginBottom: '14px' }}>
            Based on units sold/removed via Stock Out — shows what moves fastest and slowest off the shelf.
          </p>

          <div className="velocity-charts">
            <div className="glass-panel">
              <div className="panel-heading"><div><h3>Fastest Moving</h3><p>Top 5 by units sold</p></div></div>
              {fastestMoving.length === 0 ? (
                <div className="empty-chart">No stock-out activity yet.</div>
              ) : (
                <div className="bar-chart velocity-bar-chart">
                  <div className="chart-grid-lines"><span /><span /><span /><span /></div>
                  {fastestMoving.map((p) => {
                    const max = Math.max(...fastestMoving.map((x) => x.totalOut), 1)
                    const height = Math.max((p.totalOut / max) * 140, 6)
                    return (
                      <div className="bar-column" key={p.id}>
                        <div className="bar out" style={{ height: `${height}px` }} title={`${p.name}: ${p.totalOut} sold`} />
                        <span title={capitalizeWords(p.name)}>{capitalizeWords(p.name).slice(0, 10)}</span>
                        <small>{p.totalOut}</small>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="glass-panel">
              <div className="panel-heading"><div><h3>Slowest Moving</h3><p>Bottom 5 by units sold</p></div></div>
              {slowestMoving.length === 0 ? (
                <div className="empty-chart">No products yet.</div>
              ) : (
                <div className="bar-chart velocity-bar-chart">
                  <div className="chart-grid-lines"><span /><span /><span /><span /></div>
                  {slowestMoving.map((p) => {
                    const max = Math.max(...fastestMoving.map((x) => x.totalOut), 1)
                    const height = Math.max((p.totalOut / max) * 140, 6)
                    return (
                      <div className="bar-column" key={p.id}>
                        <div className="bar slow" style={{ height: `${height}px` }} title={`${p.name}: ${p.totalOut} sold`} />
                        <span title={capitalizeWords(p.name)}>{capitalizeWords(p.name).slice(0, 10)}</span>
                        <small>{p.totalOut}</small>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <h3 style={{ fontSize: '14px', marginTop: '22px', marginBottom: '10px' }}>All Product Activity</h3>
          <button onClick={() => downloadCSV('product-activity-report.csv', toCSV(mostMoved, [
            { key: 'name', label: 'Product' },
            { key: 'total_moved', label: 'Total Units Moved' },
            { key: 'movement_count', label: 'Number of Transactions' },
          ]))}>
            Export CSV
          </button>
          <div className="compact-table-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>Product</th>
                <th style={{ padding: '8px' }}>Total Units Moved</th>
                <th style={{ padding: '8px' }}>Transactions</th>
              </tr>
            </thead>
            <tbody>
              {mostMoved.map((p, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                  <td data-label="Product" style={{ padding: '8px' }}>{capitalizeWords(p.name)}</td>
                  <td data-label="Total Units Moved" style={{ padding: '8px' }}>{p.total_moved}</td>
                  <td data-label="Transactions" style={{ padding: '8px' }}>{p.movement_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {activeReport === 'valuation' && valuation && (
        <div style={{ marginTop: '16px' }}>
          <div className="valuation-grid">
            <div className="valuation-card">
              <span>Total Cost Value</span>
              <strong>₵{valuation.totalCostValue.toFixed(2)}</strong>
              <small>What your current stock cost you</small>
            </div>
            <div className="valuation-card">
              <span>Total Retail Value</span>
              <strong>₵{valuation.totalRetailValue.toFixed(2)}</strong>
              <small>What your current stock would sell for</small>
            </div>
            <div className="valuation-card">
              <span>Potential Profit</span>
              <strong>₵{valuation.potentialProfit.toFixed(2)}</strong>
              <small>Retail value minus cost value, if everything sells</small>
            </div>
            <div className="valuation-card">
              <span>Restock Cost</span>
              <strong>₵{valuation.restockCost.toFixed(2)}</strong>
              <small>Cost to bring low/out-of-stock items back to minimum</small>
            </div>
            <div className="valuation-card">
              <span>Estimated Revenue (Stock Out)</span>
              <strong>₵{valuation.revenueEstimate.toFixed(2)}</strong>
              <small>Based on all-time stock-out movements at current prices</small>
            </div>
            <div className="valuation-card">
              <span>Estimated Profit (Stock Out)</span>
              <strong>₵{valuation.realizedProfitEstimate.toFixed(2)}</strong>
              <small>Estimate only — uses today's prices, not the price at time of sale</small>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


export default Reports