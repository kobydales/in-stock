import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { resetPassword } from '../services/api'
import gyeNyame from '../assets/adinkra/gye-nyame.svg'
import sankofa from '../assets/adinkra/sankofa.svg'
import inStockLogo from '../assets/in-stock-logo.png'
import './Auth.css'

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await resetPassword(token, password)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-brand-panel">
        <img className="auth-symbol secondary" src={sankofa} alt="" aria-hidden="true" />
        <img className="auth-symbol" src={gyeNyame} alt="" aria-hidden="true" />
        <div className="auth-brand-content">
          <img className="auth-full-logo" src={inStockLogo} alt="In-Stock" />
          <p className="auth-kicker">Inventory, simply managed</p>
          <p>Keep products, stock movements and suppliers organized in one calm, focused workspace.</p>
        </div>
      </section>

      <section className="auth-form-panel">
        <img className="auth-watermark" src={gyeNyame} alt="" aria-hidden="true" />
        <div className="auth-card">
          {!token ? (
            <>
              <h2>Invalid link</h2>
              <p className="auth-subtitle">This reset link is missing its token. Request a new one.</p>
              <p className="auth-switch"><Link to="/forgot-password">Request a new link</Link></p>
            </>
          ) : success ? (
            <>
              <h2>Password updated</h2>
              <p className="auth-subtitle">Redirecting you to login...</p>
            </>
          ) : (
            <>
              <h2>Reset password</h2>
              <p className="auth-subtitle">Choose a new password for your account.</p>

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-field">
                  <label htmlFor="new-password">New password</label>
                  <input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required minLength={6} />
                </div>
                <div className="auth-field">
                  <label htmlFor="confirm-password">Confirm password</label>
                  <input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" required minLength={6} />
                </div>

                {error && <p className="auth-error">{error}</p>}
                <button className="auth-submit" type="submit" disabled={loading}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>

              <p className="auth-switch"><Link to="/login">Back to login</Link></p>
            </>
          )}
          <p className="auth-footer">Built for everyday stock management · Ghana</p>
        </div>
      </section>
    </div>
  )
}

export default ResetPassword

