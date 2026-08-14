import { useState, useEffect } from 'react'
import ProductForm from '../components/ProductForm'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../services/api'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  function loadProducts() {
    setLoading(true)
    fetchProducts()
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadProducts()
  }, [])

  async function handleAddProduct(formData) {
    try {
      await createProduct(formData)
      setShowForm(false)
      loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleUpdateProduct(formData) {
    try {
      await updateProduct(editingProduct.id, formData)
      setEditingProduct(null)
      loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }
async function handleDeleteProduct(product) {
  const confirmed = window.confirm(`Delete "${product.name}"? This cannot be undone.`)
  if (!confirmed) return

  try {
    await deleteProduct(product.id)
    loadProducts()
  } catch (err) {
    setError(err.message)
  }
}

  function startEdit(product) {
    setEditingProduct(product)
    setShowForm(false)
  }

  if (loading) {
    return <p>Loading products...</p>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Products</h2>
        {!showForm && !editingProduct && (
          <button onClick={() => setShowForm(true)}>+ Add Product</button>
        )}
      </div>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {showForm && (
        <ProductForm
          onSubmit={handleAddProduct}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingProduct && (
        <ProductForm
          initialData={editingProduct}
          onSubmit={handleUpdateProduct}
          onCancel={() => setEditingProduct(null)}
        />
      )}

      {!showForm && !editingProduct && products.length === 0 && (
        <p>No products found. Add your first product to get started.</p>
      )}

      {!showForm && !editingProduct && products.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Name</th>
              <th style={{ padding: '8px' }}>SKU</th>
              <th style={{ padding: '8px' }}>Price</th>
              <th style={{ padding: '8px' }}>Quantity</th>
              <th style={{ padding: '8px' }}>Status</th>
              <th style={{ padding: '8px' }}></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{product.name}</td>
                <td style={{ padding: '8px' }}>{product.sku}</td>
                <td style={{ padding: '8px' }}>${product.selling_price}</td>
                <td style={{ padding: '8px' }}>{product.quantity}</td>
                <td style={{ padding: '8px' }}>{product.status}</td>
                <td style={{ padding: '8px' }}>
                  <button onClick={() => startEdit(product)}>Edit</button>
                  <button onClick={() => handleDeleteProduct(product)} style={{ marginLeft: '8px', color: 'red' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Products