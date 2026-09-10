import { useState, useEffect, useRef } from 'react'
import { fetchNotifications, fetchUnreadCount, markNotificationRead, markAllNotificationsRead } from '../services/api'
import Icon from './Icon'
import './NotificationBell.css'

function NotificationBell() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  function loadUnreadCount() {
    fetchUnreadCount().then((data) => setUnreadCount(data.count)).catch(() => {})
  }

  useEffect(() => {
    loadUnreadCount()
    const interval = setInterval(loadUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function toggleOpen() {
    if (!open) fetchNotifications().then(setNotifications).catch(() => {})
    setOpen((prev) => !prev)
  }

  async function handleMarkRead(id) {
    await markNotificationRead(id)
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
    loadUnreadCount()
  }

  async function handleMarkAllRead() {
    await markAllNotificationsRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }

  return (
    <div className="notification-wrap" ref={dropdownRef}>
      <button className="notification-button" onClick={toggleOpen} aria-label="Notifications">
        <Icon name="bell" size={18} />
        {unreadCount > 0 && <span className="notification-count">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <div><strong>Notifications</strong><span>{unreadCount ? `${unreadCount} unread` : 'All caught up'}</span></div>
            {unreadCount > 0 && <button onClick={handleMarkAllRead}>Mark all read</button>}
          </div>

          {notifications.length === 0 ? (
            <div className="notification-empty"><Icon name="bell" size={21} /><p>No notifications yet.</p></div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} onClick={() => !n.is_read && handleMarkRead(n.id)} className={`notification-item ${n.is_read ? 'read' : 'unread'}`}>
                <span className="notification-dot" />
                <div><div className="notification-message">{n.message}</div><div className="notification-date">{new Date(n.created_at).toLocaleString()}</div></div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationBell
