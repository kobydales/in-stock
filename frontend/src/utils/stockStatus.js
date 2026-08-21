export function getStockStatus(product) {
  if (product.quantity === 0) {
    return 'out'
  }
  if (product.quantity <= product.minimum_stock) {
    return 'low'
  }
  return 'in'
}

export const stockStatusConfig = {
  in: { label: 'In Stock', color: '#5cb85c' },
  low: { label: 'Low Stock', color: '#e0a800' },
  out: { label: 'Out of Stock', color: '#d9534f' },
}