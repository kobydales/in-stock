export function getCurrentUser() {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export function isAdmin() {
  const user = getCurrentUser()
  return user?.role === 'admin'
}

export function isPlatformOwner() {
  const user = getCurrentUser()
  return Boolean(user?.platformOwner)
}
