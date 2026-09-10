import { useState, useEffect } from 'react'
import { fetchSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../services/api'
import SupplierForm from '../components/SupplierForm'
import AdinkraWatermark from '../components/AdinkraWatermark'
import AdinkraIcon from '../components/AdinkraIcon'
import Icon from '../components/Icon'
import { Link } from 'react-router-dom'
import { isAdmin } from '../utils/auth'
import { capitalizeWords } from '../utils/textFormat'

import './Pages.css'

function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [expandedCards, setExpandedCards] = useState(new Set())

  function toggleCard(id) {
    setExpandedCards((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

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
    <div className="page-shell page-suppliers">
      <AdinkraWatermark name="sankofa" className="page-watermark suppliers-watermark" />
      <AdinkraWatermark name="nyameDua" className="page-watermark-secondary" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Suppliers</h2>
        {isAdmin() && !showForm && !editingSupplier && (
          <button className="primary-add-button" onClick={() => setShowForm(true)}><AdinkraIcon name="sankofa" className="action-symbol-icon" /><span>Add Supplier</span></button>
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
        <>
        <div className="desktop-table-wrap">
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
                    <Link to={`/products?supplier=${supplier.id}`}>{capitalizeWords(supplier.name)}</Link>
                  </td>
                  <td style={{ padding: '8px' }}>{supplier.contact_person ? capitalizeWords(supplier.contact_person) : '—'}</td>
                  <td style={{ padding: '8px' }}>{supplier.contact_phone || '—'}</td>
                  <td style={{ padding: '8px' }}>{supplier.contact_email || '—'}</td>
                  <td style={{ padding: '8px' }}>
                    {isAdmin() && (
                      <>
                        <button onClick={() => startEdit(supplier)}>Edit</button>
                        <button onClick={() => handleDeleteSupplier(supplier)} style={{ marginLeft: '8px', color: 'red' }}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mobile-card-list">
          {suppliers.map((supplier) => (
            <article className={`mobile-record-card ${expandedCards.has(supplier.id) ? 'expanded' : ''}`} key={`mobile-${supplier.id}`}>
              <div
                className="record-card-top record-card-toggle"
                role="button"
                tabIndex={0}
                onClick={() => toggleCard(supplier.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCard(supplier.id) } }}
                aria-expanded={expandedCards.has(supplier.id)}
              >
                <div>
                  <h3><Link to={`/products?supplier=${supplier.id}`} onClick={(e) => e.stopPropagation()}>{capitalizeWords(supplier.name)}</Link></h3>
                  <span className="record-subtle">Supplier</span>
                  {supplier.contact_person && (
                    <div className="record-card-summary-line">
                      <span className="record-card-summary-stat">{capitalizeWords(supplier.contact_person)}</span>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span className="soft-symbol"><AdinkraIcon name="sankofa" /></span>
                  <Icon name="chevron" size={16} className="record-card-chevron" />
                </div>
              </div>
              <div className="record-card-collapsible">
                <div>
                  <div className="record-detail-list">
                    <div><span>Contact person</span><strong>{supplier.contact_person ? capitalizeWords(supplier.contact_person) : '—'}</strong></div>
                    <div><span>Phone</span><strong>{supplier.contact_phone || '—'}</strong></div>
                    <div><span>Email</span><strong>{supplier.contact_email || '—'}</strong></div>
                  </div>
                  {isAdmin() && (
                    <div className="record-card-footer">
                      <span className="record-subtle">Manage supplier</span>
                      <div className="record-actions">
                        <button onClick={() => startEdit(supplier)}>Edit</button>
                        <button onClick={() => handleDeleteSupplier(supplier)} className="danger-action">Delete</button>
                      </div>
                    </div>
                  )}
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

export default Suppliers