import { useState, useEffect } from 'react'
import { fetchCategories, fetchSuppliers, createCategory, createSupplier } from '../services/api'
import CustomSelect from './CustomSelect'
import { capitalizeWords } from '../utils/textFormat'

function ProductForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    name: initialData?.name ? capitalizeWords(initialData.name) : '',
    sku: initialData?.sku || '',
    category_id: initialData?.category_id || '',
    supplier_id: initialData?.supplier_id || '',
    selling_price: initialData?.selling_price || '',
    cost_price: initialData?.cost_price || '',
    quantity: initialData?.quantity || '',
    minimum_stock: initialData?.minimum_stock || '',
    description: initialData?.description ? capitalizeWords(initialData.description) : '',
    status: initialData?.status || 'active',
  })

  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [errors, setErrors] = useState({})

  const [creatingCategory, setCreatingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  const [creatingSupplier, setCreatingSupplier] = useState(false)
  const [newSupplierName, setNewSupplierName] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const [categoriesData, suppliersData] = await Promise.all([
          fetchCategories(),
          fetchSuppliers(),
        ])
        setCategories(categoriesData)
        setSuppliers(suppliersData)
      } catch (error) {
        console.error('Failed to load categories or suppliers:', error)
      }
    }
    loadData()
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    const shouldFormat = ['name', 'description'].includes(name)
    const nextValue = shouldFormat ? capitalizeWords(value) : value
    setFormData((prev) => ({ ...prev, [name]: nextValue }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  function validate() {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (formData.selling_price === '' || Number(formData.selling_price) <= 0) {
      newErrors.selling_price = 'Selling price must be greater than 0'
    }
    if (formData.cost_price === '' || Number(formData.cost_price) < 0) {
      newErrors.cost_price = 'Cost price must be 0 or greater'
    }
    if (formData.quantity === '' || Number(formData.quantity) < 0) {
      newErrors.quantity = 'Quantity must be 0 or greater'
    }
    if (formData.minimum_stock !== '' && Number(formData.minimum_stock) < 0) {
      newErrors.minimum_stock = 'Minimum stock must be 0 or greater'
    }
    if (creatingCategory && !newCategoryName.trim()) {
      newErrors.category = 'Category name is required'
    }
    if (creatingSupplier && !newSupplierName.trim()) {
      newErrors.supplier = 'Supplier name is required'
    }
    return newErrors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    let categoryId = formData.category_id === '' ? null : Number(formData.category_id)
    let supplierId = formData.supplier_id === '' ? null : Number(formData.supplier_id)

    if (creatingCategory) {
      try {
        const newCategory = await createCategory({ name: capitalizeWords(newCategoryName.trim()), status: 'active' })
        categoryId = newCategory.id
        setCategories((prev) => [...prev, newCategory])
      } catch (err) {
        const message = err.message.includes('Admin access required')
          ? 'Only admins can create new categories'
          : 'Failed to create category'
        setErrors({ ...errors, category: message })
        return
      }
    }

    if (creatingSupplier) {
      try {
        const newSupplier = await createSupplier({ name: capitalizeWords(newSupplierName.trim()) })
        supplierId = newSupplier.id
        setSuppliers((prev) => [...prev, newSupplier])
      } catch (err) {
        const message = err.message.includes('Admin access required')
          ? 'Only admins can create new suppliers'
          : 'Failed to create supplier'
        setErrors({ ...errors, supplier: message })
        return
      }
    }

    try {
      const cleanedData = {
        ...formData,
        sku: formData.sku.trim() === '' ? null : formData.sku.trim(),
        category_id: categoryId,
        supplier_id: supplierId,
        selling_price: Number(formData.selling_price),
        cost_price: Number(formData.cost_price),
        quantity: Number(formData.quantity),
        minimum_stock: formData.minimum_stock === '' ? 0 : Number(formData.minimum_stock),
        description: formData.description.trim() === '' ? null : formData.description.trim(),
      }

      await onSubmit(cleanedData)
    } catch (error) {
      console.error('Failed to save product:', error)
      setErrors({ submit: 'Failed to save product. Please try again.' })
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
      <div>
        <label>Name</label>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Product name" />
        {errors.name && <p style={{ color: 'red', fontSize: '0.85em' }}>{errors.name}</p>}
      </div>

      <div>
        <label>SKU (optional)</label>
        <input name="sku" value={formData.sku} onChange={handleChange} placeholder="e.g. PROD-001" />
      </div>

      <div>
        <label>Category</label>
        <CustomSelect
          name="category_id"
          value={creatingCategory ? '__new__' : formData.category_id}
          placeholder="No category"
          onChange={(e) => {
            const value = e.target.value
            if (value === '__new__') {
              setCreatingCategory(true)
              setFormData((prev) => ({ ...prev, category_id: '' }))
            } else {
              setCreatingCategory(false)
              setNewCategoryName('')
              setFormData((prev) => ({ ...prev, category_id: value }))
            }
          }}
          options={[
            { value: '', label: 'No category' },
            ...categories.map((cat) => ({ value: cat.id, label: capitalizeWords(cat.name) })),
            { value: '__new__', label: 'Add new category' },
          ]}
        />

        {creatingCategory && (
          <div style={{ marginTop: '6px', display: 'flex', gap: '6px' }}>
            <input
              type="text"
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(capitalizeWords(e.target.value))}
            />
            <button type="button" onClick={() => { setCreatingCategory(false); setNewCategoryName('') }}>
              Cancel
            </button>
          </div>
        )}
        {errors.category && <p style={{ color: 'red', fontSize: '0.85em' }}>{errors.category}</p>}
      </div>

      <div>
        <label>Supplier</label>
        <CustomSelect
          name="supplier_id"
          value={creatingSupplier ? '__new__' : formData.supplier_id}
          placeholder="No supplier"
          onChange={(e) => {
            const value = e.target.value
            if (value === '__new__') {
              setCreatingSupplier(true)
              setFormData((prev) => ({ ...prev, supplier_id: '' }))
            } else {
              setCreatingSupplier(false)
              setNewSupplierName('')
              setFormData((prev) => ({ ...prev, supplier_id: value }))
            }
          }}
          options={[
            { value: '', label: 'No supplier' },
            ...suppliers.map((sup) => ({ value: sup.id, label: capitalizeWords(sup.name) })),
            { value: '__new__', label: 'Add new supplier' },
          ]}
        />

        {creatingSupplier && (
          <div style={{ marginTop: '6px', display: 'flex', gap: '6px' }}>
            <input
              type="text"
              placeholder="New supplier name"
              value={newSupplierName}
              onChange={(e) => setNewSupplierName(capitalizeWords(e.target.value))}
            />
            <button type="button" onClick={() => { setCreatingSupplier(false); setNewSupplierName('') }}>
              Cancel
            </button>
          </div>
        )}
        {errors.supplier && <p style={{ color: 'red', fontSize: '0.85em' }}>{errors.supplier}</p>}
      </div>

      <div>
        <label>Selling Price</label>
        <input name="selling_price" type="number" step="0.01" min="0" value={formData.selling_price} onChange={handleChange} placeholder="0.00" />
        {errors.selling_price && <p style={{ color: 'red', fontSize: '0.85em' }}>{errors.selling_price}</p>}
      </div>

      <div>
        <label>Cost Price</label>
        <input name="cost_price" type="number" step="0.01" min="0" value={formData.cost_price} onChange={handleChange} placeholder="0.00" />
        {errors.cost_price && <p style={{ color: 'red', fontSize: '0.85em' }}>{errors.cost_price}</p>}
      </div>

      <div>
        <label>Quantity</label>
        <input name="quantity" type="number" min="0" value={formData.quantity} onChange={handleChange} placeholder="0" />
        {errors.quantity && <p style={{ color: 'red', fontSize: '0.85em' }}>{errors.quantity}</p>}
      </div>

      <div>
        <label>Minimum Stock</label>
        <input name="minimum_stock" type="number" min="0" value={formData.minimum_stock} onChange={handleChange} placeholder="0" />
        {errors.minimum_stock && <p style={{ color: 'red', fontSize: '0.85em' }}>{errors.minimum_stock}</p>}
      </div>

      <div>
        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Product description" rows="4" />
      </div>

      <div>
        <label>Status</label>
        <CustomSelect
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'discontinued', label: 'Discontinued' },
          ]}
        />
      </div>

      {errors.submit && <p style={{ color: 'red', fontSize: '0.85em' }}>{errors.submit}</p>}

      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <button type="submit">Save Product</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

export default ProductForm