import { useState, useEffect, useRef } from 'react'
import { fetchNotifications, fetchUnreadCount, markNotificationRead, markAllNotificationsRead } from '../services/api'

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
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function toggleOpen() {
    if (!open) {
      fetchNotifications().then(setNotifications).catch(() => {})
    }
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
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button onClick={toggleOpen} style={{ position: 'relative', cursor: 'pointer' }}>
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              backgroundColor: '#d9534f',
              color: 'white',
              borderRadius: '50%',
              fontSize: '0.7em',
              padding: '2px 6px',
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '100%',
            marginTop: '8px',
            width: '300px',
            maxHeight: '400px',
            overflowY: 'auto',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 100,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
            <strong>Notifications</strong>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} style={{ fontSize: '0.8em' }}>
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p style={{ padding: '16px', textAlign: 'center', color: '#666' }}>No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.is_read && handleMarkRead(n.id)}
                style={{
                  padding: '10px',
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: n.is_read ? 'white' : '#fff8e1',
                  cursor: n.is_read ? 'default' : 'pointer',
                }}
              >
                <div style={{ fontSize: '0.9em' }}>{n.message}</div>
                <div style={{ fontSize: '0.75em', color: '#999', marginTop: '4px' }}>
                  {new Date(n.created_at).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationBell