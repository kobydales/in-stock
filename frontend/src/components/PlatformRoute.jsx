import { Navigate } from 'react-router-dom'
import { isPlatformOwner } from '../utils/auth'

// This is a UI convenience only — the real enforcement is server-side
// (requirePlatformOwner on /api/platform/*). This just stops a non-owner
// from landing on a page that would only show them a string of 403 errors.
function PlatformRoute({ children }) {
  if (!isPlatformOwner()) {
    return <Navigate to="/" replace />
  }
  return children
}

export default PlatformRoute
