import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signup } from '../services/api'
import { capitalizeWords } from '../utils/textFormat'
import nyameDua from '../assets/adinkra/nyame-dua.svg'
import adinkrahene from '../assets/adinkra/adinkrahene.svg'
import inStockLogo from '../assets/in-stock-logo.png'
import './Auth.css'

function Signup() {
  const [businessName, setBusinessName] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      const result = await signup({ businessName: capitalizeWords(businessName.trim()), name: capitalizeWords(name.trim()), email, password })
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
        <img className="auth-symbol secondary" src={adinkrahene} alt="" aria-hidden="true" />
        <img className="auth-symbol" src={nyameDua} alt="" aria-hidden="true" />
        <div className="auth-brand-content">
          <img className="auth-full-logo" src={inStockLogo} alt="In-Stock" />
          <p className="auth-kicker">Start with a clearer shelf</p>
          <h1>Akwaba.</h1>
          <p>Create your business workspace and keep your products, suppliers and stock movements together from day one.</p>
        </div>
      </section>

      <section className="auth-form-panel">
        <img className="auth-watermark" src={nyameDua} alt="" aria-hidden="true" />
        <div className="auth-card">
          <h2>Create your business account</h2>
          <p className="auth-subtitle">Set up your workspace in a few quick steps.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="signup-business">Business name</label>
              <input id="signup-business" value={businessName} onChange={(e) => setBusinessName(capitalizeWords(e.target.value))} autoComplete="organization" required />
            </div>
            <div className="auth-field">
              <label htmlFor="signup-name">Your name</label>
              <input id="signup-name" value={name} onChange={(e) => setName(capitalizeWords(e.target.value))} autoComplete="name" required />
            </div>
            <div className="auth-field">
              <label htmlFor="signup-email">Email</label>
              <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
            </div>
            <div className="auth-field">
              <label htmlFor="signup-password">Password</label>
              <input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />
            </div>

            {error && <p className="auth-error">{error}</p>}
            <button className="auth-submit" type="submit">Create Account</button>
          </form>

          <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
          <p className="auth-footer">Built for everyday stock management · Ghana</p>
        </div>
      </section>
    </div>
  )
}

export default Signup
