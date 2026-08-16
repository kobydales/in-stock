import { useState, useEffect } from 'react'
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../services/api'
import CategoryForm from '../components/CategoryForm'

function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Categories</h2>
        {!showForm && !editingCategory && (
          <button onClick={() => setShowForm(true)}>+ Add Category</button>
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
                <td style={{ padding: '8px' }}>{category.name}</td>
                <td style={{ padding: '8px' }}>{category.description || '—'}</td>
                <td style={{ padding: '8px' }}>{category.status}</td>
                <td style={{ padding: '8px' }}>
                  <button onClick={() => startEdit(category)}>Edit</button>
                  <button onClick={() => handleDeleteCategory(category)} style={{ marginLeft: '8px', color: 'red' }}>
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

export default Categories