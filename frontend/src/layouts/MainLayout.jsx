import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './MainLayout.css'
import { logout } from '../services/api'
import NotificationBell from '../components/NotificationBell'

function MainLayout({ children }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
    window.location.reload()
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <div className="app-shell">
      <div className={`sidebar-overlay ${menuOpen ? 'open' : ''}`} onClick={closeMenu} />

      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <h2 className="app-name">In-Stock</h2>

        <nav className="nav-links">
          <Link to="/" onClick={closeMenu}>Dashboard</Link>
          <Link to="/categories" onClick={closeMenu}>Categories</Link>
          <Link to="/products" onClick={closeMenu}>Products</Link>
          <Link to="/inventory" onClick={closeMenu}>Inventory</Link>
          <Link to="/suppliers" onClick={closeMenu}>Suppliers</Link>
          <Link to="/stock-in" onClick={closeMenu}>Stock In</Link>
          <Link to="/stock-out" onClick={closeMenu}>Stock Out</Link>
          <Link to="/low-stock" onClick={closeMenu}>Low Stock</Link>
          <Link to="/history" onClick={closeMenu}>History</Link>
          <Link to="/reports" onClick={closeMenu}>Reports</Link>

          <button onClick={handleLogout} style={{ marginTop: '20px' }}>
            Log Out
          </button>
        </nav>
      </aside>

      <div className="main-area">
        <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="menu-toggle" onClick={() => setMenuOpen(true)}>☰</button>
            <h1>Dashboard</h1>
          </div>
          <NotificationBell />
        </header>

        <main className="content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout