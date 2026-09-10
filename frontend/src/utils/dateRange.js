// Shared presets for the date-range pickers on Dashboard, Reports, and
// History. Using one definition keeps their behavior identical and avoids
// having two slightly-different date filters on the same page.
export const DATE_RANGE_PRESETS = [
  { label: '1 Day', value: 1 },
  { label: '1 Week', value: 7 },
  { label: '2 Weeks', value: 14 },
  { label: '1 Month', value: 30 },
  { label: '3 Months', value: 90 },
]

// Returns { startDate, endDate } as 'YYYY-MM-DD' strings for a given number
// of trailing days (inclusive of today).
export function rangeFromDays(days) {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - Number(days) + 1)
  const toISODate = (d) => d.toISOString().split('T')[0]
  return { startDate: toISODate(start), endDate: toISODate(end) }
}
