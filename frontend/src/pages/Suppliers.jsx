import { useState, useEffect } from 'react'
import { fetchSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../services/api'
import SupplierForm from '../components/SupplierForm'
import { Link } from 'react-router-dom'
import { isAdmin } from '../utils/auth'

function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)

  function loadSuppliers() {
    setLoading(true)
    fetchSuppliers()
      .then((data) => {
        setSuppliers(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadSuppliers()
  }, [])

  async function handleAddSupplier(formData) {
    try {
      await createSupplier(formData)
      setShowForm(false)
      loadSuppliers()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleUpdateSupplier(formData) {
    try {
      await updateSupplier(editingSupplier.id, formData)
      setEditingSupplier(null)
      loadSuppliers()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDeleteSupplier(supplier) {
    const confirmed = window.confirm(`Delete "${supplier.name}"? This cannot be undone.`)
    if (!confirmed) return
    try {
      await deleteSupplier(supplier.id)
      loadSuppliers()
    } catch (err) {
      setError(err.message)
    }
  }

  function startEdit(supplier) {
    setEditingSupplier(supplier)
    setShowForm(false)
  }

  if (loading) {
    return <p>Loading suppliers...</p>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Suppliers</h2>
        {isAdmin() && !showForm && !editingSupplier && (
          <button onClick={() => setShowForm(true)}>+ Add Supplier</button>
        )}
      </div>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {showForm && (
        <SupplierForm onSubmit={handleAddSupplier} onCancel={() => setShowForm(false)} />
      )}

      {editingSupplier && (
        <SupplierForm
          initialData={editingSupplier}
          onSubmit={handleUpdateSupplier}
          onCancel={() => setEditingSupplier(null)}
        />
      )}

      {!showForm && !editingSupplier && suppliers.length === 0 && (
        <p>No suppliers found. Add your first supplier to get started.</p>
      )}

      {!showForm && !editingSupplier && suppliers.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Name</th>
              <th style={{ padding: '8px' }}>Contact Person</th>
              <th style={{ padding: '8px' }}>Phone</th>
              <th style={{ padding: '8px' }}>Email</th>
              <th style={{ padding: '8px' }}></th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>
                  <Link to={`/products?supplier=${supplier.id}`}>{supplier.name}</Link>
                </td>
                <td style={{ padding: '8px' }}>{supplier.contact_person || '—'}</td>
                <td style={{ padding: '8px' }}>{supplier.contact_phone || '—'}</td>
                <td style={{ padding: '8px' }}>{supplier.contact_email || '—'}</td>
                <td style={{ padding: '8px' }}>
                  {isAdmin() && (
                    <>
                      <button onClick={() => startEdit(supplier)}>Edit</button>
                      <button onClick={() => handleDeleteSupplier(supplier)} style={{ marginLeft: '8px', color: 'red' }}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Suppliers