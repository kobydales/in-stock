import { useState, useEffect } from 'react'
import {
  fetchInventoryReport,
  fetchLowStockReport,
  fetchMostMovedReport,
  fetchStockMovementReport,
} from '../services/api'

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
  const [activeReport, setActiveReport] = useState('inventory')
  const [inventory, setInventory] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [mostMoved, setMostMoved] = useState([])
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    loadAll()
  }, [])

  function loadAll() {
    setLoading(true)
    Promise.all([
      fetchInventoryReport(),
      fetchLowStockReport(),
      fetchMostMovedReport(),
      fetchStockMovementReport(startDate, endDate),
    ])
      .then(([inv, low, moved, moves]) => {
        setInventory(inv)
        setLowStock(low)
        setMostMoved(moved)
        setMovements(moves)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  function applyDateFilter() {
    fetchStockMovementReport(startDate, endDate)
      .then(setMovements)
      .catch((err) => setError(err.message))
  }

  function setQuickRange(range) {
    const today = new Date()
    let start = new Date()

    if (range === 'today') {
      start = today
    } else if (range === 'week') {
      start.setDate(today.getDate() - 7)
    } else if (range === 'month') {
      start.setMonth(today.getMonth() - 1)
    }

    const startStr = start.toISOString().split('T')[0]
    const endStr = today.toISOString().split('T')[0]
    setStartDate(startStr)
    setEndDate(endStr)

    fetchStockMovementReport(startStr, endStr)
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
    <div>
      <h2>Reports</h2>

      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid #ddd', marginTop: '16px' }}>
        <button style={tabStyle('inventory')} onClick={() => setActiveReport('inventory')}>Inventory</button>
        <button style={tabStyle('movements')} onClick={() => setActiveReport('movements')}>Stock Movements</button>
        <button style={tabStyle('lowstock')} onClick={() => setActiveReport('lowstock')}>Low Stock</button>
        <button style={tabStyle('activity')} onClick={() => setActiveReport('activity')}>Product Activity</button>
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
                  <td style={{ padding: '8px' }}>{p.name}</td>
                  <td style={{ padding: '8px' }}>{p.category_name || '—'}</td>
                  <td style={{ padding: '8px' }}>{p.supplier_name || '—'}</td>
                  <td style={{ padding: '8px' }}>{p.quantity}</td>
                  <td style={{ padding: '8px' }}>{p.minimum_stock}</td>
                  <td style={{ padding: '8px' }}>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeReport === 'movements' && (
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setQuickRange('today')}>Today</button>
            <button onClick={() => setQuickRange('week')}>This Week</button>
            <button onClick={() => setQuickRange('month')}>This Month</button>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <button onClick={applyDateFilter}>Apply</button>
            <button onClick={() => downloadCSV('stock-movements-report.csv', toCSV(movements, [
              { key: 'created_at', label: 'Date' },
              { key: 'product_name', label: 'Product' },
              { key: 'movement_type', label: 'Type' },
              { key: 'quantity', label: 'Quantity' },
              { key: 'notes', label: 'Notes' },
            ]))}>
              Export CSV
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>Date</th>
                <th style={{ padding: '8px' }}>Product</th>
                <th style={{ padding: '8px' }}>Type</th>
                <th style={{ padding: '8px' }}>Quantity</th>
                <th style={{ padding: '8px' }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{new Date(m.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '8px' }}>{m.product_name}</td>
                  <td style={{ padding: '8px', color: m.movement_type === 'in' ? '#5cb85c' : '#d9534f' }}>
                    {m.movement_type === 'in' ? 'Stock In' : 'Stock Out'}
                  </td>
                  <td style={{ padding: '8px' }}>{m.quantity}</td>
                  <td style={{ padding: '8px' }}>{m.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Product</th>
                  <th style={{ padding: '8px' }}>Quantity</th>
                  <th style={{ padding: '8px' }}>Minimum</th>
                  <th style={{ padding: '8px' }}>Supplier</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px' }}>{p.name}</td>
                    <td style={{ padding: '8px' }}>{p.quantity}</td>
                    <td style={{ padding: '8px' }}>{p.minimum_stock}</td>
                    <td style={{ padding: '8px' }}>{p.supplier_name || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeReport === 'activity' && (
        <div style={{ marginTop: '16px' }}>
          <button onClick={() => downloadCSV('product-activity-report.csv', toCSV(mostMoved, [
            { key: 'name', label: 'Product' },
            { key: 'total_moved', label: 'Total Units Moved' },
            { key: 'movement_count', label: 'Number of Transactions' },
          ]))}>
            Export CSV
          </button>
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
                  <td style={{ padding: '8px' }}>{p.name}</td>
                  <td style={{ padding: '8px' }}>{p.total_moved}</td>
                  <td style={{ padding: '8px' }}>{p.movement_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Reports