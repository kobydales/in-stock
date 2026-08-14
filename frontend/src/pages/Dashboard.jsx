import { useState, useEffect } from 'react'
import { fetchTestData } from '../services/api'

function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTestData()
      .then((result) => setData(result))
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div>
      <p>Welcome to your inventory dashboard.</p>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {data && (
        <ul>
          {data.data.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dashboard