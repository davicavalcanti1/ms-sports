import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AdminRoute from './components/layout/AdminRoute'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Admin from './pages/Admin'
import Login from './pages/Login'

function App() {
  const hostname = window.location.hostname;
  const isAdminSubdomain = hostname === 'admin.mssports.online' || hostname.startsWith('admin.');

  if (isAdminSubdomain) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AdminRoute />}>
          <Route path="/" element={<Admin />} />
          <Route path="/admin" element={<Navigate to="/" replace />} />
          <Route path="/*" element={<Admin />} />
        </Route>
      </Routes>
    )
  }

  // Regular Storefront Routing
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  )
}

export default App
