const API_URL = 'http://localhost:5050'

export async function fetchTestData() {
  const response = await fetch(`${API_URL}/api/test`)
  if (!response.ok) {
    throw new Error('Failed to fetch data')
  }
  return response.json()
}

export async function fetchProducts() {
  const response = await fetch(`${API_URL}/api/products`)
  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }
  return response.json()
}
export async function createProduct(product) {
  const response = await fetch(`${API_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  if (!response.ok) {
    throw new Error('Failed to create product')
  }
  return response.json()
}
export async function updateProduct(id, product) {
  const response = await fetch(`${API_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  if (!response.ok) {
    throw new Error('Failed to update product')
  }
  return response.json()
}
export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/api/products/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete product')
  }
  return response.json()
}