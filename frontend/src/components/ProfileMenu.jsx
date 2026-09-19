import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from './Icon'
import ChangePasswordModal from './ChangePasswordModal'
import './ProfileMenu.css'

function ProfileMenu({ displayName, role, businessName, onLogout, onTakeTour }) {
  const [open, setOpen] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleTakeTour() {
    setOpen(false)
    onTakeTour?.()
  }

  function handleLogout() {
    setOpen(false)
    onLogout?.()
  }

  function handleOpenChangePassword() {
    setOpen(false)
    setShowChangePassword(true)
  }

  return (
    <div className="profile-menu-wrap" ref={wrapRef}>
      <button className="header-user" data-tour="user-card" onClick={() => setOpen((prev) => !prev)}>
        <div className="avatar small">{displayName.charAt(0).toUpperCase()}</div>
        <div className="header-user-text">
          <strong>{displayName}</strong>
          <span>{role}</span>
        </div>
        <Icon name="chevron" size={13} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="profile-menu-dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <div className="profile-menu-header">
              <div className="avatar">{displayName.charAt(0).toUpperCase()}</div>
              <div className="profile-menu-header-text">
                <strong>{displayName}</strong>
                <span>{role}</span>
                {businessName && <small>{businessName}</small>}
              </div>
            </div>

            <div className="profile-menu-divider" />

            <button className="profile-menu-item" onClick={handleOpenChangePassword}>
              <Icon name="shield" size={15} />
              <span>Change password</span>
            </button>

            <button className="profile-menu-item" onClick={handleLogout}>
              <Icon name="logout" size={15} />
              <span>Log out</span>
            </button>

            <div className="profile-menu-label">Help</div>

            <button className="profile-menu-item" onClick={handleTakeTour}>
              <Icon name="grid" size={15} />
              <span>Take a tour</span>
            </button>

            <a className="profile-menu-item" href="mailto:support@instock.app">
              <Icon name="alert" size={15} />
              <span>Contact support</span>
            </a>

            <div className="profile-menu-version">In-Stock v1.0</div>
          </motion.div>
        )}
      </AnimatePresence>

      <ChangePasswordModal open={showChangePassword} onClose={() => setShowChangePassword(false)} />
    </div>
  )
}

export default ProfileMenu