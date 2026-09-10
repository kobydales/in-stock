export function capitalizeWords(value) {
  if (value == null) return ''
  return String(value)
    .toLowerCase()
    .replace(/(^|[\s-])([a-z])/g, (_, prefix, letter) => `${prefix}${letter.toUpperCase()}`)
}

// Use for free-text fields users store as business/product/category/supplier data.
// Do not use for email addresses, passwords, phone numbers, or SKUs.
export function capitalizeUserText(value) {
  return capitalizeWords(value)
}
