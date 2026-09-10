import { useState, useEffect } from 'react'

// Tracks browser connectivity so pages can show a clear "you're offline"
// state and disable actions that need the network (stock writes, saving
// products, etc.) rather than letting them fail silently or confusingly.
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
    }
    function handleOffline() {
      setIsOnline(false)
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}
