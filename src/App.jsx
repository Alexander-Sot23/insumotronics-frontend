import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Home from './pages/Home'
import Inventory from './pages/Inventory'
import ManageInventory from './pages/ManageInventory'
import ManageOrders from './pages/ManageOrders'
import ProductDetails from './pages/ProductDetails'
import Profile from './pages/Profile'
import Cart from './pages/Cart'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

        {/* Rutas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/manage-inventory" element={<ManageInventory />} />
          <Route path="/manage-orders" element={<ManageOrders />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
        </Route>

        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
