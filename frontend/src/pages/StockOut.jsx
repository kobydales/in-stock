import { useState, useEffect } from 'react'
import { fetchProducts, stockOut } from '../services/api'

import CustomSelect from '../components/CustomSelect'
import AdinkraWatermark from '../components/AdinkraWatermark'
import NotePresets from '../components/NotePresets'
import { capitalizeWords } from '../utils/textFormat'
import { useOnlineStatus } from '../utils/useOnlineStatus'
import './Pages.css'

const STOCK_OUT_REASONS = ['Sold in store', 'Damaged', 'Expired', 'Returned to supplier', 'Internal use']

function StockOut() {
  const [products, setProducts] = useState([])
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const isOnline = useOnlineStatus()

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => setProducts([]))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!productId) {
      setError('Please select a product')
      return
    }
    if (!quantity || Number(quantity) <= 0) {
      setError('Quantity must be greater than 0')
      return
    }

    try {
      const result = await stockOut({
        product_id: Number(productId),
        quantity: Number(quantity),
        notes,
      })
      setSuccess(`Stock updated. New quantity: ${result.newQuantity}`)
      setProductId('')
      setQuantity('')
      setNotes('')
      fetchProducts().then(setProducts)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page-shell page-stockout">
      <AdinkraWatermark name="mpatapo" className="page-watermark stockout-watermark" />
      <AdinkraWatermark name="dwennimmen" className="page-watermark-secondary" />
      <h2>Stock Out</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', marginTop: '16px' }}>
        <div>
          <label>Product</label>
          <CustomSelect
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Select a product"
            options={[
              { value: '', label: 'Select a product' },
              ...products.map((p) => ({ value: p.id, label: `${capitalizeWords(p.name)} (current: ${p.quantity})` })),
            ]}
          />
        </div>

        <div>
          <label>Quantity Sold/Removed</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div>
          <label>Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(capitalizeWords(e.target.value))}
            placeholder="e.g. Sold in store, damaged, returned to supplier, etc."
          />
          <NotePresets options={STOCK_OUT_REASONS} activeValue={notes} onSelect={setNotes} />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <button type="submit" disabled={!isOnline} title={!isOnline ? "You're offline — stock changes are paused until you're back online" : undefined}>
          Submit
        </button>
        {!isOnline && (
          <p style={{ color: '#a54d3f', fontSize: '0.85em', marginTop: '-6px' }}>
            You're offline. This will be enabled again once your connection is back.
          </p>
        )}
      </form>
    </div>
  )
}

export default StockOut
