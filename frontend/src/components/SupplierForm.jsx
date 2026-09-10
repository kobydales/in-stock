import { useState } from 'react'
import { capitalizeWords } from '../utils/textFormat'

function SupplierForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    name: initialData?.name ? capitalizeWords(initialData.name) : '',
    contact_person: initialData?.contact_person ? capitalizeWords(initialData.contact_person) : '',
    contact_phone: initialData?.contact_phone || '',
    contact_email: initialData?.contact_email || '',
    address: initialData?.address ? capitalizeWords(initialData.address) : '',
    notes: initialData?.notes ? capitalizeWords(initialData.notes) : '',
  })
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: ['name', 'contact_person', 'address', 'notes'].includes(name) ? capitalizeWords(value) : value }))
  }

  function validate() {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
      <div>
        <label>Name</label>
        <input name="name" value={formData.name} onChange={handleChange} />
        {errors.name && <p style={{ color: 'red', fontSize: '0.85em' }}>{errors.name}</p>}
      </div>

      <div>
        <label>Contact Person</label>
        <input name="contact_person" value={formData.contact_person} onChange={handleChange} />
      </div>

      <div>
        <label>Phone</label>
        <input name="contact_phone" value={formData.contact_phone} onChange={handleChange} />
      </div>

      <div>
        <label>Email</label>
        <input name="contact_email" type="email" value={formData.contact_email} onChange={handleChange} />
      </div>

      <div>
        <label>Address</label>
        <input name="address" value={formData.address} onChange={handleChange} />
      </div>

      <div>
        <label>Notes</label>
        <textarea name="notes" value={formData.notes} onChange={handleChange} />
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <button type="submit">Save Supplier</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

export default SupplierForm
