import { useState, useEffect } from 'react'
import { fetchAllMovements, fetchProducts } from '../services/api'

import CustomSelect from '../components/CustomSelect'
import DateRangePicker from '../components/DateRangePicker'
import AdinkraWatermark from '../components/AdinkraWatermark'
import { rangeFromDays } from '../utils/dateRange'
import { capitalizeWords } from '../utils/textFormat'
import { isAdmin } from '../utils/auth'
import './Pages.css'

function History() {
  const [movements, setMovements] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const userIsAdmin = isAdmin()

  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [productFilter, setProductFilter] = useState('')
  const [rangeDays, setRangeDays] = useState(30)
  const [customDate, setCustomDate] = useState(null)

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

  const { startDate, endDate } = customDate ? { startDate: customDate, endDate: customDate } : rangeFromDays(rangeDays)

  const filteredMovements = movements.filter((m) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      m.product_name.toLowerCase().includes(term) ||
      (m.notes && m.notes.toLowerCase().includes(term))

    const matchesType = typeFilter === '' || m.movement_type === typeFilter
    const matchesProduct = productFilter === '' || m.product_id === Number(productFilter)

    const movementDate = new Date(m.created_at)
    const matchesRange = movementDate >= new Date(startDate) && movementDate <= new Date(endDate + 'T23:59:59')

    return matchesSearch && matchesType && matchesProduct && matchesRange
  })

  if (loading) return <p>Loading history...</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>

  return (
    <div className="page-shell page-history">
      <AdinkraWatermark name="sankofa" className="page-watermark history-watermark" />
      <AdinkraWatermark name="mpatapo" className="page-watermark-secondary" />
      <h2>Inventory History</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
        <input
          type="text"
          placeholder="Search product or notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', width: '220px' }}
        />

        <CustomSelect
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={[
            { value: '', label: 'All Types' },
            { value: 'in', label: 'Stock In' },
            { value: 'out', label: 'Stock Out' },
          ]}
          className="filter-select"
        />

        <CustomSelect
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          options={[
            { value: '', label: 'All Products' },
            ...products.map((p) => ({ value: p.id, label: capitalizeWords(p.name) })),
          ]}
          className="filter-select"
        />
      </div>

      <div style={{ marginTop: '10px' }}>
        <DateRangePicker
          value={rangeDays}
          onChange={setRangeDays}
          allowCustomDate
          customDate={customDate}
          onCustomDateChange={setCustomDate}
        />
      </div>

      {filteredMovements.length === 0 ? (
        <p style={{ marginTop: '16px' }}>No movements match your filters.</p>
      ) : (
        <div className="compact-table-wrap">
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Date</th>
              <th style={{ padding: '8px' }}>Product</th>
              <th style={{ padding: '8px' }}>Type</th>
              <th style={{ padding: '8px' }}>Quantity</th>
              <th style={{ padding: '8px' }} className="hide-on-compact">Notes</th>
              {userIsAdmin && <th style={{ padding: '8px' }}>Staff</th>}
            </tr>
          </thead>
          <tbody>
            {filteredMovements.map((m) => (
              <tr key={m.id} style={{ borderBottom: '1px solid #eee' }}>
                <td data-label="Date" style={{ padding: '8px' }}>{new Date(m.created_at).toLocaleString()}</td>
                <td data-label="Product" style={{ padding: '8px' }}>{capitalizeWords(m.product_name)}</td>
                <td data-label="Type" style={{ padding: '8px', color: m.movement_type === 'in' ? '#5cb85c' : '#d9534f' }}>
                  {m.movement_type === 'in' ? 'Stock In' : 'Stock Out'}
                </td>
                <td data-label="Quantity" style={{ padding: '8px' }}>{m.quantity}</td>
                <td data-label="Notes" style={{ padding: '8px' }} className="hide-on-compact">{m.notes ? capitalizeWords(m.notes) : '—'}</td>
                {userIsAdmin && <td data-label="Staff" style={{ padding: '8px' }}>{m.user_name ? capitalizeWords(m.user_name) : '—'}</td>}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  )
}

export default History