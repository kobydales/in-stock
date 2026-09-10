import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/api'
import gyeNyame from '../assets/adinkra/gye-nyame.svg'
import sankofa from '../assets/adinkra/sankofa.svg'
import inStockLogo from '../assets/in-stock-logo.png'
import './Auth.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      const result = await login({ email, password })
      localStorage.setItem('token', result.token)
      localStorage.setItem('user', JSON.stringify(result.user))
      navigate('/')
      window.location.reload()
    } catch (err) {
      setError(err.message)
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
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Sign in to continue managing your inventory.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="login-email">Email</label>
              <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
            </div>
            <div className="auth-field">
              <label htmlFor="login-password">Password</label>
              <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
            </div>

            {error && <p className="auth-error">{error}</p>}
            <button className="auth-submit" type="submit">Log In</button>
          </form>

          <p className="auth-switch">Don't have an account? <Link to="/signup">Create one</Link></p>
          <p className="auth-footer">Built for everyday stock management · Ghana</p>
        </div>
      </section>
    </div>
  )
}

export default Login
