// In dev, defaults to localhost. To test from a phone/another device on
// the same network, set VITE_API_URL in a .env.local file (see
// .env.local.example) to your computer's LAN IP instead of editing this.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050'

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export async function signup(data) {
  const response = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Signup failed')
  }
  return response.json()
}

export async function login(data) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Login failed')
  }
  return response.json()
}

export async function fetchProducts() {
  const response = await fetch(`${API_URL}/api/products`, {
    headers: { ...authHeaders() },
  })
  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }
  return response.json()
}

export async function createProduct(product) {
  const response = await fetch(`${API_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(product),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to create product')
  }
  return response.json()
}

export async function updateProduct(id, product) {
  const response = await fetch(`${API_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(product),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to update product')
  }
  return response.json()
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/api/products/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to delete product')
  }
  return response.json()
}

export async function fetchCategories() {
  const response = await fetch(`${API_URL}/api/categories`, {
    headers: { ...authHeaders() },
  })
  if (!response.ok) throw new Error('Failed to fetch categories')
  return response.json()
}

export async function createCategory(category) {
  const response = await fetch(`${API_URL}/api/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(category),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to create category')
  }
  return response.json()
}

export async function updateCategory(id, category) {
  const response = await fetch(`${API_URL}/api/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(category),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to update category')
  }
  return response.json()
}

export async function deleteCategory(id) {
  const response = await fetch(`${API_URL}/api/categories/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to delete category')
  }
  return response.json()
}

export async function fetchSuppliers() {
  const response = await fetch(`${API_URL}/api/suppliers`, {
    headers: { ...authHeaders() },
  })
  if (!response.ok) throw new Error('Failed to fetch suppliers')
  return response.json()
}

export async function createSupplier(supplier) {
  const response = await fetch(`${API_URL}/api/suppliers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(supplier),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to create supplier')
  }
  return response.json()
}

export async function updateSupplier(id, supplier) {
  const response = await fetch(`${API_URL}/api/suppliers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(supplier),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to update supplier')
  }
  return response.json()
}

export async function deleteSupplier(id) {
  const response = await fetch(`${API_URL}/api/suppliers/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to delete supplier')
  }
  return response.json()
}

export async function stockIn(data) {
  const response = await fetch(`${API_URL}/api/stock-movements/in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to record stock in')
  }
  return response.json()
}

export async function fetchLowStockProducts() {
  const response = await fetch(`${API_URL}/api/products/low-stock`, {
    headers: { ...authHeaders() },
  })
  if (!response.ok) throw new Error('Failed to fetch low-stock products')
  return response.json()
}

export async function stockOut(data) {
  const response = await fetch(`${API_URL}/api/stock-movements/out`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to record stock out')
  }
  return response.json()
}

export async function fetchDashboardStats() {
  const response = await fetch(`${API_URL}/api/dashboard/stats`, {
    headers: { ...authHeaders() },
  })
  if (!response.ok) throw new Error('Failed to fetch stats')
  return response.json()
}

export async function fetchRecentMovements() {
  const response = await fetch(`${API_URL}/api/dashboard/recent-movements`, {
    headers: { ...authHeaders() },
  })
  if (!response.ok) throw new Error('Failed to fetch recent movements')
  return response.json()
}

export async function fetchMovementChart(days = 7) {
  const response = await fetch(`${API_URL}/api/dashboard/movement-chart?days=${days}`, {
    headers: { ...authHeaders() },
  })
  if (!response.ok) throw new Error('Failed to fetch chart data')
  return response.json()
}

export async function fetchAllMovements() {
  const response = await fetch(`${API_URL}/api/stock-movements`, {
    headers: { ...authHeaders() },
  })
  if (!response.ok) throw new Error('Failed to fetch history')
  return response.json()
}


export async function fetchInventoryReport() {
  const response = await fetch(`${API_URL}/api/reports/inventory`, {
    headers: { ...authHeaders() },
  })
  if (!response.ok) throw new Error('Failed to fetch inventory report')
  return response.json()
}

export async function fetchLowStockReport() {
  const response = await fetch(`${API_URL}/api/reports/low-stock`, {
    headers: { ...authHeaders() },
  })
  if (!response.ok) throw new Error('Failed to fetch low-stock report')
  return response.json()
}

export async function fetchMostMovedReport() {
  const response = await fetch(`${API_URL}/api/reports/most-moved`, {
    headers: { ...authHeaders() },
  })
  if (!response.ok) throw new Error('Failed to fetch most-moved report')
  return response.json()
}

export async function fetchProductVelocity(order = 'most', limit = 5) {
  const response = await fetch(`${API_URL}/api/reports/product-velocity?order=${order}&limit=${limit}`, {
    headers: { ...authHeaders() },
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to fetch product velocity')
  }
  return response.json()
}

export async function fetchStockMovementReport(startDate, endDate) {
  const params = new URLSearchParams()
  if (startDate) params.set('startDate', startDate)
  if (endDate) params.set('endDate', endDate)
  const response = await fetch(`${API_URL}/api/reports/stock-movements?${params}`, {
    headers: { ...authHeaders() },
  })
  if (!response.ok) throw new Error('Failed to fetch stock movement report')
  return response.json()
}

export async function fetchValuationReport() {
  const response = await fetch(`${API_URL}/api/reports/valuation`, {
    headers: { ...authHeaders() },
  })
  if (!response.ok) throw new Error('Failed to fetch valuation report')
  return response.json()
}

// Admin-only staff/team management.
export async function fetchUsers() {
  const response = await fetch(`${API_URL}/api/users`, {
    headers: { ...authHeaders() },
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to fetch users')
  }
  return response.json()
}

export async function createStaffUser(data) {
  const response = await fetch(`${API_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to create user')
  }
  return response.json()
}

export async function deleteUser(id) {
  const response = await fetch(`${API_URL}/api/users/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to remove user')
  }
  return response.json()
}

export async function fetchNotifications() {
  const response = await fetch(`${API_URL}/api/notifications`, {
    headers: { ...authHeaders() },
  })
  if (!response.ok) throw new Error('Failed to fetch notifications')
  return response.json()
}

export async function fetchUnreadCount() {
  const response = await fetch(`${API_URL}/api/notifications/unread-count`, {
    headers: { ...authHeaders() },
  })
  if (!response.ok) throw new Error('Failed to fetch unread count')
  return response.json()
}

export async function markNotificationRead(id) {
  const response = await fetch(`${API_URL}/api/notifications/${id}/read`, {
    method: 'PUT',
    headers: { ...authHeaders() },
  })
  if (!response.ok) throw new Error('Failed to mark notification as read')
  return response.json()
}

export async function markAllNotificationsRead() {
  const response = await fetch(`${API_URL}/api/notifications/read-all`, {
    method: 'PUT',
    headers: { ...authHeaders() },
  })
  if (!response.ok) throw new Error('Failed to mark all as read')
  return response.json()
}

// Platform-owner-only endpoints. The backend enforces access via the
// platformOwner flag baked into the JWT — these calls will 403 for anyone
// else, so the UI hiding them is a convenience, not the security boundary.
export async function fetchPlatformOverview() {
  const response = await fetch(`${API_URL}/api/platform/overview`, {
    headers: { ...authHeaders() },
  })
  if (!response.ok) throw new Error('Failed to fetch platform overview')
  return response.json()
}

export async function fetchPlatformBusinesses() {
  const response = await fetch(`${API_URL}/api/platform/businesses`, {
    headers: { ...authHeaders() },
  })
  if (!response.ok) throw new Error('Failed to fetch businesses')
  return response.json()
}

export async function fetchPlatformBusinessDetail(id) {
  const response = await fetch(`${API_URL}/api/platform/businesses/${id}`, {
    headers: { ...authHeaders() },
  })
  if (!response.ok) throw new Error('Failed to fetch business detail')
  return response.json()
}

export async function requestPasswordReset(email) {
  const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to request password reset')
  }
  return response.json()
}

export async function resetPassword(token, password) {
  const response = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to reset password')
  }
  return response.json()
}

export async function changePassword(currentPassword, newPassword) {
  const response = await fetch(`${API_URL}/api/auth/change-password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ currentPassword, newPassword }),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to change password')
  }
  return response.json()
}

