import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { changePassword } from '../services/api'
import Icon from './Icon'
import './ChangePasswordModal.css'

function ChangePasswordModal({ open, onClose }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleClose() {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setError(null)
    setSuccess(false)
    onClose()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    setLoading(true)
    try {
      await changePassword(currentPassword, newPassword)
      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cpm-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={handleClose}
        >
          <motion.div
            className="cpm-card"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cpm-header">
              <h3>Change password</h3>
              <button className="cpm-close" onClick={handleClose} aria-label="Close">
                <Icon name="close" size={16} />
              </button>
            </div>

            {success ? (
              <div className="cpm-success">
                <p>Your password has been updated.</p>
                <button className="cpm-submit" onClick={handleClose}>Done</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="cpm-field">
                  <label htmlFor="cpm-current">Current password</label>
                  <input id="cpm-current" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" required />
                </div>
                <div className="cpm-field">
                  <label htmlFor="cpm-new">New password</label>
                  <input id="cpm-new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" required minLength={6} />
                </div>
                <div className="cpm-field">
                  <label htmlFor="cpm-confirm">Confirm new password</label>
                  <input id="cpm-confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" required minLength={6} />
                </div>

                {error && <p className="cpm-error">{error}</p>}

                <button className="cpm-submit" type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update password'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ChangePasswordModal
