function tourKey(userId) {
  return `tour-seen-${userId}`
}

export function hasSeenTour(userId) {
  if (!userId) return true
  return localStorage.getItem(tourKey(userId)) === 'true'
}

export function markTourSeen(userId) {
  if (!userId) return
  localStorage.setItem(tourKey(userId), 'true')
}

export function resetTour(userId) {
  if (!userId) return
  localStorage.removeItem(tourKey(userId))
}