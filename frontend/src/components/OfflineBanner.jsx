import { useOnlineStatus } from '../utils/useOnlineStatus'
import './OfflineBanner.css'

// Shown app-wide (in MainLayout) whenever the browser goes offline, so it's
// never ambiguous why something isn't loading or saving.
function OfflineBanner() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div className="offline-banner" role="status">
      You're offline — viewing cached data. Stock changes and edits are paused until you're back online.
    </div>
  )
}

export default OfflineBanner
