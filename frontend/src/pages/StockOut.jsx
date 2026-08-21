import { useState, useEffect } from 'react'
import { fetchProducts, stockOut } from '../services/api'

function StockOut() {
  const [products, setProducts] = useState([])
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

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
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Stock Out</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', marginTop: '16px' }}>
        <div>
          <label>Product</label>
          <select value={productId} onChange={(e) => setProductId(e.target.value)}>
            <option value="">-- Select a product --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name} (current: {p.quantity})</option>
            ))}
          </select>
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
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Sold in store, damaged, returned to supplier, etc."
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default StockOut
