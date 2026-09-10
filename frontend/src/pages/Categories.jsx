import { useState, useEffect } from 'react'
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../services/api'
import CategoryForm from '../components/CategoryForm'
import AdinkraWatermark from '../components/AdinkraWatermark'
import AdinkraIcon from '../components/AdinkraIcon'
import Icon from '../components/Icon'
import { Link } from 'react-router-dom'
import { isAdmin } from '../utils/auth'
import { capitalizeWords } from '../utils/textFormat'

import './Pages.css'

function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [expandedCards, setExpandedCards] = useState(new Set())

  function toggleCard(id) {
    setExpandedCards((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function loadCategories() {
    setLoading(true)
    fetchCategories()
      .then((data) => {
        setCategories(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadCategories()
  }, [])

  async function handleAddCategory(formData) {
    try {
      await createCategory(formData)
      setShowForm(false)
      loadCategories()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleUpdateCategory(formData) {
    try {
      await updateCategory(editingCategory.id, formData)
      setEditingCategory(null)
      loadCategories()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDeleteCategory(category) {
    const confirmed = window.confirm(`Delete "${category.name}"? This cannot be undone.`)
    if (!confirmed) return
    try {
      await deleteCategory(category.id)
      loadCategories()
    } catch (err) {
      setError(err.message)
    }
  }

  function startEdit(category) {
    setEditingCategory(category)
    setShowForm(false)
  }

  if (loading) {
    return <p>Loading categories...</p>
  }

  return (
    <div className="page-shell page-categories">
      <AdinkraWatermark name="nyameDua" className="page-watermark categories-watermark" />
      <AdinkraWatermark name="dwennimmen" className="page-watermark-secondary" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Categories</h2>
        {isAdmin() && !showForm && !editingCategory && (
          <button className="primary-add-button" onClick={() => setShowForm(true)}><AdinkraIcon name="nyameDua" className="action-symbol-icon" /><span>Add Category</span></button>
        )}
      </div>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {showForm && (
        <CategoryForm onSubmit={handleAddCategory} onCancel={() => setShowForm(false)} />
      )}

      {editingCategory && (
        <CategoryForm
          initialData={editingCategory}
          onSubmit={handleUpdateCategory}
          onCancel={() => setEditingCategory(null)}
        />
      )}

      {!showForm && !editingCategory && categories.length === 0 && (
        <p>No categories found. Add your first category to get started.</p>
      )}

      {!showForm && !editingCategory && categories.length > 0 && (
        <>
        <div className="desktop-table-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>Name</th>
                <th style={{ padding: '8px' }}>Description</th>
                <th style={{ padding: '8px' }}>Status</th>
                <th style={{ padding: '8px' }}></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}><Link to={`/products?category=${category.id}`}>{capitalizeWords(category.name)}</Link></td>
                  <td style={{ padding: '8px' }}>{category.description ? capitalizeWords(category.description) : '—'}</td>
                  <td style={{ padding: '8px' }}>{category.status}</td>
                  <td style={{ padding: '8px' }}>
                    {isAdmin() && (
                      <>
                        <button onClick={() => startEdit(category)}>Edit</button>
                        <button onClick={() => handleDeleteCategory(category)} style={{ marginLeft: '8px', color: 'red' }}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mobile-card-list">
          {categories.map((category) => (
            <article className={`mobile-record-card ${expandedCards.has(category.id) ? 'expanded' : ''}`} key={`mobile-${category.id}`}>
              <div
                className="record-card-top record-card-toggle"
                role="button"
                tabIndex={0}
                onClick={() => toggleCard(category.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCard(category.id) } }}
                aria-expanded={expandedCards.has(category.id)}
              >
                <div>
                  <h3><Link to={`/products?category=${category.id}`} onClick={(e) => e.stopPropagation()}>{capitalizeWords(category.name)}</Link></h3>
                  <span className="record-subtle">Category</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span className={`status-pill ${category.status === 'active' ? 'is-active' : 'is-muted'}`}><AdinkraIcon name="adinkrahene" className="status-symbol" />{category.status}</span>
                  <Icon name="chevron" size={16} className="record-card-chevron" />
                </div>
              </div>
              <div className="record-card-collapsible">
                <div>
                  <div className="record-card-footer">
                    <Link to={`/products?category=${category.id}`} className="record-subtle view-products-link" onClick={(e) => e.stopPropagation()}>
                      View products <AdinkraIcon name="nyameDua" className="symbol-direction-icon" />
                    </Link>
                    {isAdmin() && (
                      <div className="record-actions">
                        <button onClick={() => startEdit(category)}>Edit</button>
                        <button onClick={() => handleDeleteCategory(category)} className="danger-action">Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        </>
      )}
    </div>
  )
}

export default Categories