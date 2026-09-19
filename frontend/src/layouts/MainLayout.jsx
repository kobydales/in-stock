import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import './MainLayout.css'
import { logout } from '../services/api'
import { getCurrentUser, isPlatformOwner, isAdmin } from '../utils/auth'
import NotificationBell from '../components/NotificationBell'
import ProfileMenu from '../components/ProfileMenu'
import AdinkraIcon from '../components/AdinkraIcon'
import { capitalizeWords } from '../utils/textFormat'
import Icon from '../components/Icon'
import OfflineBanner from '../components/OfflineBanner'
import { useInstallPrompt, useIsIOSInstallable } from '../utils/useInstallPrompt'
import mpatapo from '../assets/adinkra/mpatapo.svg'
import inStockLogo from '../assets/in-stock-logo.png'
// Tour paused — see /components/Tour.jsx and /utils/tour.js. Re-enable by
// uncommenting the import below and the <Tour> render at the bottom.
// import Tour from '../components/Tour'
// import { hasSeenTour } from '../utils/tour'

const primaryNav = [
  { to: '/', label: 'Dashboard', icon: 'grid' },
  { to: '/products', label: 'Products', icon: 'package' },
  { to: '/categories', label: 'Categories', icon: 'tags' },
  { to: '/suppliers', label: 'Suppliers', icon: 'truck' },
  { to: '/inventory', label: 'Inventory', icon: 'layers' },
]

const inventoryNav = [
  { to: '/stock-in', label: 'Stock In', icon: 'arrowDown' },
  { to: '/stock-out', label: 'Stock Out', icon: 'arrowUp' },
  { to: '/low-stock', label: 'Low Stock', icon: 'alert' },
  { to: '/history', label: 'History', icon: 'history' },
  { to: '/reports', label: 'Reports', icon: 'chart' },
]

function navTourId(to) {
  return to === '/' ? 'dashboard' : to.replace('/', '')
}

function MainLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [runTour, setRunTour] = useState(false)
  const user = getCurrentUser()
  const showPlatformNav = isPlatformOwner()
  const userIsAdmin = isAdmin()
  const { canInstall, promptInstall } = useInstallPrompt()
  const showIOSInstallHint = useIsIOSInstallable()
  const visibleInventoryNav = inventoryNav.filter((item) => item.to !== '/reports' || userIsAdmin)
  const rawDisplayName = user?.name || user?.email?.split('@')[0] || 'User'
  const displayName = user?.name ? capitalizeWords(rawDisplayName) : rawDisplayName
  const role = user?.role === 'admin' ? 'Administrator' : 'Staff'
  const rawBusinessName = user?.businessName || user?.business_name || ''
  const businessName = rawBusinessName ? capitalizeWords(rawBusinessName) : ''

  // Tour auto-trigger paused — see note above.
  // useEffect(() => {
  //   if (user?.id && !hasSeenTour(user.id)) {
  //     setMenuOpen(true)
  //     setRunTour(true)
  //   }
  // }, [])

  function startTour() {
    setMenuOpen(true)
    setRunTour(true)
  }

  function handleSidebarSectionDone() {
    setMenuOpen(false)
  }

  function handleTourFinish() {
    setRunTour(false)
    setMenuOpen(false)
  }

  const pageTitles = {
    '/': 'Dashboard',
    '/products': 'Products',
    '/categories': 'Categories',
    '/suppliers': 'Suppliers',
    '/inventory': 'Inventory',
    '/stock-in': 'Stock In',
    '/stock-out': 'Stock Out',
    '/low-stock': 'Low Stock',
    '/history': 'History',
    '/reports': 'Reports',
    '/team': 'Team',
    '/platform': 'Platform Overview',
  }

  function handleLogout() {
    logout()
    navigate('/login')
    window.location.reload()
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  function renderNav(items) {
    return items.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.to === '/'}
        onClick={closeMenu}
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        data-tour={`nav-${navTourId(item.to)}`}
      >
        <Icon name={item.icon} size={18} />
        <span>{item.label}</span>
        {item.label === 'Low Stock' && <span className="nav-dot" />}
      </NavLink>
    ))
  }

  return (
    <>
      <OfflineBanner />
      <div className="app-shell">
      <div className={`sidebar-overlay ${menuOpen ? 'open' : ''}`} onClick={closeMenu} />

      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <img className="sidebar-pattern" src={mpatapo} alt="" aria-hidden="true" />

        <div className="brand">
          <img className="brand-logo" src={inStockLogo} alt="In-Stock" />
          <button className="sidebar-close" onClick={closeMenu} aria-label="Close menu">
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="nav-section-label">Workspace</div>
        <nav className="nav-links">{renderNav(primaryNav)}</nav>

        <div className="nav-section-label inventory-label">Inventory</div>
        <nav className="nav-links">{renderNav(visibleInventoryNav)}</nav>

        {userIsAdmin && (
          <>
            <div className="nav-section-label">Admin</div>
            <nav className="nav-links">{renderNav([{ to: '/team', label: 'Team', icon: 'users' }])}</nav>
          </>
        )}

        {showPlatformNav && (
          <>
            <div className="nav-section-label">Platform</div>
            <nav className="nav-links">{renderNav([{ to: '/platform', label: 'All Businesses', icon: 'shield' }])}</nav>
          </>
        )}

        <div className="sidebar-spacer" />

        {businessName && (
          <div className="sidebar-footer"><AdinkraIcon name="mpatapo" className="sidebar-business-symbol" /><span>{businessName}</span></div>
        )}
        {canInstall && (
          <button className="sidebar-install-button" onClick={promptInstall}>
            <Icon name="download" size={15} />
            Install App
          </button>
        )}
        {showIOSInstallHint && (
          <p className="sidebar-install-hint">
            To install: tap <strong>Share</strong>, then <strong>Add to Home Screen</strong>.
          </p>
        )}
      </aside>

      <div className="main-area">
        <header className="header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Icon name="menu" size={21} />
            </button>
            <div>
              <div className="breadcrumb">In-Stock <span>/</span> {pageTitles[location.pathname] || 'Dashboard'}</div>
              <h1>{businessName ? `${businessName} ` : ''}{pageTitles[location.pathname] || 'Dashboard'}</h1>
            </div>
          </div>

          <div className="header-actions">
            <div data-tour="notification-bell"><NotificationBell /></div>
            <ProfileMenu
              displayName={displayName}
              role={role}
              businessName={businessName}
              onLogout={handleLogout}
              onTakeTour={startTour}
            />
          </div>
        </header>

        <main className="content">{children}</main>
      </div>
      </div>
      {/* Tour paused — see note above.
      <Tour
        run={runTour}
        userId={user?.id}
        userIsAdmin={userIsAdmin}
        showPlatformNav={showPlatformNav}
        onSidebarSectionDone={handleSidebarSectionDone}
        onFinish={handleTourFinish}
      />
      */}
    </>
  )
}

export default MainLayout