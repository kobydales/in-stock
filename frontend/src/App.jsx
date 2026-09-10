import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Suppliers from './pages/Suppliers'
import Inventory from './pages/Inventory'
import Reports from './pages/Reports'
import Categories from './pages/Categories'
import StockIn from './pages/StockIn'
import StockOut from './pages/StockOut'
import LowStock from './pages/LowStock'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import History from './pages/History'
import Platform from './pages/Platform'
import PlatformBusinessDetail from './pages/PlatformBusinessDetail'
import Team from './pages/Team'
import AdminRoute from './components/AdminRoute'
import PlatformRoute from './components/PlatformRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/suppliers" element={<Suppliers />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/stock-in" element={<StockIn />} />
                  <Route path="/stock-out" element={<StockOut />} />
                  <Route path="/low-stock" element={<LowStock />} />
                  <Route path="/reports" element={<AdminRoute><Reports /></AdminRoute>} />
                  <Route path="/team" element={<AdminRoute><Team /></AdminRoute>} />
                  <Route path="/history" element={<History />} />
                  <Route path="/platform" element={<PlatformRoute><Platform /></PlatformRoute>} />
                  <Route path="/platform/businesses/:id" element={<PlatformRoute><PlatformBusinessDetail /></PlatformRoute>} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App