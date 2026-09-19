import { useState } from 'react'
import { Link } from 'react-router-dom'
import { requestPasswordReset } from '../services/api'
import gyeNyame from '../assets/adinkra/gye-nyame.svg'
import sankofa from '../assets/adinkra/sankofa.svg'
import inStockLogo from '../assets/in-stock-logo.png'
import './Auth.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await requestPasswordReset(email)
      setSubmitted(true)
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
          {submitted ? (
            <>
              <h2>Check your email</h2>
              <p className="auth-subtitle">
                If an account exists for that email, a reset link is on its way. It expires in 30 minutes.
              </p>
              <p className="auth-switch"><Link to="/login">Back to login</Link></p>
            </>
          ) : (
            <>
              <h2>Forgot password</h2>
              <p className="auth-subtitle">Enter your email and we'll send you a reset link.</p>

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-field">
                  <label htmlFor="forgot-email">Email</label>
                  <input id="forgot-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
                </div>

                {error && <p className="auth-error">{error}</p>}
                <button className="auth-submit" type="submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p className="auth-switch">Remembered it? <Link to="/login">Log in</Link></p>
            </>
          )}
          <p className="auth-footer">Built for everyday stock management · Ghana</p>
        </div>
      </section>
    </div>
  )
}

export default ForgotPassword

