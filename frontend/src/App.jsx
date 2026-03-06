import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';
import DealsPage from './pages/DealsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { 
  TrackOrderPage, 
  ReturnsPage, 
  SizeGuidePage, 
  ContactPage, 
  FAQPage 
} from './pages/SupportPages';


const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          
          <Route path="/orders" element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminPage />
            </ProtectedRoute>
          } />
          
          <Route path="/deals" element={<DealsPage />} />

          {/* Support Routes */}
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/returns-exchanges" element={<ReturnsPage />} />
          <Route path="/size-guide" element={<SizeGuidePage />} />
          <Route path="/contact-us" element={<ContactPage />} />
          <Route path="/faqs" element={<FAQPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
