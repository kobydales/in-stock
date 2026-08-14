import { useState } from 'react'

function ProductForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    selling_price: '',
    cost_price: '',
    quantity: '',
    minimum_stock: '',
    description: '',
    status: 'active',
  })
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function validate() {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required'
    if (!formData.selling_price || Number(formData.selling_price) <= 0) {
      newErrors.selling_price = 'Selling price must be greater than 0'
    }
    if (!formData.cost_price || Number(formData.cost_price) < 0) {
      newErrors.cost_price = 'Cost price must be 0 or greater'
    }
    if (formData.quantity === '' || Number(formData.quantity) < 0) {
      newErrors.quantity = 'Quantity must be 0 or greater'
    }
    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
      <div>
        <label>Name</label>
        <input name="name" value={formData.name} onChange={handleChange} />
        {errors.name && <p style={{ color: 'red', fontSize: '0.85em' }}>{errors.name}</p>}
      </div>

      <div>
        <label>SKU</label>
        <input name="sku" value={formData.sku} onChange={handleChange} />
        {errors.sku && <p style={{ color: 'red', fontSize: '0.85em' }}>{errors.sku}</p>}
      </div>

      <div>
        <label>Selling Price</label>
        <input name="selling_price" type="number" step="0.01" value={formData.selling_price} onChange={handleChange} />
        {errors.selling_price && <p style={{ color: 'red', fontSize: '0.85em' }}>{errors.selling_price}</p>}
      </div>

      <div>
        <label>Cost Price</label>
        <input name="cost_price" type="number" step="0.01" value={formData.cost_price} onChange={handleChange} />
        {errors.cost_price && <p style={{ color: 'red', fontSize: '0.85em' }}>{errors.cost_price}</p>}
      </div>

      <div>
        <label>Quantity</label>
        <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} />
        {errors.quantity && <p style={{ color: 'red', fontSize: '0.85em' }}>{errors.quantity}</p>}
      </div>

      <div>
        <label>Minimum Stock</label>
        <input name="minimum_stock" type="number" value={formData.minimum_stock} onChange={handleChange} />
      </div>

      <div>
        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </div>

      <div>
        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="discontinued">Discontinued</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <button type="submit">Save Product</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

export default ProductForm