import { useState } from 'react'
import { fetchCategories, fetchSuppliers, createSupplier } from '../services/api'

function CategoryForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    status: initialData?.status || 'active',
  })
  const [errors, setErrors] = useState({})
  const [newSupplierName, setNewSupplierName] = useState('')
  const [creatingSupplier, setCreatingSupplier] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function validate() {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    return newErrors
  }

  async function handleSubmit(e) {
  e.preventDefault()
  const validationErrors = validate()
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors)
    return
  }

  let supplierId = formData.supplier_id === '' ? null : Number(formData.supplier_id)

  if (creatingSupplier) {
    if (!newSupplierName.trim()) {
      setErrors({ ...errors, supplier: 'Supplier name is required' })
      return
    }
    try {
      const newSupplier = await createSupplier({ name: newSupplierName })
      supplierId = newSupplier.id
    } catch (err) {
      setErrors({ ...errors, supplier: 'Failed to create supplier' })
      return
    }
  }

  const cleanedData = {
    ...formData,
    sku: formData.sku.trim() === '' ? null : formData.sku,
    category_id: formData.category_id === '' ? null : Number(formData.category_id),
    supplier_id: supplierId,
  }
  onSubmit(cleanedData)
}

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
      <div>
        <label>Name</label>
        <input name="name" value={formData.name} onChange={handleChange} />
        {errors.name && <p style={{ color: 'red', fontSize: '0.85em' }}>{errors.name}</p>}
      </div>

      <div>
        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </div>

      <div>
        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <button type="submit">Save Category</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>

      <div>
  <label>Supplier</label>
  <select
    name="supplier_id"
    value={creatingSupplier ? '__new__' : formData.supplier_id}
    onChange={(e) => {
      if (e.target.value === '__new__') {
        setCreatingSupplier(true)
      } else {
        setCreatingSupplier(false)
        handleChange(e)
      }
    }}
    >
    <option value="">-- No supplier --</option>
    {suppliers.map((sup) => (
      <option key={sup.id} value={sup.id}>{sup.name}</option>
    ))}
    <option value="__new__">+ Add new supplier...</option>
   </select>

    {creatingSupplier && (
       <div style={{ marginTop: '6px', display: 'flex', gap: '6px' }}>
      <input
        type="text"
        placeholder="New supplier name"
        value={newSupplierName}
        onChange={(e) => setNewSupplierName(e.target.value)}
      />
      <button type="button" onClick={() => { setCreatingSupplier(false); setNewSupplierName('') }}>
        Cancel
      </button>
    </div>
    )}
    </div>

    </form>
  )
}

export default CategoryForm