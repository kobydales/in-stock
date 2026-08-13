import './MainLayout.css'

function MainLayout({ children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2 className="app-name">In-Stock</h2>
        <nav className="nav-links">
          <a href="#">Dashboard</a>
          <a href="#">Inventory</a>
          <a href="#">Suppliers</a>
          <a href="#">Reports</a>
          <a href="#">Settings</a>
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