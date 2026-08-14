const API_URL = 'http://localhost:5050'

export async function fetchTestData() {
  const response = await fetch(`${API_URL}/api/test`)
  if (!response.ok) {
    throw new Error('Failed to fetch data')
  }
  return response.json()
}