import { useState, useEffect } from 'react'
import { fetchUsers, createStaffUser, deleteUser } from '../services/api'
import { getCurrentUser } from '../utils/auth'
import CustomSelect from '../components/CustomSelect'
import AdinkraWatermark from '../components/AdinkraWatermark'
import { capitalizeWords } from '../utils/textFormat'
import './Pages.css'

function Team() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formError, setFormError] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'staff' })

  const currentUser = getCurrentUser()

  function loadUsers() {
    setLoading(true)
    fetchUsers()
      .then((data) => {
        setUsers(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadUsers()
  }, [])

  async function handleAddUser(e) {
    e.preventDefault()
    setFormError(null)
    try {
      await createStaffUser(formData)
      setShowForm(false)
      setFormData({ name: '', email: '', password: '', role: 'staff' })
      loadUsers()
    } catch (err) {
      setFormError(err.message)
    }
  }

  async function handleRemoveUser(user) {
    if (!window.confirm(`Remove ${capitalizeWords(user.name)} from this account? They will no longer be able to log in.`)) {
      return
    }
    try {
      await deleteUser(user.id)
      loadUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <p>Loading team...</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>

  return (
    <div className="page-shell page-team">
      <AdinkraWatermark name="dwennimmen" className="page-watermark" />
      <AdinkraWatermark name="mpatapo" className="page-watermark-secondary" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2>Team</h2>
          <p style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '-4px' }}>
            Manage who has access to your inventory, and what they can do.
          </p>
        </div>
        <button className="primary-button" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : 'Add Team Member'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', marginTop: '18px' }}>
          <div>
            <label>Name</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Full name"
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="name@business.com"
            />
          </div>
          <div>
            <label>Temporary Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="At least 6 characters"
            />
          </div>
          <div>
            <label>Role</label>
            <CustomSelect
              value={formData.role}
              onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
              options={[
                { value: 'staff', label: 'Staff — can manage products & stock' },
                { value: 'admin', label: 'Admin — full access, including Reports & Team' },
              ]}
            />
          </div>
          {formError && <p style={{ color: 'red', fontSize: '0.85em' }}>{formError}</p>}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit">Add Member</button>
          </div>
        </form>
      )}

      <div className="desktop-table-wrap" style={{ marginTop: '18px' }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Products Added</th>
              <th>Stock Movements</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td><strong>{capitalizeWords(u.name)}</strong>{u.id === currentUser?.id && <span className="record-subtle"> (you)</span>}</td>
                <td>{u.email}</td>
                <td>{u.role === 'admin' ? 'Administrator' : 'Staff'}</td>
                <td>{u.products_added}</td>
                <td>{u.stock_movements_recorded}</td>
                <td>
                  {u.id !== currentUser?.id && (
                    <button onClick={() => handleRemoveUser(u)} className="danger-action">Remove</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-card-list">
        {users.map((u) => (
          <article className="mobile-record-card" key={`mobile-${u.id}`}>
            <div className="record-card-top">
              <div>
                <h3>{capitalizeWords(u.name)}{u.id === currentUser?.id ? ' (you)' : ''}</h3>
                <span className="record-subtle">{u.email}</span>
              </div>
              <span className={`status-pill ${u.role === 'admin' ? 'is-active' : 'is-muted'}`}>{u.role === 'admin' ? 'Admin' : 'Staff'}</span>
            </div>
            <div className="record-card-grid">
              <div><span>Products Added</span><strong>{u.products_added}</strong></div>
              <div><span>Stock Movements</span><strong>{u.stock_movements_recorded}</strong></div>
            </div>
            {u.id !== currentUser?.id && (
              <div className="record-card-footer">
                <span />
                <div className="record-actions">
                  <button onClick={() => handleRemoveUser(u)} className="danger-action">Remove</button>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}

export default Team
