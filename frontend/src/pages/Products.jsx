import { useState, useEffect } from 'react'
import ProductForm from '../components/ProductForm'
import StockBadge from '../components/StockBadge'
import CustomSelect from '../components/CustomSelect'
import AdinkraWatermark from '../components/AdinkraWatermark'
import AdinkraIcon from '../components/AdinkraIcon'
import Icon from '../components/Icon'
import { fetchProducts, createProduct, updateProduct, deleteProduct, fetchCategories, fetchSuppliers } from '../services/api'
import { useSearchParams } from 'react-router-dom'
import { isAdmin } from '../utils/auth'
import { capitalizeWords } from '../utils/textFormat'

import './Pages.css'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [searchParams] = useSearchParams()
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '')
  const [supplierFilter, setSupplierFilter] = useState(searchParams.get('supplier') || '')
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedCards, setExpandedCards] = useState(new Set())
  const rowsPerPage = 10

  function toggleCard(id) {
    setExpandedCards((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      product.name.toLowerCase().includes(term) ||
      (product.sku && product.sku.toLowerCase().includes(term))
    const matchesCategory = categoryFilter === '' || product.category_id === Number(categoryFilter)
    const matchesSupplier = supplierFilter === '' || product.supplier_id === Number(supplierFilter)
    return matchesSearch && matchesCategory && matchesSupplier
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let valA = a[sortField]
    let valB = b[sortField]

    if (typeof valA === 'string') valA = valA.toLowerCase()
    if (typeof valB === 'string') valB = valB.toLowerCase()

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedProducts.length / rowsPerPage)
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  function handleSort(field) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
    setCurrentPage(1)
  }

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
    fetchCategories().then(setCategories).catch(() => setCategories([]))
    fetchSuppliers().then(setSuppliers).catch(() => setSuppliers([]))
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
    <div className="page-shell page-products">
      <AdinkraWatermark name="adinkrahene" className="page-watermark products-watermark" />
      <AdinkraWatermark name="nyameDua" className="page-watermark-secondary" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Products</h2>
        {!showForm && !editingProduct && (
          <button className="primary-add-button" onClick={() => setShowForm(true)}><AdinkraIcon name="mpatapo" className="action-symbol-icon" /><span>Add Product</span></button>
        )}
      </div>

      {!showForm && !editingProduct && (
        <div className="product-filters" style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px', width: '100%', maxWidth: '300px' }}
          />
          <CustomSelect
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            placeholder="All Categories"
            options={[
              { value: '', label: 'All Categories' },
              ...categories.map((cat) => ({ value: cat.id, label: capitalizeWords(cat.name) })),
            ]}
            className="filter-select"
          />
          <CustomSelect
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
            placeholder="All Suppliers"
            options={[
              { value: '', label: 'All Suppliers' },
              ...suppliers.map((sup) => ({ value: sup.id, label: capitalizeWords(sup.name) })),
            ]}
            className="filter-select"
          />
        </div>
      )}

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

      {!showForm && !editingProduct && filteredProducts.length === 0 && (
        <p>
          {searchTerm
            ? `No products match "${searchTerm}"`
            : 'No products found. Add your first product to get started.'}
        </p>
      )}

      {!showForm && !editingProduct && filteredProducts.length > 0 && (
        <>
          <div className="desktop-table-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                  <th style={{ padding: '8px', cursor: 'pointer' }} onClick={() => handleSort('name')}>
                    Name {sortField === 'name' && <AdinkraIcon name={sortDirection === 'asc' ? 'nyameDua' : 'sankofa'} className="sort-symbol" />}
                  </th>
                  <th style={{ padding: '8px' }}>Category</th>
                  <th style={{ padding: '8px' }}>Supplier</th>
                  <th style={{ padding: '8px' }}>SKU</th>
                  <th style={{ padding: '8px', cursor: 'pointer' }} onClick={() => handleSort('selling_price')}>
                    Price {sortField === 'selling_price' && <AdinkraIcon name={sortDirection === 'asc' ? 'nyameDua' : 'sankofa'} className="sort-symbol" />}
                  </th>
                  <th style={{ padding: '8px', cursor: 'pointer' }} onClick={() => handleSort('quantity')}>
                    Quantity {sortField === 'quantity' && <AdinkraIcon name={sortDirection === 'asc' ? 'nyameDua' : 'sankofa'} className="sort-symbol" />}
                  </th>
                  <th style={{ padding: '8px' }}>Stock Status</th>
                  <th style={{ padding: '8px' }}>Status</th>
                  {isAdmin() && <th style={{ padding: '8px' }}>Added By</th>}
                  <th style={{ padding: '8px' }}></th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px' }}>{capitalizeWords(product.name)}</td>
                    <td style={{ padding: '8px' }}>{product.category_name ? capitalizeWords(product.category_name) : '—'}</td>
                    <td style={{ padding: '8px' }}>{product.supplier_name ? capitalizeWords(product.supplier_name) : '—'}</td>
                    <td style={{ padding: '8px' }}>{product.sku || '—'}</td>
                    <td style={{ padding: '8px' }}>₵{Number(product.selling_price || 0).toFixed(2)}</td>
                    <td style={{ padding: '8px' }}>{product.quantity}</td>
                    <td style={{ padding: '8px' }}><StockBadge product={product} /></td>
                    <td style={{ padding: '8px' }}>{product.status}</td>
                    {isAdmin() && <td style={{ padding: '8px' }}>{product.created_by_name ? capitalizeWords(product.created_by_name) : '—'}</td>}
                    <td style={{ padding: '8px' }}>
                      <button onClick={() => startEdit(product)}>Edit</button>
                      {isAdmin() && (
                        <button onClick={() => handleDeleteProduct(product)} style={{ marginLeft: '8px', color: 'red' }}>
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mobile-card-list">
            {paginatedProducts.map((product) => (
              <article className={`mobile-record-card product-mobile-card ${expandedCards.has(product.id) ? 'expanded' : ''}`} key={`mobile-${product.id}`}>
                <button type="button" className="record-card-top record-card-toggle" onClick={() => toggleCard(product.id)} aria-expanded={expandedCards.has(product.id)}>
                  <div>
                    <h3>{capitalizeWords(product.name)}</h3>
                    <div className="record-card-summary-line">
                      <span className="record-card-summary-stat">{product.quantity} in stock</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <StockBadge product={product} />
                    <Icon name="chevron" size={16} className="record-card-chevron" />
                  </div>
                </button>

                <div className="record-card-collapsible">
                  <div>
                    <div className="record-card-grid">
                      <div><span>Category</span><strong>{product.category_name ? capitalizeWords(product.category_name) : '—'}</strong></div>
                      <div><span>Supplier</span><strong>{product.supplier_name ? capitalizeWords(product.supplier_name) : '—'}</strong></div>
                      <div><span>Price</span><strong>₵{Number(product.selling_price || 0).toFixed(2)}</strong></div>
                      <div><span>Quantity</span><strong>{product.quantity}</strong></div>
                    </div>

                    <div className="record-card-footer">
                      <span className="status-text">{product.status}</span>
                      <div className="record-actions">
                        <button onClick={() => startEdit(product)}>Edit</button>
                        {isAdmin() && (
                          <button onClick={() => handleDeleteProduct(product)} className="danger-action">Delete</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '12px' }}>
              <button
                className="symbol-page-button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <AdinkraIcon name="sankofa" className="pagination-symbol previous-symbol" /> Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                className="symbol-page-button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next <AdinkraIcon name="nyameDua" className="pagination-symbol" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Products