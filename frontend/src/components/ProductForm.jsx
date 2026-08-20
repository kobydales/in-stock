import { useState, useEffect } from 'react'
import {
  fetchCategories,
  fetchSuppliers,
  createCategory,
  createSupplier,
} from '../services/api'

function ProductForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    sku: initialData?.sku || '',
    category_id: initialData?.category_id || '',
    supplier_id: initialData?.supplier_id || '',
    selling_price: initialData?.selling_price || '',
    cost_price: initialData?.cost_price || '',
    quantity: initialData?.quantity || '',
    minimum_stock: initialData?.minimum_stock || '',
    description: initialData?.description || '',
    status: initialData?.status || 'active',
  })

  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [errors, setErrors] = useState({})

  // New category state
  const [creatingCategory, setCreatingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  // New supplier state
  const [creatingSupplier, setCreatingSupplier] = useState(false)
  const [newSupplierName, setNewSupplierName] = useState('')

  // Load categories and suppliers
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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Remove error when user starts correcting the field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  function validate() {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (
      formData.selling_price === '' ||
      Number(formData.selling_price) <= 0
    ) {
      newErrors.selling_price = 'Selling price must be greater than 0'
    }

    if (
      formData.cost_price === '' ||
      Number(formData.cost_price) < 0
    ) {
      newErrors.cost_price = 'Cost price must be 0 or greater'
    }

    if (
      formData.quantity === '' ||
      Number(formData.quantity) < 0
    ) {
      newErrors.quantity = 'Quantity must be 0 or greater'
    }

    if (
      formData.minimum_stock !== '' &&
      Number(formData.minimum_stock) < 0
    ) {
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

    try {
      let categoryId =
        formData.category_id === ''
          ? null
          : Number(formData.category_id)

      let supplierId =
        formData.supplier_id === ''
          ? null
          : Number(formData.supplier_id)

      // Create new category if selected
      if (creatingCategory) {
        const newCategory = await createCategory({
          name: newCategoryName.trim(),
          status: 'active',
        })

        categoryId = newCategory.id

        // Add newly created category to dropdown
        setCategories((prev) => [...prev, newCategory])
      }

      // Create new supplier if selected
      if (creatingSupplier) {
        const newSupplier = await createSupplier({
          name: newSupplierName.trim(),
        })

        supplierId = newSupplier.id

        // Add newly created supplier to dropdown
        setSuppliers((prev) => [...prev, newSupplier])
      }

      const cleanedData = {
        ...formData,

        sku:
          formData.sku.trim() === ''
            ? null
            : formData.sku.trim(),

        category_id: categoryId,
        supplier_id: supplierId,

        selling_price: Number(formData.selling_price),
        cost_price: Number(formData.cost_price),
        quantity: Number(formData.quantity),

        minimum_stock:
          formData.minimum_stock === ''
            ? 0
            : Number(formData.minimum_stock),

        description:
          formData.description.trim() === ''
            ? null
            : formData.description.trim(),
      }

      await onSubmit(cleanedData)
    } catch (error) {
      console.error('Failed to save product:', error)

      setErrors({
        submit: 'Failed to save product. Please try again.',
      })
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '400px',
      }}
    >
      {/* Product Name */}
      <div>
        <label>Name</label>

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product name"
        />

        {errors.name && (
          <p style={{ color: 'red', fontSize: '0.85em' }}>
            {errors.name}
          </p>
        )}
      </div>

      {/* SKU */}
      <div>
        <label>SKU (optional)</label>

        <input
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          placeholder="e.g. PROD-001"
        />
      </div>

      {/* Category */}
      <div>
        <label>Category</label>

        <select
          name="category_id"
          value={creatingCategory ? '__new__' : formData.category_id}
          onChange={(e) => {
            const value = e.target.value

            if (value === '__new__') {
              setCreatingCategory(true)
              setFormData((prev) => ({
                ...prev,
                category_id: '',
              }))
            } else {
              setCreatingCategory(false)
              setNewCategoryName('')

              setFormData((prev) => ({
                ...prev,
                category_id: value,
              }))
            }
          }}
        >
          <option value="">-- No category --</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}

          <option value="__new__">
            + Add new category...
          </option>
        </select>

        {creatingCategory && (
          <div
            style={{
              marginTop: '6px',
              display: 'flex',
              gap: '6px',
            }}
          >
            <input
              type="text"
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) =>
                setNewCategoryName(e.target.value)
              }
            />

            <button
              type="button"
              onClick={() => {
                setCreatingCategory(false)
                setNewCategoryName('')
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {errors.category && (
          <p style={{ color: 'red', fontSize: '0.85em' }}>
            {errors.category}
          </p>
        )}
      </div>

      {/* Supplier */}
      <div>
        <label>Supplier</label>

        <select
          name="supplier_id"
          value={
            creatingSupplier
              ? '__new__'
              : formData.supplier_id
          }
          onChange={(e) => {
            const value = e.target.value

            if (value === '__new__') {
              setCreatingSupplier(true)

              setFormData((prev) => ({
                ...prev,
                supplier_id: '',
              }))
            } else {
              setCreatingSupplier(false)
              setNewSupplierName('')

              setFormData((prev) => ({
                ...prev,
                supplier_id: value,
              }))
            }
          }}
        >
          <option value="">-- No supplier --</option>

          {suppliers.map((sup) => (
            <option key={sup.id} value={sup.id}>
              {sup.name}
            </option>
          ))}

          <option value="__new__">
            + Add new supplier...
          </option>
        </select>

        {creatingSupplier && (
          <div
            style={{
              marginTop: '6px',
              display: 'flex',
              gap: '6px',
            }}
          >
            <input
              type="text"
              placeholder="New supplier name"
              value={newSupplierName}
              onChange={(e) =>
                setNewSupplierName(e.target.value)
              }
            />

            <button
              type="button"
              onClick={() => {
                setCreatingSupplier(false)
                setNewSupplierName('')
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {errors.supplier && (
          <p style={{ color: 'red', fontSize: '0.85em' }}>
            {errors.supplier}
          </p>
        )}
      </div>

      {/* Selling Price */}
      <div>
        <label>Selling Price</label>

        <input
          name="selling_price"
          type="number"
          step="0.01"
          min="0"
          value={formData.selling_price}
          onChange={handleChange}
          placeholder="0.00"
        />

        {errors.selling_price && (
          <p style={{ color: 'red', fontSize: '0.85em' }}>
            {errors.selling_price}
          </p>
        )}
      </div>

      {/* Cost Price */}
      <div>
        <label>Cost Price</label>

        <input
          name="cost_price"
          type="number"
          step="0.01"
          min="0"
          value={formData.cost_price}
          onChange={handleChange}
          placeholder="0.00"
        />

        {errors.cost_price && (
          <p style={{ color: 'red', fontSize: '0.85em' }}>
            {errors.cost_price}
          </p>
        )}
      </div>

      {/* Quantity */}
      <div>
        <label>Quantity</label>

        <input
          name="quantity"
          type="number"
          min="0"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="0"
        />

        {errors.quantity && (
          <p style={{ color: 'red', fontSize: '0.85em' }}>
            {errors.quantity}
          </p>
        )}
      </div>

      {/* Minimum Stock */}
      <div>
        <label>Minimum Stock</label>

        <input
          name="minimum_stock"
          type="number"
          min="0"
          value={formData.minimum_stock}
          onChange={handleChange}
          placeholder="0"
        />

        {errors.minimum_stock && (
          <p style={{ color: 'red', fontSize: '0.85em' }}>
            {errors.minimum_stock}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label>Description</label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Product description"
          rows="4"
        />
      </div>

      {/* Status */}
      <div>
        <label>Status</label>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="active">Active</option>
          <option value="discontinued">
            Discontinued
          </option>
        </select>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <p style={{ color: 'red', fontSize: '0.85em' }}>
          {errors.submit}
        </p>
      )}

      {/* Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginTop: '8px',
        }}
      >
        <button type="submit">
          Save Product
        </button>

        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default ProductForm
