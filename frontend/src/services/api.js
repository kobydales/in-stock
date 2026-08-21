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

export async function fetchCategories() {
  const response = await fetch(`${API_URL}/api/categories`)
  if (!response.ok) throw new Error('Failed to fetch categories')
  return response.json()
}

export async function createCategory(category) {
  const response = await fetch(`${API_URL}/api/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  })
  if (!response.ok) throw new Error('Failed to create category')
  return response.json()
}

export async function updateCategory(id, category) {
  const response = await fetch(`${API_URL}/api/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  })
  if (!response.ok) throw new Error('Failed to update category')
  return response.json()
}

export async function deleteCategory(id) {
  const response = await fetch(`${API_URL}/api/categories/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete category')
  return response.json()
}

export async function fetchSuppliers() {
  const response = await fetch(`${API_URL}/api/suppliers`)
  if (!response.ok) throw new Error('Failed to fetch suppliers')
  return response.json()
}

export async function createSupplier(supplier) {
  const response = await fetch(`${API_URL}/api/suppliers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(supplier),
  })
  if (!response.ok) throw new Error('Failed to create supplier')
  return response.json()
}

export async function updateSupplier(id, supplier) {
  const response = await fetch(`${API_URL}/api/suppliers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(supplier),
  })
  if (!response.ok) throw new Error('Failed to update supplier')
  return response.json()
}

export async function deleteSupplier(id) {
  const response = await fetch(`${API_URL}/api/suppliers/${id}`, {
    method: 'DELETE',
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to record stock in')
  }
  return response.json()
}

export async function stockOut(data) {
  const response = await fetch(`${API_URL}/api/stock-movements/out`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to record stock out')
  }
  return response.json()
}

export async function fetchDashboardStats() {
  const response = await fetch(`${API_URL}/api/dashboard/stats`)
  if (!response.ok) throw new Error('Failed to fetch stats')
  return response.json()
}

export async function fetchRecentMovements() {
  const response = await fetch(`${API_URL}/api/dashboard/recent-movements`)
  if (!response.ok) throw new Error('Failed to fetch recent movements')
  return response.json()
}

export async function fetchMovementChart() {
  const response = await fetch(`${API_URL}/api/dashboard/movement-chart`)
  if (!response.ok) throw new Error('Failed to fetch chart data')
  return response.json()
}