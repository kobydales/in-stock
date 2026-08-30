import { Link, useNavigate } from 'react-router-dom'
import './MainLayout.css'
import { logout } from '../services/api'

function MainLayout({ children }) {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
    window.location.reload()
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2 className="app-name">In-Stock</h2>

        <nav className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/products">Products</Link>
          <Link to="/inventory">Inventory</Link>
          <Link to="/suppliers">Suppliers</Link>
          <Link to="/stock-in">Stock In</Link>
          <Link to="/stock-out">Stock Out</Link>
          <Link to="/low-stock">Low Stock</Link>
          <Link to="/history">History</Link>
          <Link to="/reports">Reports</Link>

          <button
            onClick={handleLogout}
            style={{ marginTop: '20px' }}
          >
            Log Out
          </button>
        </nav>
      </aside>

      <div className="main-area">
        <header className="header">
          <h1>Dashboard</h1>
        </header>

        <main className="content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout