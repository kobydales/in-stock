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