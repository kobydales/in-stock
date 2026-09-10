import { Navigate } from 'react-router-dom'
import { isAdmin } from '../utils/auth'

// UI convenience only — the backend enforces this independently
// (requireAdmin on the relevant routes), so this just avoids sending staff
// to a page that would only show them 403s.
function AdminRoute({ children }) {
  if (!isAdmin()) {
    return <Navigate to="/" replace />
  }
  return children
}

export default AdminRoute
