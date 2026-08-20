import { Link } from 'react-router-dom'
import './MainLayout.css'

function MainLayout({ children }) {
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
          <Link to="/reports">Reports</Link>
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