import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './page/login-page';
import ProductsPage from './page/product-page';
import Layout from './components/layout/app-layout';
import { useAuthStore } from './store/auth-store';
import './App.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
}

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <div className="min-h-screen max-w-full bg-[#070f26]">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/products" replace /> : <Login />
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
